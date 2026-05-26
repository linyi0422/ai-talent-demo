import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, CheckCircle, Circle, ChevronDown, Target } from 'lucide-react'

function CompactMatchRing({ score }) {
  const [animated, setAnimated] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const startTime = Date.now()
          const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / 1200, 1)
            const eased = 1 - Math.pow(1 - progress, 4)
            setAnimated(Math.round(score * eased) / 100)
            if (progress >= 1) clearInterval(timer)
          }, 16)
          observer.disconnect()
          return () => clearInterval(timer)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [score])

  return (
    <div ref={ref} className="relative w-[56px] h-[56px]">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="none" stroke="#FFEEDB" strokeWidth="5" />
        <circle cx="32" cy="32" r="26" fill="none" stroke="url(#careerGrad)"
          strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${animated * 163.3} 163.3`} />
        <defs>
          <linearGradient id="careerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#FF8A00" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-hermes-600">{Math.round(animated * 100)}</span>
      </div>
    </div>
  )
}

function SkillItem({ name, matched, index }) {
  return (
    <motion.div
      className="flex items-center gap-1.5"
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      {matched ? (
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.06 + 0.15, type: 'spring' }}
        >
          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
        </motion.div>
      ) : (
        <Circle className="w-3.5 h-3.5 text-slate-300" strokeDasharray="2 2" />
      )}
      <span className={`text-xs ${matched ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
        {name}
      </span>
    </motion.div>
  )
}

function GrowthTimeline({ growth }) {
  const phases = [
    { key: 'shortTerm', label: '短期 (0-6月)', color: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    { key: 'midTerm', label: '中期 (6-18月)', color: 'bg-hermes-50', border: 'border-hermes-200', text: 'text-hermes-700' },
    { key: 'longTerm', label: '长期 (18月+)', color: 'bg-gold-50', border: 'border-gold-200', text: 'text-gold-500' },
  ]

  return (
    <div className="relative pl-5 mt-4">
      <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-hermes-200 rounded-full" />
      {phases.map((phase, pi) => (
        <motion.div
          key={phase.key}
          className="relative mb-3 last:mb-0"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: pi * 0.12 }}
        >
          <div className={`absolute -left-[12px] top-1 w-2.5 h-2.5 rounded-full ${phase.border} border-2 bg-white`} />
          <div className={`${phase.color} rounded-2xl p-2.5 ${phase.border} shadow-sm`}>
            <span className={`text-[11px] font-bold ${phase.text}`}>{phase.label}</span>
            <ul className="mt-1.5 space-y-1">
              {growth[phase.key].map((item, i) => (
                <li key={i} className="flex items-start gap-1 text-[11px] text-slate-600">
                  <span className="text-hermes-400 mt-0.5 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default function CareerRecommendationCard({ career }) {
  const [expanded, setExpanded] = useState(false)
  const matchedCount = career.coreSkills.filter(s => s.matched).length
  const totalCount = career.coreSkills.length

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
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-hermes-50 to-hermes-100 flex items-center justify-center shrink-0 shadow-sm">
          <Briefcase className="w-4 h-4 text-hermes-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-slate-800">{career.title}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">{career.industry}</p>
        </div>
        <CompactMatchRing score={career.matchScore} />
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
              {/* 描述 */}
              <p className="text-xs text-slate-600 leading-relaxed pt-3">{career.description}</p>

              {/* 匹配天赋 */}
              <div className="flex flex-wrap gap-1">
                {career.matchTalents.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 bg-hermes-50 text-hermes-700 rounded-full text-[10px] font-medium">
                    {t}
                  </span>
                ))}
              </div>

              {/* 核心技能 */}
              <div className="bg-slate-50 rounded-2xl p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-700">核心技能</span>
                  <span className="text-[10px] text-slate-500">
                    <span className="text-green-600 font-semibold">{matchedCount}</span>/{totalCount}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {career.coreSkills.map((skill, i) => (
                    <SkillItem key={i} name={skill.name} matched={skill.matched} index={i} />
                  ))}
                </div>
              </div>

              {/* 发展建议 */}
              <div className="pt-1">
                <div className="flex items-center gap-1.5 mb-2">
                  <Target className="w-3.5 h-3.5 text-hermes-500" />
                  <span className="text-xs font-medium text-slate-700">发展建议</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{career.advice}</p>
              </div>

              {/* 成长路径 */}
              {career.growth && <GrowthTimeline growth={career.growth} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
