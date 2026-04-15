// functions/api/asr-short.js — 通义语音识别（短录音）
// 只用同步接口，不轮询，避免 Cloudflare 30秒超时

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
    const formData = await context.request.formData();
    const audioFile = formData.get('audio');
    if (!audioFile) {
      return new Response(JSON.stringify({ error: '没有音频文件' }), { status: 400, headers });
    }

    // 用 OpenAI 兼容的同步接口（最快最稳定）
    const wForm = new FormData();
    wForm.append('file', audioFile, audioFile.name || 'audio.webm');
    wForm.append('model', 'sensevoice-v1');

    const res = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: wForm,
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(JSON.stringify({
        error: `DashScope 返回 ${res.status}`,
        detail: errText.slice(0, 200),
      }), { status: res.status, headers });
    }

    const data = await res.json();
    const text = data?.text?.trim() || '';

    if (!text) {
      return new Response(JSON.stringify({
        error: '识别结果为空',
        detail: JSON.stringify(data).slice(0, 200),
      }), { status: 200, headers });
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
