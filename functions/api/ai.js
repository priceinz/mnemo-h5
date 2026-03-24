// functions/api/ai.js — 智谱 AI（纠错+纪要+灵感+待办）v3

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
      systemPrompt = `你是语音识别纠错专家。用户的文字来自手机浏览器语音识别，经常出现谐音错字。

核心规则：
1. 根据语境智能修正谐音错字，不确定时倾向于修正为常用词
2. 去掉所有语气词和口头禅（嗯、啊、额、emm、那个、就是说、然后、对、对对对、怎么说呢、反正就是）
3. 不改变原意，不添加内容，不加解释
4. 直接输出纠正后的文字

常见纠错词库（根据上下文判断，不限于此表）：

【食材食品】
盒马/合马/河马/何马 → 盒马（盒马鲜生超市）
黄姜/黄江/荒疆/皇姜 → 黄姜
生姜/声江/升姜 → 生姜
花椒/花焦/划椒 → 花椒
八角/巴角/八脚 → 八角
桂皮/贵皮/归皮 → 桂皮
香菜/想菜/湘菜 → 香菜（根据语境也可能是湘菜）
豆腐/斗腐 → 豆腐
牛腩/牛南/纽南 → 牛腩
三文鱼/三纹鱼 → 三文鱼
车厘子/车力子 → 车厘子
榴莲/流连/留恋 → 榴莲（食物语境）
菠萝蜜/波罗密 → 菠萝蜜
山姆/三姆/伞姆 → 山姆（山姆会员店）

【购物平台】
拼多多/拼多朵/品多多 → 拼多多
美团/没团/镁团/没团 → 美团
饿了么/饿了嘛/呃了么 → 饿了么
淘宝/讨保/涛宝/桃宝 → 淘宝
京东/精东/经东 → 京东
星巴克/新巴克/星八克 → 星巴克
海底捞/海底劳/海底涝 → 海底捞
瑞幸/瑞星/锐幸/瑞兴 → 瑞幸
Costco/可思扣/开市客 → Costco
优惠券/优惠卷 → 优惠券
快递/快地 → 快递

【工作商务】
审计/神经/审机/身计 → 审计
尽调/尽掉/禁调/近调 → 尽调（尽职调查）
合规/何归/合归/河归 → 合规
风控/风空/疯控/封控 → 风控（根据语境也可能是封控）
立项/利项/力项 → 立项
报告/报高/包告 → 报告
合同/何童/和同/河童 → 合同
方案/防案/放案 → 方案
会议/回忆/汇议 → 会议（工作语境）
招标/找标/招彪 → 招标
投标/头标/偷标 → 投标
预算/预蒜/玉算 → 预算
复盘/副盘/福盘 → 复盘
排期/排其/牌期 → 排期
迭代/叠带/碟代 → 迭代
上线/商线/上限 → 上线（根据语境）
需求/须求/需球 → 需求
PPT/皮皮踢/屁屁踢 → PPT
OKR/欧科瑞 → OKR
KPI/开皮爱 → KPI
对账/对帐/堆账 → 对账
资产/自产/紫蚕 → 资产
负债/副债/附债 → 负债
利润/利闰/力润 → 利润
监察/监查/鉴查 → 监察

【科技互联网】
GitHub/给他哈伯 → GitHub
微信/为信/威信 → 微信
抖音/都因/斗音 → 抖音
小红书/小洪书/小宏书 → 小红书
ChatGPT/恰特鸡屁踢 → ChatGPT
人工智能/人工志能 → 人工智能
算法/蒜法/算阀 → 算法
数据/书据/树据 → 数据
服务器/福务器/副务器 → 服务器
代码/带码/戴码 → 代码

【交通出行】
高铁/搞铁 → 高铁
地铁/弟铁 → 地铁
滴滴/低低/嘀嘀 → 滴滴
导航/到航 → 导航

【常见动词】
安排/按排/暗排 → 安排
沟通/够通/勾通 → 沟通
确认/确人/去认 → 确认
提交/体交/踢交 → 提交
汇报/回报/毁报 → 汇报（工作语境）`;
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
2. 修正明显的语音识别错别字（参考常见谐音错误：神经→审计、报高→报告、合马→盒马等）
3. 如果用户反复说同一件事（犹豫、纠正），只保留最终版本
4. 合并重复内容，去重
5. 每条待办精简到核心内容
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
