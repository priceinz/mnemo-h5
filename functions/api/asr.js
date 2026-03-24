// functions/api/asr.js — 腾讯云语音识别（Cloudflare 修复版）

async function hmacSHA256(key, message) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    typeof key === 'string' ? new TextEncoder().encode(key) : key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
  return new Uint8Array(sig);
}

async function sha256Hex(message) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function uint8ArrayToHex(arr) {
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function tencentSign(secretId, secretKey, payload) {
  const service = 'asr';
  const action = 'SentenceRecognition';
  const timestamp = Math.floor(Date.now() / 1000);
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
  const host = 'asr.tencentcloudapi.com';

  const hashedPayload = await sha256Hex(payload);
  const canonicalRequest = `POST\n/\n\ncontent-type:application/json\nhost:${host}\n\ncontent-type;host\n${hashedPayload}`;

  const credentialScope = `${date}/${service}/tc3_request`;
  const hashedCanonical = await sha256Hex(canonicalRequest);
  const stringToSign = `TC3-HMAC-SHA256\n${timestamp}\n${credentialScope}\n${hashedCanonical}`;

  const secretDate = await hmacSHA256(`TC3${secretKey}`, date);
  const secretService = await hmacSHA256(secretDate, service);
  const secretSigning = await hmacSHA256(secretService, 'tc3_request');
  const signature = uint8ArrayToHex(await hmacSHA256(secretSigning, stringToSign));

  const authorization = `TC3-HMAC-SHA256 Credential=${secretId}/${credentialScope}, SignedHeaders=content-type;host, Signature=${signature}`;
  return { authorization, timestamp, action };
}

export async function onRequestPost(context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  const secretId = context.env.TENCENT_SECRET_ID;
  const secretKey = context.env.TENCENT_SECRET_KEY;
  if (!secretId || !secretKey) {
    return new Response(JSON.stringify({ error: 'Tencent credentials not configured' }), { status: 500, headers });
  }

  try {
    const { audio, format } = await context.request.json();
    if (!audio) {
      return new Response(JSON.stringify({ error: 'No audio data' }), { status: 400, headers });
    }

    const payload = JSON.stringify({
      EngSerViceType: '16k_zh',
      SourceType: 1,
      VoiceFormat: format || 'wav',
      Data: audio,
      DataLen: audio.length,
    });

    const { authorization, timestamp, action } = await tencentSign(secretId, secretKey, payload);

    // 注意：Cloudflare Workers 不允许手动设 Host，所以不设
    const response = await fetch('https://asr.tencentcloudapi.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      return new Response(JSON.stringify({
        error: 'ASR error',
        detail: data.Response.Error.Message,
        code: data.Response.Error.Code,
      }), { status: 500, headers });
    }

    return new Response(JSON.stringify({ text: data.Response?.Result || '' }), { status: 200, headers });

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
