# AI Talent Demo

> AI-Powered Talent Insight — 天赋雷达 · 名人匹配 · 职业推荐

一个以 AI 对话驱动的天赋发现产品 Demo。用户通过 3 步对话描述自己的高光时刻，AI 分析后生成天赋雷达图、名人匹配和职业推荐。

## 产品流程

```
欢迎页 → AI 对话引导(3步) → AI 分析动画 → 天赋报告(4 Tab)
```

| 阶段 | 页面 | 核心体验 |
|------|------|----------|
| Welcome | WelcomeScreen | InsightOrb 呼吸动画 + 品牌入场 |
| Onboard | AIChatOnboarding | 对话式天赋发现，AI 逐条确认 |
| Analysis | AIAnalysisScreen | 4 步管线动画（分析→匹配→推荐→生成） |
| Report | ReportDashboard | 总览/名人/职业/我的 4 Tab |

## 核心功能

- **对话式天赋发现** — AI 引导用户描述 3 个高光时刻，取代传统表单
- **天赋雷达图** — ECharts 8 维度可视化，支持交互缩放
- **名人匹配** — 基于天赋维度匹配历史名人，可展开详情
- **职业推荐** — 含发展路径、技能要求的结构化推荐卡片
- **InsightOrb** — 贯穿全流程的 AI 之眼视觉符号（4 种生命状态）
- **PhaseTransition** — 阶段切换全屏光效过渡动画

## 技术栈

| 技术 | 用途 |
|------|------|
| Vite 8 | 构建工具 |
| React 19 | UI 框架 |
| Tailwind CSS v4 | 样式系统（爱马仕橙主题） |
| Framer Motion | 动画引擎 |
| ECharts 6 | 雷达图可视化 |
| Lucide React | 图标库 |

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/linyi0422/ai-talent-demo.git
cd ai-talent-demo

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── App.jsx                    # 状态机驱动（5 阶段 phase）
├── index.css                  # 全局样式 + 3 级阴影体系
├── components/
│   ├── WelcomeScreen.jsx      # 欢迎页
│   ├── AIChatOnboarding.jsx   # AI 对话引导
│   ├── AIAnalysisScreen.jsx   # AI 分析动画
│   ├── ReportDashboard.jsx    # 报告仪表盘（4 Tab）
│   ├── InsightOrb.jsx         # AI 之眼视觉符号
│   ├── PhaseTransition.jsx    # 阶段切换过渡
│   ├── TalentRadarChart.jsx   # 天赋雷达图
│   ├── CelebrityMatchCard.jsx # 名人匹配卡片
│   ├── CareerRecommendationCard.jsx # 职业推荐卡片
│   ├── TalentScoreBar.jsx     # 天赋得分条
│   ├── TalentInterpretationCard.jsx # 天赋解读卡
│   ├── MobileFrame.jsx        # 移动端壳层
│   └── ...
└── data/
    ├── mockUser.js            # 用户模拟数据
    ├── celebrities.js         # 名人库
    └── careers.js             # 职业库
```

## 设计体系

- **色彩**：爱马仕橙（Hermès Orange）为品牌色，奶油白为底色
- **阴影**：3 级柔光阴影（card-shadow / card-elevated / card-floating）
- **圆角**：卡片 24px（rounded-3xl）、按钮/输入 16px（rounded-2xl）
- **过渡**：cubic-bezier(0.4, 0, 0.2, 1) 标准化缓动
- **玻璃拟态**：glass-card 毛玻璃效果 + hover 状态

## License

MIT
