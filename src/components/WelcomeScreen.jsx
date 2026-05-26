import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import AnimatedBackground from './AnimatedBackground'
import InsightOrb from './InsightOrb'

export default function WelcomeScreen({ onStart }) {
  const [titleVisible, setTitleVisible] = useState(false)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [btnVisible, setBtnVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setTitleVisible(true), 300)
    const t2 = setTimeout(() => setSubtitleVisible(true), 800)
    const t3 = setTimeout(() => setBtnVisible(true), 1300)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div className="min-h-full relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-full flex flex-col items-center justify-between px-8 text-center py-10">
        {/* 顶部占位 */}
        <div className="h-4" />

        {/* AI 洞察之眼 */}
        <motion.div
          className="mb-4"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
        >
          <div className="relative flex items-center justify-center">
            {/* 外发光基座 */}
            <div className="absolute w-28 h-28 rounded-full bg-hermes-200/15 blur-xl" />
            <InsightOrb state="dormant" size="lg" />
          </div>
        </motion.div>

        {/* 品牌标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-slate-800 font-serif tracking-wide mb-1">
            AI 天赋测评
          </h1>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-hermes-500" />
            <span className="text-xs font-medium text-hermes-500 tracking-widest">
              AI-POWERED TALENT INSIGHT
            </span>
            <Sparkles className="w-3.5 h-3.5 text-hermes-500" />
          </div>
        </motion.div>

        {/* 描述 */}
        <motion.p
          className="text-sm text-slate-500 leading-relaxed max-w-[260px]"
          initial={{ opacity: 0, y: 15 }}
          animate={subtitleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          回答 3 个问题，AI 将为你生成专属天赋图谱、名人匹配与职业推荐
        </motion.p>

        {/* CTA 按钮 */}
        <motion.button
          onClick={onStart}
          className="px-8 py-3.5 bg-gradient-to-r from-hermes-500 to-hermes-600 text-white rounded-3xl font-semibold text-sm shadow-lg shadow-hermes-300/30 hover:shadow-xl hover:shadow-hermes-300/40 hover:-translate-y-0.5 active:scale-[0.98] transition-btn flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={btnVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, type: 'spring' }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="w-4 h-4" />
          开始 AI 测评
        </motion.button>

        {/* 底部品牌 */}
        <motion.p
          className="text-[10px] text-slate-300 tracking-wider pb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          智联招聘 · 智聘未来 AI 创新大赛
        </motion.p>
      </div>
    </div>
  )
}
