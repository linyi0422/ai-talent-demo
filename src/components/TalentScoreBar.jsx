import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Lightbulb, Route, Sparkles, ArrowUpRight } from 'lucide-react'
import { mockUser, talentDimensions } from '../data/mockUser'

function useCountUp(target, duration = 1200, startCounting = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!startCounting) { setCount(0); return }
    const startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(target * eased))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, startCounting])
  return count
}

function ScoreBar({ talent, score, isExpanded, onToggle, isVisible, onViewDetail }) {
  const displayedScore = useCountUp(score, 1400, isVisible)

  const getScoreColor = (s) => {
    if (s >= 90) return { bar: 'from-hermes-500 to-hermes-600', text: 'text-hermes-700', bg: 'bg-hermes-50' }
    if (s >= 80) return { bar: 'from-hermes-400 to-hermes-500', text: 'text-hermes-600', bg: 'bg-hermes-50/50' }
    return { bar: 'from-hermes-300 to-hermes-400', text: 'text-hermes-500', bg: 'bg-hermes-50/30' }
  }

  const colors = getScoreColor(score)

  return (
    <div className="group">
      <motion.button
        onClick={onToggle}
        className="w-full text-left"
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2.5 mb-1">
          <span className="text-base w-6 text-center">{talent.icon}</span>
          <span className="text-xs font-medium text-slate-700 flex-1">{talent.key}</span>
          <span className={`text-xs font-bold ${colors.text} tabular-nums w-7 text-right`}>
            {displayedScore}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>

        <div className="h-2 bg-hermes-50 rounded-full overflow-hidden ml-8">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${colors.bar}`}
            initial={{ width: 0 }}
            animate={{ width: isVisible ? `${score}%` : '0%' }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          />
        </div>

        <div className="ml-8 mt-0.5">
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
            {talent.category}
          </span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-8 mt-2 space-y-2 pb-1">
              <div className="flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-hermes-500 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-600 leading-relaxed">{talent.description}</p>
              </div>
              <div className="flex items-start gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-gold-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-600 leading-relaxed">{talent.advice}</p>
              </div>
              <div className="flex items-start gap-1.5">
                <Route className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                <div className="flex-1 space-y-1">
                  {talent.developmentPath.map((step, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center text-[10px] font-bold text-green-600 shrink-0 border border-green-200">
                        {i + 1}
                      </div>
                      <span className="text-xs text-slate-600">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetail?.()
                }}
                className="flex items-center gap-1 mt-1 px-2.5 py-1 bg-hermes-50 text-hermes-700 rounded-xl text-[11px] font-medium hover:bg-hermes-100 hover:-translate-y-0.5 transition-btn shadow-sm"
              >
                查看完整报告
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function TalentScoreBarList({ selectedDim, onSelectDim, onTalentSelect }) {
  const [expandedKey, setExpandedKey] = useState(selectedDim || null)
  const [visible, setVisible] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (selectedDim) {
      setExpandedKey(selectedDim)
      setTimeout(() => {
        document.getElementById(`talent-bar-${selectedDim}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 100)
    }
  }, [selectedDim])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const sortedTalents = Object.entries(mockUser.talentScores)
    .sort((a, b) => b[1] - a[1])
    .map(([key, score]) => {
      const talent = talentDimensions.find(t => t.key === key)
      return { key, score, talent }
    })

  return (
    <div ref={containerRef} className="space-y-2">
      {sortedTalents.map(({ key, score, talent }) => (
        <div key={key} id={`talent-bar-${key}`}>
          <ScoreBar
            talent={talent}
            score={score}
            isExpanded={expandedKey === key}
            isVisible={visible}
            onViewDetail={() => onTalentSelect?.(key)}
            onToggle={() => {
              const newKey = expandedKey === key ? null : key
              setExpandedKey(newKey)
              onSelectDim?.(newKey)
            }}
          />
        </div>
      ))}
    </div>
  )
}
