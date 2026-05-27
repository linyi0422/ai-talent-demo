import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import InsightOrb from './InsightOrb'

const PIPELINE = [
  { label: '分析你的高光时刻', icon: '🔍', detail: '提取关键能力特征...' },
  { label: '连接岗位能力模型', icon: '🧬', detail: '匹配企业真实招聘信号...' },
  { label: '生成求职表达桥梁', icon: '🔗', detail: '把经历转译成简历和面试语言...' },
  { label: '推荐机会连接路径', icon: '🎯', detail: '结合岗位、团队和人脉触点...' },
]

export default function AIAnalysisScreen({ highMoments, onDone }) {
  const [currentStep, setCurrentStep] = useState(-1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => setCurrentStep(0), 600)
    return () => clearTimeout(startTimer)
  }, [])

  useEffect(() => {
    if (currentStep < 0 || currentStep >= PIPELINE.length) return

    const doneTimer = setTimeout(() => {
      setCompletedSteps(prev => [...prev, currentStep])

      if (currentStep < PIPELINE.length - 1) {
        const nextTimer = setTimeout(() => setCurrentStep(currentStep + 1), 300)
        return () => clearTimeout(nextTimer)
      } else {
        const resultTimer = setTimeout(() => setShowResult(true), 500)
        const doneTimer2 = setTimeout(() => onDone(), 1800)
        return () => { clearTimeout(resultTimer); clearTimeout(doneTimer2) }
      }
    }, 1000 + Math.random() * 400)

    return () => clearTimeout(doneTimer)
  }, [currentStep, onDone])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cream to-cream-50 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-1/4 -left-20 w-60 h-60 bg-hermes-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -right-16 w-48 h-48 bg-hermes-300/15 rounded-full blur-3xl" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 sm:px-16 py-16">
        {/* AI 洞察之眼 — 激活态 */}
        <motion.div
          className="mb-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full bg-hermes-300/15 blur-2xl" />
            <InsightOrb state="active" size="lg" />
          </div>
        </motion.div>

        {/* 标题 */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-2">AI 正在连接求职机会</h2>
          <p className="text-sm text-slate-400">基于 {highMoments.length} 条高光时刻生成职业连接图</p>
        </motion.div>

        {/* 管线步骤 */}
        <div className="w-full max-w-md space-y-4">
          {PIPELINE.map((step, i) => {
            const isActive = currentStep === i
            const isDone = completedSteps.includes(i)

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${
                  isActive
                    ? 'bg-white shadow-md'
                    : isDone
                    ? 'bg-hermes-50/50'
                    : 'bg-white/40'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isDone
                    ? 'bg-green-100'
                    : isActive
                    ? 'bg-hermes-100'
                    : 'bg-slate-50'
                }`}>
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10 }}
                    >
                      <Check className="w-5 h-5 text-green-600" />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="w-5 h-5 text-hermes-500" />
                    </motion.div>
                  ) : (
                    <span className="text-base opacity-40">{step.icon}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-base font-medium transition-colors ${
                    isDone ? 'text-slate-500' : isActive ? 'text-slate-800' : 'text-slate-300'
                  }`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <motion.p
                      className="text-sm text-hermes-500 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {step.detail}
                    </motion.p>
                  )}
                </div>

                <span className={`text-xs font-mono ${
                  isDone ? 'text-green-400' : isActive ? 'text-hermes-400' : 'text-slate-200'
                }`}>
                  {isDone ? '✓' : `${i + 1}/4`}
                </span>
              </motion.div>
            )
          })}
        </div>

        {/* 完成动画 */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              className="mt-10 flex items-center gap-3 px-6 py-3 bg-green-50 rounded-full shadow-sm"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-xl"
              >
                🎉
              </motion.span>
              <span className="text-base font-medium text-green-700">分析完成！</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
