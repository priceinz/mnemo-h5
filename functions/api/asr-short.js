// functions/api/asr-short.js — 通义语音识别
// 两步走：submit（提交任务）+ poll（查结果）
// 每次请求都快速返回，不会超时

export async function onRequestPost(context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  const apiKey = context.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'DASHSCOPE_API_KEY 未配置' }), { status: 500, headers });
  }

  try {
    const contentType = context.request.headers.get('content-type') || '';

    // ===== POLL: JSON request with task_id =====
    if (contentType.includes('application/json')) {
      const { task_id } = await context.request.json();
      if (!task_id) {
        return new Response(JSON.stringify({ error: '缺少 task_id' }), { status: 400, headers });
      }

      const pollRes = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${task_id}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });

      if (!pollRes.ok) {
        return new Response(JSON.stringify({ status: 'error', error: `查询失败 ${pollRes.status}` }), { status: 200, headers });
      }

      const pollData = await pollRes.json();
      const taskStatus = pollData?.output?.task_status;

      if (taskStatus === 'SUCCEEDED') {
        const resultUrl = pollData?.output?.results?.[0]?.transcription_url;
        if (resultUrl) {
          const transRes = await fetch(resultUrl);
          const transData = await transRes.json();
          const sentences = transData?.transcripts?.[0]?.sentences || [];
          const text = sentences.map(s => s.text).join('') || transData?.transcripts?.[0]?.text || '';
          return new Response(JSON.stringify({ status: 'done', text }), { status: 200, headers });
        }
        return new Response(JSON.stringify({ status: 'done', text: '' }), { status: 200, headers });
      }

      if (taskStatus === 'FAILED') {
        return new Response(JSON.stringify({ status: 'failed', error: pollData?.output?.message || '识别失败' }), { status: 200, headers });
      }

      return new Response(JSON.stringify({ status: 'running' }), { status: 200, headers });
    }

    // ===== SUBMIT: FormData with audio file =====
    const formData = await context.request.formData();
    const audioFile = formData.get('audio');
    if (!audioFile) {
      return new Response(JSON.stringify({ error: '没有音频文件' }), { status: 400, headers });
    }

    // Convert audio to base64 (avoid file upload timeout)
    const buf = await audioFile.arrayBuffer();
    const u8 = new Uint8Array(buf);
    let bin = '';
    for (let i = 0; i < u8.length; i += 8192) {
      bin += String.fromCharCode.apply(null, u8.subarray(i, Math.min(i + 8192, u8.length)));
    }
    const b64 = btoa(bin);
    const dataUrl = `data:audio/webm;base64,${b64}`;

    // Submit async transcription task (returns immediately)
    const taskRes = await fetch('https://dashscope.aliyuncs.com/api/v1/services/audio/asr/transcription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-DashScope-Async': 'enable',
      },
      body: JSON.stringify({
        model: 'paraformer-v2',
        input: { file_urls: [dataUrl] },
        parameters: { language_hints: ['zh'] },
      }),
    });

    if (!taskRes.ok) {
      const errText = await taskRes.text();
      return new Response(JSON.stringify({
        error: `提交失败 ${taskRes.status}`,
        detail: errText.slice(0, 300),
      }), { status: 500, headers });
    }

    const taskData = await taskRes.json();
    const taskId = taskData?.output?.task_id;

    if (!taskId) {
      return new Response(JSON.stringify({
        error: '未获取到任务ID',
        detail: JSON.stringify(taskData).slice(0, 300),
      }), { status: 500, headers });
    }

    // 立刻返回 task_id，前端自己轮询
    return new Response(JSON.stringify({ task_id: taskId }), { status: 200, headers });

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
