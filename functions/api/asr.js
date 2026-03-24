// functions/api/asr.js - 腾讯云语音识别 (Cloudflare Pages Functions 格式)
// 将 Node.js crypto 转换为 Web Crypto API

// Web Crypto API 实现的 HMAC-SHA256
async function hmacSha256(key, data) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    typeof key === 'string' ? new TextEncoder().encode(key) : key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data));
  return new Uint8Array(signature);
}

// SHA256 哈希
async function sha256(data) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// 腾讯云签名 v3 (使用 Web Crypto API)
async function sign(secretId, secretKey, service, action, payload) {
  const timestamp = Math.floor(Date.now() / 1000);
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10);

  // 1. 拼接规范请求
  const hashedPayload = await sha256(payload);
  const canonicalRequest = [
    'POST',
    '/',
    '',
    'content-type:application/json',
    `host:${service}.tencentcloudapi.com`,
    '',
    'content-type;host',
    hashedPayload,
  ].join('\n');

  // 2. 拼接待签名字符串
  const credentialScope = `${date}/${service}/tc3_request`;
  const hashedCanonical = await sha256(canonicalRequest);
  const stringToSign = `TC3-HMAC-SHA256\n${timestamp}\n${credentialScope}\n${hashedCanonical}`;

  // 3. 计算签名
  const secretDate = await hmacSha256(`TC3${secretKey}`, date);
  const secretService = await hmacSha256(secretDate, service);
  const secretSigning = await hmacSha256(secretService, 'tc3_request');
  const signature = await hmacSha256(secretSigning, stringToSign);
  const signatureHex = Array.from(signature).map(b => b.toString(16).padStart(2, '0')).join('');

  // 4. 拼接 Authorization
  const authorization = `TC3-HMAC-SHA256 Credential=${secretId}/${credentialScope}, SignedHeaders=content-type;host, Signature=${signatureHex}`;

  return { authorization, timestamp };
}

export async function onRequestPost(context) {
  const { env, request } = context;

  const secretId = env.TENCENT_SECRET_ID;
  const secretKey = env.TENCENT_SECRET_KEY;

  if (!secretId || !secretKey) {
    return new Response(
      JSON.stringify({ error: 'Tencent credentials not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  try {
    const { audio, format } = await request.json();

    if (!audio) {
      return new Response(
        JSON.stringify({ error: 'No audio data provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // 腾讯云一句话识别 API
    // 支持格式: pcm, wav, mp3, ogg-speex, ogg-opus, flac, silk, aac, m4a
    const service = 'asr';
    const action = 'SentenceRecognition';

    // 将格式映射为腾讯云支持的格式
    const formatMapping = {
      'webm': 'mp3',    // webm 用 mp3 尝试识别
      'mp4': 'm4a',     // mp4 音频用 m4a
      'aac': 'aac',
      'mp3': 'mp3',
      'wav': 'wav',
      'm4a': 'm4a',
    };

    const voiceFormat = formatMapping[format] || 'mp3';

    const payload = JSON.stringify({
      EngSerViceType: '16k_zh',
      SourceType: 1,
      VoiceFormat: voiceFormat,
      Data: audio,
      DataLen: audio.length,
    });

    const { authorization, timestamp } = await sign(secretId, secretKey, service, action, payload);

    const response = await fetch('https://asr.tencentcloudapi.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Host': 'asr.tencentcloudapi.com',
        'Authorization': authorization,
        'X-TC-Action': action,
        'X-TC-Version': '2019-06-14',
        'X-TC-Timestamp': String(timestamp),
        'X-TC-Region': 'ap-shanghai',
      },
      body: payload,
    });

    const data = await response.json();

    if (data.Response?.Error) {
      console.error('Tencent ASR error:', data.Response.Error);
      return new Response(
        JSON.stringify({
          error: 'ASR service error',
          detail: data.Response.Error.Message,
          code: data.Response.Error.Code,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const text = data.Response?.Result || '';
    return new Response(
      JSON.stringify({ text }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );

  } catch (error) {
    console.error('ASR handler error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

// 处理 OPTIONS 预检请求
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}