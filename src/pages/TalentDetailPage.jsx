import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Sparkles, Lightbulb, Route, Star, ArrowUpRight, TrendingUp } from 'lucide-react'
import { mockUser, talentDimensions } from '../data/mockUser'

function AnimatedScoreRing({ score }) {
  const [animated, setAnimated] = useState(0)
  const ref = useRef(null)
  const circumference = 276.5

  useEffect(() => {
    const timer = setTimeout(() => {
      const startTime = Date.now()
      const animTimer = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / 1400, 1)
        const eased = 1 - Math.pow(1 - progress, 4)
        setAnimated(Math.round(score * eased))
        if (progress >= 1) clearInterval(animTimer)
      }, 16)
      return () => clearInterval(animTimer)
    }, 300)
    return () => clearTimeout(timer)
  }, [score])

  const getScoreColor = (s) => {
    if (s >= 90) return '#FF8A00'
    if (s >= 80) return '#E07B00'
    if (s >= 70) return '#B35F00'
    return '#5c564c'
  }

  return (
    <div ref={ref} className="relative w-24 h-24 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#FFEEDB" strokeWidth="8" />
        <circle cx="50" cy="50" r="44" fill="none"
          stroke={getScoreColor(score)} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${(animated / 100) * circumference} ${circumference}`}
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.span
            className="text-2xl font-bold block" style={{ color: getScoreColor(score) }}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >
            {animated}
          </motion.span>
          <span className="text-[10px] text-slate-400 block -mt-0.5">分</span>
        </div>
      </div>
    </div>
  )
}

export default function TalentDetailPage({ talentKey: propKey, inSheet, onTalentSelect }) {
  const { talentKey: paramKey } = useParams()
  const navigate = useNavigate()
  const talentKey = propKey || paramKey
  const talent = talentDimensions.find(t => t.key === talentKey)
  const score = mockUser.talentScores[talentKey]

  if (!talent) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500 mb-3">未找到该天赋维度</p>
        {inSheet ? null : <Link to="/" className="text-hermes-600 font-medium">返回首页</Link>}
      </div>
    )
  }

  const sortedDimensions = Object.entries(mockUser.talentScores)
    .sort((a, b) => b[1] - a[1])
    .filter(([key]) => key !== talentKey)
    .slice(0, 3)

  const percentile = Math.min(99, Math.round((score / 100) * 98 + (talentKey.length % 3)))

  const content = (
    <div className={`${inSheet ? '' : 'min-h-screen bg-[#EDDDAF]'}`}>
      <div className={`${inSheet ? 'py-2' : 'max-w-md mx-auto px-4 py-6'} space-y-4`}>
        {/* 返回按钮 — 仅在独立页面模式显示 */}
        {!inSheet && (
          <button
            onClick={() => navigate('/', { state: { scrollTo: 'scores', highlight: talentKey } })}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 group mb-2"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            返回天赋总览
          </button>
        )}

        {/* 卡片 1：核心得分 */}
        <motion.div
          className="card-shadow bg-white rounded-3xl p-5 text-center"
          initial={inSheet ? false : { opacity: 0, y: 20 }}
          animate={inSheet ? false : { opacity: 1, y: 0 }}
        >
          <motion.span
            className="text-3xl block mb-3"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {talent.icon}
          </motion.span>
          <h2 className="text-xl font-bold text-slate-800 mb-1">{talent.key}</h2>
          <p className="text-xs text-slate-400 mb-4">{talent.category} · 天赋维度</p>

          <AnimatedScoreRing score={score} />

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-hermes-50 rounded-2xl p-2.5">
              <div className="text-base font-bold text-hermes-600">Top {percentile}%</div>
              <div className="text-[10px] text-slate-500 mt-0.5">超越同龄人</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-2.5">
              <div className="text-base font-bold text-green-600">{talent.developmentPath.length}步</div>
              <div className="text-[10px] text-slate-500 mt-0.5">成长路径明确</div>
            </div>
          </div>
        </motion.div>

        {/* 卡片 2：天赋解读 */}
        <motion.div
          className="card-shadow bg-white rounded-2xl p-4"
          initial={inSheet ? false : { opacity: 0, y: 20 }}
          animate={inSheet ? false : { opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-hermes-100 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-hermes-500" />
            </div>
            <h3 className="font-semibold text-sm text-slate-800">天赋解读</h3>
          </div>
          <p className="text-[13px] text-slate-600 leading-relaxed pl-9">{talent.description}</p>
        </motion.div>

        {/* 卡片 3：发展建议 */}
        <motion.div
          className="card-shadow bg-white rounded-2xl p-4"
          initial={inSheet ? false : { opacity: 0, y: 20 }}
          animate={inSheet ? false : { opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-gold-100 flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 text-gold-500" />
            </div>
            <h3 className="font-semibold text-sm text-slate-800">发展建议</h3>
          </div>
          <p className="text-[13px] text-slate-600 leading-relaxed pl-9">{talent.advice}</p>
        </motion.div>

        {/* 卡片 4：成长路径 */}
        <motion.div
          className="card-shadow bg-white rounded-2xl p-4"
          initial={inSheet ? false : { opacity: 0, y: 20 }}
          animate={inSheet ? false : { opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
              <Route className="w-3.5 h-3.5 text-green-500" />
            </div>
            <h3 className="font-semibold text-sm text-slate-800">成长路径</h3>
          </div>

          <div className="pl-9 space-y-0">
            {talent.developmentPath.map((step, i) => (
              <motion.div
                key={i}
                className="relative flex items-start gap-2.5"
                initial={inSheet ? false : { opacity: 0, x: -10 }}
                animate={inSheet ? false : { opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-md bg-green-50 border border-green-200 flex items-center justify-center text-xs font-bold text-green-600 shrink-0">
                    {i + 1}
                  </div>
                  {i < talent.developmentPath.length - 1 && (
                    <div className="w-0.5 h-7 bg-gradient-to-b from-green-200 to-transparent my-0.5" />
                  )}
                </div>
                <span className="text-[13px] text-slate-600 pb-3">{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 卡片 5：高光时刻 */}
        <motion.div
          className="card-shadow bg-white rounded-2xl p-4"
          initial={inSheet ? false : { opacity: 0, y: 20 }}
          animate={inSheet ? false : { opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <h3 className="font-semibold text-sm text-slate-800">高光时刻</h3>
          </div>
          <div className="pl-9 space-y-2">
            {mockUser.highMoments.map((moment, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-hermes-300 mt-0.5 shrink-0 text-xs">✦</span>
                <span className="text-[13px] text-slate-600">{moment}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 更多维度 */}
        {sortedDimensions.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 px-1">
              <TrendingUp className="w-3.5 h-3.5 text-hermes-500" />
              <h3 className="text-sm font-semibold text-slate-700">探索更多维度</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {sortedDimensions.map(([key, dimScore]) => {
                const t = talentDimensions.find(d => d.key === key)
                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (inSheet && onTalentSelect) {
                        onTalentSelect(key)
                      } else {
                        navigate(`/talent/${key}`)
                      }
                    }}
                    className="card-shadow bg-white rounded-2xl p-3 text-center hover:shadow-md transition-shadow"
                  >
                    <span className="text-xl block mb-1">{t?.icon}</span>
                    <span className="text-xs text-slate-600 font-medium block">{key}</span>
                    <span className="text-sm font-bold text-hermes-600 block mt-0.5">{dimScore}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 mx-auto mt-1" />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className={inSheet ? 'h-4' : 'h-8'} />
      </div>
    </div>
  )

  return content
}
