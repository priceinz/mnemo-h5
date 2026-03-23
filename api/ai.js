// api/ai.js — 智谱 AI 中转接口
// 处理：会议纪要生成 + 灵感 AI 合成

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ZHIPU_API_KEY not configured' });

  try {
    const { type, content, prompt } = req.body;

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'meeting_minutes') {
      // 会议纪要生成
      systemPrompt = '你是一个专业的会议纪要助手。请根据以下会议录音的文字内容，生成结构化的会议纪要。包含：会议要点、决策事项、待办任务（标注负责人）、下一步计划。格式清晰，用序号列出。';
      userPrompt = `会议标题：${content.title}\n\n会议录音转写内容：\n${content.transcript || '（录音转写内容）'}\n\n请生成会议纪要。`;
    } else if (type === 'idea_synthesis') {
      // 灵感合成
      systemPrompt = '你是一个创意顾问和产品策划师。用户会给你几条零散的灵感/想法，请帮助整合分析，找出共同主线，提出可执行的方案建议。回复要简洁有力，有条理。';
      userPrompt = `我的灵感碎片：\n${content.ideas.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n${prompt ? `我的指令：${prompt}` : '请帮我整理分析这些灵感，找出共同主线并给出建议。'}`;
    } else {
      return res.status(400).json({ error: 'Invalid type. Use "meeting_minutes" or "idea_synthesis"' });
    }

    // 调用智谱 AI API
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'glm-4-flash',  // 免费模型，速度快
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Zhipu API error:', errText);
      return res.status(500).json({ error: 'AI service error', detail: errText });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || '生成失败，请重试';

    return res.status(200).json({ result });

  } catch (error) {
    console.error('AI handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}
