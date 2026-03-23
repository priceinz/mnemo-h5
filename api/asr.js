// api/asr.js — 腾讯云语音识别中转接口
// 接收前端上传的音频文件，调用腾讯 ASR 返回文字

import crypto from 'crypto';

// 腾讯云签名 v3
function sign(secretId, secretKey, service, action, payload) {
  const timestamp = Math.floor(Date.now() / 1000);
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10);

  // 1. 拼接规范请求
  const hashedPayload = crypto.createHash('sha256').update(payload).digest('hex');
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
  const hashedCanonical = crypto.createHash('sha256').update(canonicalRequest).digest('hex');
  const stringToSign = `TC3-HMAC-SHA256\n${timestamp}\n${credentialScope}\n${hashedCanonical}`;

  // 3. 计算签名
  const secretDate = crypto.createHmac('sha256', `TC3${secretKey}`).update(date).digest();
  const secretService = crypto.createHmac('sha256', secretDate).update(service).digest();
  const secretSigning = crypto.createHmac('sha256', secretService).update('tc3_request').digest();
  const signature = crypto.createHmac('sha256', secretSigning).update(stringToSign).digest('hex');

  // 4. 拼接 Authorization
  const authorization = `TC3-HMAC-SHA256 Credential=${secretId}/${credentialScope}, SignedHeaders=content-type;host, Signature=${signature}`;

  return { authorization, timestamp };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secretId = process.env.TENCENT_SECRET_ID;
  const secretKey = process.env.TENCENT_SECRET_KEY;
  if (!secretId || !secretKey) {
    return res.status(500).json({ error: 'Tencent credentials not configured' });
  }

  try {
    const { audio, format } = req.body;
    // audio: base64 编码的音频数据
    // format: 音频格式，如 "mp3", "wav", "webm"

    if (!audio) {
      return res.status(400).json({ error: 'No audio data provided' });
    }

    // 腾讯云一句话识别 API
    const service = 'asr';
    const action = 'SentenceRecognition';
    const payload = JSON.stringify({
      EngSerViceType: '16k_zh',     // 中文 16k
      SourceType: 1,                 // 音频数据 base64
      VoiceFormat: format || 'mp3',
      Data: audio,
      DataLen: audio.length,
    });

    const { authorization, timestamp } = sign(secretId, secretKey, service, action, payload);

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
      return res.status(500).json({
        error: 'ASR service error',
        detail: data.Response.Error.Message,
      });
    }

    const text = data.Response?.Result || '';
    return res.status(200).json({ text });

  } catch (error) {
    console.error('ASR handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Vercel config: allow larger body for audio uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
