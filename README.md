# AI PM Gym

AI 产品经理知识训练平台。通过闪卡练习帮助 PM 系统掌握 AI 产品相关概念，支持双向记忆、错题攻克和学习统计。

**在线访问：** https://ai-pm-gym-delta.vercel.app

## 功能

- **训练模式** — 双向闪卡（概念 → 解释 / 解释 → 概念），间隔记忆
- **复习** — 按轮次回顾已学内容
- **待攻克** — 标记难点卡片，集中强化
- **统计** — 学习进度、正确率、各方向分布

## 技术栈

- React 19 + React Router v7
- Vite 8
- Supabase（数据库 + 实时同步）
- 部署：Vercel

## 本地运行

```bash
npm install
# 在 .env 中配置 Supabase 凭证（参考 .env.example）
npm run dev
```
