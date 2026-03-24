// functions/api/ai.js — 智谱 AI（支持纠错 + 会议纪要 + 灵感合成 + 待办拆分）

export async function onRequestPost(context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  const apiKey = context.env.ZHIPU_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ZHIPU_API_KEY not configured' }), { status: 500, headers });
  }

  try {
    const { type, content, prompt } = await context.request.json();

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'text_correct') {
      // 语音识别纠错 — 修正错别字、谐音错误，保持原意
      systemPrompt = `你是语音识别纠错助手。用户的文字是从语音识别得到的，可能有错别字和谐音错误。

规则：
1. 只修正明显的错别字和谐音错误（如"神经"→"审计"、"报高"→"报告"、"何童"→"合同"）
2. 去掉语气词（嗯、啊、额、emm、那个、就是说）
3. 不要改变原文的意思和结构
4. 不要添加原文没有的内容
5. 不要加任何解释，直接输出纠正后的文字
6. 如果原文没有错误，原样输出`;
      userPrompt = prompt || content.text || '';

    } else if (type === 'meeting_minutes') {
      systemPrompt = '你是一个专业的会议纪要助手。请根据以下会议录音的文字内容，生成结构化的会议纪要。包含：会议要点、决策事项、待办任务（标注负责人）、下一步计划。格式清晰，用序号列出。';
      userPrompt = `会议标题：${content.title}\n\n会议录音转写内容：\n${content.transcript || '（录音转写内容）'}\n\n请生成会议纪要。`;

    } else if (type === 'idea_synthesis') {
      systemPrompt = '你是一个创意顾问和产品策划师。用户会给你几条零散的灵感/想法，请帮助整合分析，找出共同主线，提出可执行的方案建议。回复要简洁有力，有条理。';
      userPrompt = `我的灵感碎片：\n${content.ideas.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n${prompt ? `我的指令：${prompt}` : '请帮我整理分析这些灵感，找出共同主线并给出建议。'}`;

    } else if (type === 'todo_parse') {
      systemPrompt = `你是语音待办助手。用户用语音说了一段话，请提取出真正的待办事项。

规则：
1. 过滤掉所有语气词（嗯、emm、额、那个、然后、就是等）
2. 如果用户反复说同一件事（比如犹豫、纠正），只保留最终版本
3. 合并重复内容，去重
4. 每条待办精简到核心内容
5. 修正明显的语音识别错别字（如"神经"→"审计"、"报高"→"报告"）
6. 如果提到时间（如3点、下午5点、明天上午），用"HH:MM"格式标注
7. 输出格式：每行一条，格式为 "待办内容 | HH:MM"（没时间就不加 | 和时间）`;
      userPrompt = prompt || content.text || '';

    } else {
      return new Response(JSON.stringify({ error: 'Invalid type' }), { status: 400, headers });
    }

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: type === 'text_correct' ? 0.1 : 0.7,
        max_tokens: type === 'text_correct' ? 500 : 2000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: 'AI service error', detail: errText }), { status: 500, headers });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || '';
    return new Response(JSON.stringify({ result }), { status: 200, headers });

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
