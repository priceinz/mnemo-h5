// functions/api/asr-long.js — 通义语音识别（长录音：会议，支持说话人分离）
// 两个 action: submit（提交任务）和 poll（查询结果）

export async function onRequestPost(context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  const apiKey = context.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'DASHSCOPE_API_KEY not configured' }), { status: 500, headers });
  }

  try {
    // Check if this is a poll request (JSON body with action + task_id)
    const contentType = context.request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const { action, task_id } = await context.request.json();

      if (action === 'poll' && task_id) {
        const pollRes = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${task_id}`, {
          headers: { 'Authorization': `Bearer ${apiKey}` },
        });

        if (!pollRes.ok) {
          return new Response(JSON.stringify({ status: 'error', error: 'Poll request failed' }), { status: 500, headers });
        }

        const pollData = await pollRes.json();
        const taskStatus = pollData?.output?.task_status;

        if (taskStatus === 'SUCCEEDED') {
          const resultUrl = pollData?.output?.results?.[0]?.transcription_url;
          let fullText = '';

          if (resultUrl) {
            const transRes = await fetch(resultUrl);
            const transData = await transRes.json();
            const transcripts = transData?.transcripts || [];

            if (transcripts.length > 0) {
              const sentences = transcripts[0]?.sentences || [];
              let currentSpeaker = -1;

              sentences.forEach(s => {
                if (s.speaker_id !== undefined && s.speaker_id !== currentSpeaker) {
                  currentSpeaker = s.speaker_id;
                  fullText += `\n\n【说话人${currentSpeaker + 1}】\n`;
                }
                fullText += (s.text || '');
              });

              if (!fullText.trim()) {
                fullText = transcripts[0]?.text || '';
              }
            }
          }

          return new Response(JSON.stringify({
            status: 'completed',
            text: fullText.trim(),
          }), { status: 200, headers });
        }

        if (taskStatus === 'FAILED') {
          return new Response(JSON.stringify({
            status: 'failed',
            error: pollData?.output?.message || '识别失败',
          }), { status: 200, headers });
        }

        return new Response(JSON.stringify({
          status: 'running',
          message: taskStatus || 'PROCESSING',
        }), { status: 200, headers });
      }

      return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers });
    }

    // This is a submit request (multipart form data with audio file)
    const formData = await context.request.formData();
    const audioFile = formData.get('audio');
    if (!audioFile) {
      return new Response(JSON.stringify({ error: 'No audio file' }), { status: 400, headers });
    }

    // Step 1: Upload file to DashScope
    const uploadForm = new FormData();
    uploadForm.append('file', audioFile, audioFile.name || 'meeting.webm');
    uploadForm.append('purpose', 'file-extract');

    const uploadRes = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/files', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: uploadForm,
    });

    let fileUrl = '';

    if (uploadRes.ok) {
      const uploadData = await uploadRes.json();
      fileUrl = `dashscope://file/${uploadData.id}`;
    } else {
      // Fallback: try with base64 data URI (might fail for large files)
      const arrayBuffer = await audioFile.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i]);
      fileUrl = `data:audio/webm;base64,${btoa(binary)}`;
    }

    // Step 2: Submit async transcription task with speaker diarization
    const taskRes = await fetch('https://dashscope.aliyuncs.com/api/v1/services/audio/asr/transcription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-DashScope-Async': 'enable',
      },
      body: JSON.stringify({
        model: 'paraformer-v2',
        input: { file_urls: [fileUrl] },
        parameters: {
          language_hints: ['zh'],
          diarization_enabled: true,
          speaker_count: 0, // auto-detect speaker count
        },
      }),
    });

    if (!taskRes.ok) {
      const errText = await taskRes.text();
      return new Response(JSON.stringify({ error: 'Task submit failed', detail: errText }), { status: 500, headers });
    }

    const taskData = await taskRes.json();
    const taskId = taskData?.output?.task_id;

    if (!taskId) {
      return new Response(JSON.stringify({ error: 'No task_id', detail: JSON.stringify(taskData) }), { status: 500, headers });
    }

    return new Response(JSON.stringify({
      status: 'submitted',
      task_id: taskId,
      message: '会议录音已提交，正在识别中...',
    }), { status: 200, headers });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
