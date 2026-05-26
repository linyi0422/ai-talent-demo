import { motion } from 'framer-motion'
import { Sparkles, ChevronDown, ChevronUp, Lightbulb, Target, Route } from 'lucide-react'
import { useState } from 'react'

export default function TalentInterpretationCard({ talent, score }) {
  const [expanded, setExpanded] = useState(false)

  const getScoreColor = (s) => {
    if (s >= 90) return 'bg-green-500'
    if (s >= 80) return 'bg-warm-500'
    if (s >= 70) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const getScoreLabel = (s) => {
    if (s >= 95) return '卓越'
    if (s >= 88) return '优秀'
    if (s >= 80) return '良好'
    if (s >= 70) return '发展中'
    return '待提升'
  }

  return (
    <motion.div
      layout
      className="card-shadow bg-white rounded-2xl p-5 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{talent.icon}</span>
          <div>
            <h3 className="font-semibold text-base text-warm-900">{talent.key}</h3>
            <span className="text-xs text-warm-500">{talent.category}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </span>
          </div>
          <span className="text-2xl font-bold text-warm-600">{score}</span>
          {expanded ? <ChevronUp className="w-5 h-5 text-warm-400" /> : <ChevronDown className="w-5 h-5 text-warm-400" />}
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pt-4 space-y-4">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-warm-500 mt-0.5 shrink-0" />
            <p className="text-sm text-warm-800 leading-relaxed">{talent.description}</p>
          </div>

          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-warm-500 mt-0.5 shrink-0" />
            <p className="text-sm text-warm-700 leading-relaxed">{talent.advice}</p>
          </div>

          <div className="bg-warm-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Route className="w-4 h-4 text-warm-600" />
              <span className="text-sm font-medium text-warm-800">发展路径</span>
            </div>
            <div className="space-y-2">
              {talent.developmentPath.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-warm-200 flex items-center justify-center text-xs font-bold text-warm-700 shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm text-warm-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {score >= 90 && (
        <div className="mt-3 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-green-500" />
          <span className="text-xs text-green-600 font-medium">核心优势维度</span>
        </div>
      )}
    </motion.div>
  )
}
