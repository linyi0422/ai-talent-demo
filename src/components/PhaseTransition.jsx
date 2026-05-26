import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * PhaseTransition — 阶段切换的"穿越"动画
 *
 * 核心隐喻：用户不是在"翻页"，而是在"穿越一层光"。
 *
 * 动画序列（总时长 ~900ms）：
 *   Phase 1 (0-50ms)  ：奶油底色从透明渐入
 *   Phase 2 (50-400ms)：中心光点以 ease-in-out 膨胀至覆盖全屏
 *   Phase 3 (350ms)   ：在光点覆盖约 80% 时触发 onMidpoint → 切换 phase
 *   Phase 4 (400-750ms)：光点从全屏收缩回零
 *   Phase 5 (750-900ms)：底色渐出，露出新阶段内容
 *
 * Props:
 *   isActive     — 是否触发过渡
 *   onMidpoint   — 在中点调用的回调（用于实际切换 phase）
 *   onComplete   — 动画完全结束后的回调
 *   direction    — 'forward' | 'backward'（预留，目前统一处理）
 */

export default function PhaseTransition({
  isActive,
  onMidpoint,
  onComplete,
  direction = 'forward',
}) {
  const [phase, setPhase] = useState('idle') // idle | expanding | contracted | fading
  const midpointFiredRef = useRef(false)

  useEffect(() => {
    if (!isActive) {
      setPhase('idle')
      midpointFiredRef.current = false
      return
    }

    // 重置状态
    midpointFiredRef.current = false

    // Phase 1 → 2: 底色渐入后开始膨胀
    const expandStart = setTimeout(() => setPhase('expanding'), 50)

    // Phase 3: 膨胀中点触发 phase 切换
    const midpoint = setTimeout(() => {
      if (!midpointFiredRef.current) {
        midpointFiredRef.current = true
        onMidpoint?.()
      }
    }, 350)

    // Phase 4: 开始收缩
    const contractStart = setTimeout(() => setPhase('contracted'), 480)

    // Phase 5: 完全结束
    const done = setTimeout(() => {
      setPhase('fading')
      setTimeout(() => {
        setPhase('idle')
        onComplete?.()
      }, 200)
    }, 800)

    return () => {
      clearTimeout(expandStart)
      clearTimeout(midpoint)
      clearTimeout(contractStart)
      clearTimeout(done)
    }
  }, [isActive, onMidpoint, onComplete])

  const isVisible = isActive && phase !== 'idle'

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{ isolation: 'isolate' }}
        >
          {/* 底色层 — 奶油色 */}
          <motion.div
            className="absolute inset-0 bg-cream"
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase === 'fading' ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
          />

          {/* 光点 — 从中心膨胀又收缩 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="rounded-full"
              style={{
                background: 'radial-gradient(circle at center, #FF8A00 0%, #FFA133 40%, #FFB873 70%, transparent 100%)',
                filter: 'blur(1px)',
              }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={
                phase === 'expanding'
                  ? {
                      width: 'max(300vw, 300vh)',
                      height: 'max(300vw, 300vh)',
                      opacity: [0, 0.95, 0.95],
                    }
                  : phase === 'contracted'
                  ? {
                      width: 0,
                      height: 0,
                      opacity: [0.95, 0.8, 0],
                    }
                  : phase === 'fading'
                  ? {
                      width: 0,
                      height: 0,
                      opacity: 0,
                    }
                  : {}
              }
              transition={
                phase === 'expanding'
                  ? { duration: 0.42, ease: [0.4, 0, 0.2, 1] }
                  : phase === 'contracted'
                  ? { duration: 0.38, ease: [0.4, 0, 1, 1] }
                  : { duration: 0.2 }
              }
            />
          </div>

          {/* 光晕柔边 — 让膨胀边缘更自然 */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase === 'expanding' || phase === 'contracted' ? 0.6 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,138,0,0.2) 0%, transparent 70%)',
                width: 'max(400vw, 400vh)',
                height: 'max(400vw, 400vh)',
                filter: 'blur(60px)',
              }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
