import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Quote, ChevronDown } from 'lucide-react'

export default function CelebrityMatchCard({ celebrity }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      className="card-shadow bg-white rounded-3xl overflow-hidden transition-card hover:shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* ===== 摘要行 ===== */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-full bg-cream-100 flex items-center justify-center text-2xl leading-none border-2 border-cream-200">
            {celebrity.emoji || '👤'}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-hermes-500 text-white text-[9px] px-1 py-0.5 rounded-full font-bold shadow-sm leading-none">
            {celebrity.matchScore}%
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-slate-800">{celebrity.name}</h3>
            <span className="inline-flex items-center px-1.5 py-0.5 bg-hermes-50 text-hermes-600 rounded-full text-[10px] font-medium shadow-sm">
              {celebrity.matchTalent}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">{celebrity.role}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* ===== 展开详情 ===== */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-slate-50">
              {/* 成就 */}
              <div className="flex flex-wrap gap-1.5 pt-3">
                {celebrity.achievements.map((ach, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold-50 text-slate-600 rounded-xl text-[11px] shadow-sm">
                    <Award className="w-3 h-3 text-gold-400" /> {ach}
                  </span>
                ))}
              </div>

              {/* 分析 + 建议 */}
              <div className="space-y-2">
                <p className="text-xs text-slate-600 leading-relaxed">{celebrity.problemAnalysis}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{celebrity.advice}</p>
              </div>

              {/* 名言 */}
              <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
                <Quote className="w-3 h-3 text-hermes-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-500 italic leading-relaxed">{celebrity.quote}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
