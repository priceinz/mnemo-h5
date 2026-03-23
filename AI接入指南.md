# MNEMO AI 接入全流程

---

## 总体架构

```
手机浏览器（你的 App）
    ↓ 录音文件 / AI 指令
Vercel Serverless Functions（免费后端，自动部署）
    ↓                    ↓
腾讯云 ASR            智谱 AI GLM-4
（语音转文字）        （会议纪要 + 灵感合成）
    ↓                    ↓
返回文字结果          返回 AI 文本
    ↓
手机浏览器显示结果
```

API 密钥存在 Vercel 环境变量里，前端看不到，安全。

---

## 第一步：申请 API Key（两个平台）

### 1.1 智谱 AI（用于会议纪要 + 灵感合成）

1. 打开 https://open.bigmodel.cn
2. 点右上角「注册」→ 手机号注册
3. 登录后进入「控制台」
4. 左侧菜单「API Keys」→ 点「创建 API Key」
5. 复制保存这个 Key（类似 `xxxxxxxx.yyyyyyyy`）

> 新用户送 500 万 tokens，够用很久。

### 1.2 腾讯云 ASR（用于语音转文字）

1. 打开 https://cloud.tencent.com
2. 注册/登录（微信扫码也行）
3. 搜索「语音识别」→ 点进去 → 开通服务
4. 进入控制台 → 左侧「访问管理」→「访问密钥」→「API 密钥管理」
5. 创建密钥，记下 **SecretId** 和 **SecretKey**

> 每月 5 小时免费识别额度。

### 记下这三个值

```
ZHIPU_API_KEY=你的智谱Key
TENCENT_SECRET_ID=你的腾讯SecretId
TENCENT_SECRET_KEY=你的腾讯SecretKey
```

---

## 第二步：在项目里创建后端 API

在你的 `h5-deploy` 文件夹里创建 `api` 目录，放 3 个文件：

```
h5-deploy/
├── api/                ← 新建
│   ├── ai.js           ← 智谱 AI（会议纪要 + 灵感合成）
│   ├── asr.js          ← 腾讯云语音转文字
│   └── health.js       ← 健康检查
├── src/
│   ├── App.jsx
│   └── main.jsx
├── package.json        ← 需要更新
└── ...
```

文件内容我已经全部写好，下载后放进去就行。

---

## 第三步：配置 Vercel 环境变量

### 方法 A：命令行配置

```powershell
cd "$HOME\Desktop\vibecoding\脑子ai助手\h5-deploy"

vercel env add ZHIPU_API_KEY
# 提示输入值 → 粘贴你的智谱 Key → 选 Production + Preview + Development → 回车

vercel env add TENCENT_SECRET_ID
# 粘贴你的腾讯 SecretId

vercel env add TENCENT_SECRET_KEY
# 粘贴你的腾讯 SecretKey
```

### 方法 B：网页配置

1. 登录 https://vercel.com
2. 进入你的 mnemo 项目
3. Settings → Environment Variables
4. 添加三个变量（Name + Value），三个环境都勾选

---

## 第四步：部署

```powershell
cd "$HOME\Desktop\vibecoding\脑子ai助手\h5-deploy"
npm install
vercel --prod
```

部署完成后，你的 App 就有完整的 AI 功能了。

---

## 功能对应关系

| App 里的操作 | 调用的 API | 后端文件 |
|---|---|---|
| 录音结束 → 自动转文字 | 腾讯云 ASR | api/asr.js |
| 会议详情 → 生成 AI 纪要 | 智谱 GLM-4 | api/ai.js |
| 灵感墙 → AI 合成 | 智谱 GLM-4 | api/ai.js |

---

## 费用估算

| 服务 | 免费额度 | 超出后价格 |
|---|---|---|
| 智谱 AI | 注册送 500 万 tokens | ¥0.1/万tokens |
| 腾讯云 ASR | 每月 5 小时 | ¥3.2/小时 |
| Vercel 部署 | 100GB 流量/月 | 基本用不完 |

**正常使用一个月花不了几块钱。**
