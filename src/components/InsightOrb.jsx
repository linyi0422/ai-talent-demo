import { motion } from 'framer-motion'

/**
 * InsightOrb — AI 洞察之眼
 *
 * 整个品牌的视觉锚点符号。
 * 在不同阶段呈现不同的"生命状态"，为 AI 赋予人格化的在场感。
 *
 * 状态:
 *   dormant  — 休眠态（欢迎页）：缓慢呼吸，宁静
 *   focused  — 聚焦态（对话输入）：跟随用户，轻微摇曳
 *   active   — 激活态（分析中）：快速旋转，脉冲
 *   insight  — 洞察态（报告页）：定格为徽章，稳定发光
 *
 * size: 'sm' | 'md' | 'lg'
 */

const ringVariants = {
  dormant: {
    scale: [1, 1.06, 1],
    opacity: [0.5, 0.7, 0.5],
  },
  focused: {
    scale: [1, 0.96, 1.04, 1],
    opacity: [0.6, 0.85, 0.7, 0.6],
  },
  active: {
    scale: [1, 0.92, 1.08, 1],
    opacity: [0.7, 0.95, 0.6, 0.7],
  },
  insight: {
    scale: 1,
    opacity: 0.8,
  },
}

const ringTransition = {
  dormant: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  focused: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  active: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  insight: { duration: 0, repeat: 0 },
}

const coreVariants = {
  dormant: {
    scale: [1, 1.1, 1],
    opacity: [0.8, 1, 0.8],
  },
  focused: {
    scale: [1, 0.92, 1.08, 1],
    opacity: [0.9, 1, 0.85, 0.9],
  },
  active: {
    scale: [1, 0.85, 1.15, 1],
    opacity: [1, 0.7, 1, 1],
  },
  insight: {
    scale: 1,
    opacity: 1,
  },
}

const coreTransition = {
  dormant: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  focused: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  active: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
  insight: { duration: 0, repeat: 0 },
}

const sizeMap = {
  sm: { container: 40, outer: 38, mid: 26, inner: 14, core: 6 },
  md: { container: 56, outer: 52, mid: 36, inner: 20, core: 8 },
  lg: { container: 72, outer: 66, mid: 46, inner: 26, core: 10 },
}

export default function InsightOrb({ state = 'dormant', size = 'md', className = '' }) {
  const dims = sizeMap[size]

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: dims.container, height: dims.container }}
      role="img"
      aria-label={`AI 洞察之眼 - ${state === 'dormant' ? '休眠' : state === 'focused' ? '聚焦' : state === 'active' ? '激活' : '洞察'}`}
    >
      <svg
        viewBox="0 0 72 72"
        width={dims.container}
        height={dims.container}
        className="overflow-visible"
      >
        <defs>
          {/* 外环渐变 */}
          <linearGradient id="orb-outer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8A00" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFB873" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FF8A00" stopOpacity="0.8" />
          </linearGradient>

          {/* 核心光点渐变 */}
          <radialGradient id="orb-core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF8A00" stopOpacity="1" />
            <stop offset="40%" stopColor="#FFA133" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF8A00" stopOpacity="0.3" />
          </radialGradient>

          {/* 光芒滤镜 */}
          <filter id="orb-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 外层细环 — 爱马仕橙 */}
        <motion.circle
          cx="36" cy="36" r="33"
          fill="none"
          stroke="url(#orb-outer-grad)"
          strokeWidth="1.5"
          animate={ringVariants[state]}
          transition={ringTransition[state]}
          style={{ transformOrigin: '36px 36px' }}
        />

        {/* 中层半透明环 — 深灰 */}
        <motion.circle
          cx="36" cy="36" r="23"
          fill="none"
          stroke="#2B313F"
          strokeWidth="0.8"
          strokeOpacity="0.15"
          animate={{
            scale: state === 'active' ? [1, 1.05, 0.95, 1] : [1, 1.03, 1],
            opacity: state === 'active' ? [0.15, 0.25, 0.15] : [0.12, 0.18, 0.12],
          }}
          transition={{
            duration: state === 'active' ? 1 : 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '36px 36px' }}
        />

        {/* 内层虚线环 — 代表未完成的分析维度 */}
        <motion.circle
          cx="36" cy="36" r="16"
          fill="none"
          stroke="#2B313F"
          strokeWidth="0.6"
          strokeOpacity="0.12"
          strokeDasharray="3 4"
          animate={{
            rotate: state === 'active' ? [0, 360] : 0,
          }}
          transition={
            state === 'active'
              ? { duration: 6, repeat: Infinity, ease: 'linear' }
              : { duration: 0 }
          }
          style={{ transformOrigin: '36px 36px' }}
        />

        {/* 核心光点 */}
        <motion.circle
          cx="36" cy="36" r="5"
          fill="url(#orb-core-grad)"
          filter="url(#orb-glow)"
          animate={coreVariants[state]}
          transition={coreTransition[state]}
          style={{ transformOrigin: '36px 36px' }}
        />
      </svg>

      {/* 状态标签（仅在 active 态显示） */}
      {state === 'active' && (
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-[9px] font-medium text-hermes-500 bg-hermes-50/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-hermes-100/50">
            AI 分析中
          </span>
        </motion.div>
      )}
    </div>
  )
}
