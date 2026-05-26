import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Edit3, Users, Briefcase, User, RotateCcw, Share2, Bot, TrendingUp } from 'lucide-react'
import { mockUser, talentDimensions } from '../data/mockUser'
import { celebrities } from '../data/celebrities'
import { careers } from '../data/careers'
import AnimatedBackground from './AnimatedBackground'
import TalentRadarChart from './TalentRadarChart'
import TalentScoreBarList from './TalentScoreBar'
import CelebrityMatchCard from './CelebrityMatchCard'
import CareerRecommendationCard from './CareerRecommendationCard'

function AnimatedNumber({ target, duration = 1500 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const startTime = Date.now()
          const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(target * eased))
            if (progress >= 1) clearInterval(timer)
          }, 16)
          observer.disconnect()
          return () => clearInterval(timer)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count}</span>
}

function TypewriterText({ texts }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const text = texts[currentIndex]
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayed.length < text.length) {
          setDisplayed(text.slice(0, displayed.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (displayed.length > 0) {
          setDisplayed(text.slice(0, displayed.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? 30 : 60)
    return () => clearTimeout(timer)
  }, [displayed, isDeleting, currentIndex, texts])

  return (
    <span className="text-base text-slate-700">
      {displayed}
      <span className="inline-block w-0.5 h-5 bg-hermes-500 ml-0.5 animate-pulse align-middle" />
    </span>
  )
}

const TABS = [
  { key: 'overview', label: '总览', icon: TrendingUp },
  { key: 'celebrities', label: '名人', icon: Users },
  { key: 'careers', label: '职业', icon: Briefcase },
  { key: 'me', label: '我的', icon: User },
]

export default function ReportDashboard({ highMoments, onTalentSelect, onRestart, onEditMoments }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedDim, setSelectedDim] = useState(null)

  const topTalents = Object.entries(mockUser.talentScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto pb-20 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="px-6 sm:px-10 pt-5 pb-8 space-y-6 max-w-2xl mx-auto"
            >
              {/* Hero 区 */}
              <div className="text-center pt-3 pb-2">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center text-[36px] leading-none border-2 border-cream-200 shadow-md">
                    🧠
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-hermes-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm leading-none">
                    AI
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 font-serif">{mockUser.name}</h1>
                <p className="text-sm text-slate-400 tracking-wider mt-1">AI Native Product Manager</p>
                <div className="hermes-divider my-4" />
              </div>

              {/* AI 一句话总结 */}
              <div className="flex items-start gap-3 px-4 py-4 bg-hermes-50/60 rounded-2xl shadow-sm">
                <Bot className="w-5 h-5 text-hermes-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  你的天赋组合极具 AI 时代竞争力——<strong className="text-hermes-600">执行力</strong>是你的超级能力，配合<strong className="text-hermes-600">自我驱动</strong>和<strong className="text-hermes-600">产品直觉</strong>，适合在快速变化的领域做从 0 到 1 的突破。
                </p>
              </div>

              {/* 三大核心天赋 */}
              <div className="grid grid-cols-3 gap-3">
                {topTalents.map(([key, score], i) => {
                  const talent = talentDimensions.find(t => t.key === key)
                  return (
                    <motion.div
                      key={key}
                      className="glass-card rounded-3xl p-4 text-center cursor-pointer hover:shadow-md transition-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      onClick={() => onTalentSelect?.(key)}
                    >
                      <div className="text-xl mb-1">{talent?.icon}</div>
                      <div className="text-xs text-slate-500 mb-1">{key}</div>
                      <div className="text-xl font-bold text-hermes-600">
                        <AnimatedNumber target={score} duration={1500 + i * 200} />
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* 高光时刻 */}
              <div className="glass-card rounded-3xl p-5 text-center relative group transition-card">
                <p className="text-xs text-slate-400 mb-2 tracking-wider">你的高光时刻</p>
                <TypewriterText texts={highMoments} />
                <button
                  onClick={onEditMoments}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white hover:shadow-sm transition-all"
                >
                  <Edit3 className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* 天赋图谱 */}
              <div className="card-shadow bg-white rounded-3xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-hermes-500" />
                  <h2 className="font-semibold text-base text-slate-800">天赋图谱</h2>
                  <span className="ml-auto text-xs text-hermes-500 bg-hermes-50 px-2 py-0.5 rounded-full font-medium">AI 分析</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">点击节点查看详情</p>
                <TalentRadarChart
                  onDimensionClick={(dim) => onTalentSelect?.(dim)}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'celebrities' && (
            <motion.div
              key="celebrities"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="px-6 sm:px-10 pt-5 pb-8 space-y-4 max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-hermes-500" />
                <h2 className="font-semibold text-base text-slate-800">名人发展建议</h2>
                <span className="ml-auto text-xs text-hermes-500 bg-hermes-50 px-2 py-0.5 rounded-full font-medium">AI 匹配</span>
              </div>
              <p className="text-sm text-slate-400 mb-2">基于你的天赋画像，AI 筛选出最匹配的名人发展路径</p>
              {celebrities.map((celebrity) => (
                <CelebrityMatchCard key={celebrity.id} celebrity={celebrity} />
              ))}
            </motion.div>
          )}

          {activeTab === 'careers' && (
            <motion.div
              key="careers"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="px-6 sm:px-10 pt-5 pb-8 space-y-4 max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-hermes-500" />
                <h2 className="font-semibold text-base text-slate-800">职业推荐</h2>
                <span className="ml-auto text-xs text-hermes-500 bg-hermes-50 px-2 py-0.5 rounded-full font-medium">AI 推荐</span>
              </div>
              <p className="text-sm text-slate-400 mb-2">天赋 + 市场趋势，AI 为你生成最适合的职业方向</p>
              {careers.map((career) => (
                <CareerRecommendationCard key={career.id} career={career} />
              ))}
            </motion.div>
          )}

          {activeTab === 'me' && (
            <motion.div
              key="me"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="px-6 sm:px-10 pt-5 pb-8 space-y-6 max-w-2xl mx-auto"
            >
              <div className="card-shadow bg-white rounded-3xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-hermes-500" />
                  <h2 className="font-semibold text-base text-slate-800">我的高光时刻</h2>
                  <button
                    onClick={onEditMoments}
                    className="ml-auto text-sm text-hermes-500 hover:text-hermes-600 font-medium flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />编辑
                  </button>
                </div>
                <div className="space-y-3">
                  {highMoments.map((moment, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-cream-50 rounded-2xl shadow-sm">
                      <span className="text-base">✨</span>
                      <p className="text-sm text-slate-600 leading-relaxed">{moment}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-shadow bg-white rounded-3xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-hermes-500" />
                  <h2 className="font-semibold text-base text-slate-800">天赋得分详情</h2>
                  <span className="ml-auto text-xs text-hermes-500 bg-hermes-50 px-2 py-0.5 rounded-full font-medium">AI 评估</span>
                </div>
                <TalentScoreBarList
                  selectedDim={selectedDim}
                  onSelectDim={(dim) => setSelectedDim(dim)}
                  onTalentSelect={onTalentSelect}
                />
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={onEditMoments}
                  className="w-full py-4 rounded-2xl bg-hermes-50 text-hermes-600 text-base font-medium flex items-center justify-center gap-2 hover:bg-hermes-100 hover:-translate-y-0.5 transition-btn"
                >
                  <Bot className="w-5 h-5" />
                  更新高光时刻，获得更精准的 AI 分析
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={onRestart}
                    className="flex-1 py-3 rounded-2xl bg-white text-slate-500 text-sm font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-btn"
                  >
                    <RotateCcw className="w-4 h-4" />
                    重新测评
                  </button>
                  <button
                    className="flex-1 py-3 rounded-2xl bg-hermes-500 text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm hover:bg-hermes-600 hover:shadow-md hover:-translate-y-0.5 transition-btn"
                  >
                    <Share2 className="w-4 h-4" />
                    分享报告
                  </button>
                </div>

                <p className="text-xs text-slate-300 text-center pt-2">
                  AI 持续学习中 · 智联招聘 · 智聘未来
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部 Tab 栏 */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-md" style={{ borderTop: '1px solid rgba(195, 191, 176, 0.2)' }}>
        <div className="flex items-center justify-around py-2 max-w-2xl mx-auto">
          {TABS.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-btn ${
                  isActive ? 'text-hermes-600' : 'text-slate-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-hermes-500' : ''}`} />
                <span className="text-xs font-medium">{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="w-5 h-0.5 bg-hermes-500 rounded-full"
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
