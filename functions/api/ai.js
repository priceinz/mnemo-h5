// functions/api/ai.js — 智谱 AI（支持 meeting_minutes + idea_synthesis + todo_parse）

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

    if (type === 'meeting_minutes') {
      systemPrompt = '你是一个专业的会议纪要助手。请根据以下会议录音的文字内容，生成结构化的会议纪要。包含：会议要点、决策事项、待办任务（标注负责人）、下一步计划。格式清晰，用序号列出。';
      userPrompt = `会议标题：${content.title}\n\n会议录音转写内容：\n${content.transcript || '（录音转写内容）'}\n\n请生成会议纪要。`;
    } else if (type === 'idea_synthesis') {
      systemPrompt = '你是一个创意顾问和产品策划师。用户会给你几条零散的灵感/想法，请帮助整合分析，找出共同主线，提出可执行的方案建议。回复要简洁有力，有条理。';
      userPrompt = `我的灵感碎片：\n${content.ideas.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n${prompt ? `我的指令：${prompt}` : '请帮我整理分析这些灵感，找出共同主线并给出建议。'}`;
    } else if (type === 'todo_parse') {
      systemPrompt = '你是一个待办事项助手。用户会用语音输入一段话，里面可能包含多条待办事项。请把每条待办拆分出来，每行一条，只输出待办内容本身，不要加序号、不要加多余解释。如果语音里提到了具体时间（如3点、下午5点），请保留在文字里。如果只有一条就只输出一条。';
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
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: 'AI service error', detail: errText }), { status: 500, headers });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || '生成失败，请重试';
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
