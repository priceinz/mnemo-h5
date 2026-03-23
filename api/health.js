// api/health.js — 健康检查
export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    services: {
      zhipu: !!process.env.ZHIPU_API_KEY,
      tencent_asr: !!process.env.TENCENT_SECRET_ID && !!process.env.TENCENT_SECRET_KEY,
    },
  });
}
