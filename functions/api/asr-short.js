// functions/api/asr-short.js — 通义语音识别（短录音：日记/待办/灵感）

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
    const formData = await context.request.formData();
    const audioFile = formData.get('audio');
    if (!audioFile) {
      return new Response(JSON.stringify({ error: 'No audio file' }), { status: 400, headers });
    }

    // Approach 1: Try OpenAI-compatible whisper endpoint (simplest)
    const whisperForm = new FormData();
    whisperForm.append('file', audioFile, audioFile.name || 'audio.webm');
    whisperForm.append('model', 'paraformer-v2');
    whisperForm.append('language', 'zh');

    let text = '';

    const whisperRes = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: whisperForm,
    });

    if (whisperRes.ok) {
      const whisperData = await whisperRes.json();
      text = whisperData?.text || '';
    }

    // Approach 2: Fallback to native async transcription API
    if (!text) {
      // Upload file first
      const uploadForm = new FormData();
      uploadForm.append('file', audioFile, audioFile.name || 'audio.webm');
      uploadForm.append('purpose', 'file-extract');

      const uploadRes = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/files', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` },
        body: uploadForm,
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        const fileId = uploadData?.id;

        if (fileId) {
          // Submit transcription task
          const taskRes = await fetch('https://dashscope.aliyuncs.com/api/v1/services/audio/asr/transcription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'X-DashScope-Async': 'enable',
            },
            body: JSON.stringify({
              model: 'paraformer-v2',
              input: { file_urls: [`dashscope://file/${fileId}`] },
              parameters: { language_hints: ['zh'] },
            }),
          });

          if (taskRes.ok) {
            const taskData = await taskRes.json();
            const taskId = taskData?.output?.task_id;

            // Poll for result (short audio finishes fast, ~5-10s)
            if (taskId) {
              for (let i = 0; i < 20; i++) {
                await new Promise(r => setTimeout(r, 1500));
                const pollRes = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`, {
                  headers: { 'Authorization': `Bearer ${apiKey}` },
                });
                if (!pollRes.ok) continue;
                const pollData = await pollRes.json();
                const status = pollData?.output?.task_status;

                if (status === 'SUCCEEDED') {
                  const resultUrl = pollData?.output?.results?.[0]?.transcription_url;
                  if (resultUrl) {
                    const transRes = await fetch(resultUrl);
                    const transData = await transRes.json();
                    const sentences = transData?.transcripts?.[0]?.sentences || [];
                    text = sentences.map(s => s.text).join('') || transData?.transcripts?.[0]?.text || '';
                  }
                  break;
                }
                if (status === 'FAILED') break;
              }
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({ text }), { status: 200, headers });

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
