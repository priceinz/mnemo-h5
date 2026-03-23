// Cloudflare Pages Function - Health Check
export async function onRequestGet(context) {
  const { env } = context;

  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      zhipu: !!env.ZHIPU_API_KEY,
      tencent_asr: !!(env.TENCENT_SECRET_ID && env.TENCENT_SECRET_KEY)
    }
  };

  return new Response(JSON.stringify(health), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
