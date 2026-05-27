import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Edit3 } from 'lucide-react'
import { mockUser, talentDimensions } from '../data/mockUser'
import { celebrities } from '../data/celebrities'
import { careers } from '../data/careers'
import AnimatedBackground from '../components/AnimatedBackground'
import TalentRadarChart from '../components/TalentRadarChart'
import TalentScoreBarList from '../components/TalentScoreBar'
import CelebrityMatchCard from '../components/CelebrityMatchCard'
import CareerRecommendationCard from '../components/CareerRecommendationCard'
import BottomNav from '../components/BottomNav'

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
    <span className="text-sm text-slate-700">
      {displayed}
      <span className="inline-block w-0.5 h-4 bg-hermes-500 ml-0.5 animate-pulse align-middle" />
    </span>
  )
}

export default function HomePage({ onTalentSelect, highMoments, onEditHighMoments }) {
  const [selectedDim, setSelectedDim] = useState(null)
  const [activeSection, setActiveSection] = useState('radar')

  const radarRef = useRef(null)
  const scoresRef = useRef(null)
  const celebritiesRef = useRef(null)
  const careersRef = useRef(null)

  const sectionRefs = useMemo(() => ({
    radar: radarRef,
    scores: scoresRef,
    celebrities: celebritiesRef,
    careers: careersRef,
  }), [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target.getAttribute('data-section')
            if (section) setActiveSection(section)
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    )

    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => observer.disconnect()
  }, [sectionRefs])

  const scrollToSection = useCallback((key) => {
    sectionRefs[key]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [sectionRefs])

  const topTalents = Object.entries(mockUser.talentScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <div className="max-w-md mx-auto px-5 pt-3 pb-24 space-y-7 relative z-10">
        {/* ===== 英雄区域 ===== */}
        <motion.div
          className="text-center pt-2 pb-1"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 头像 emoji */}
          <div className="relative inline-block mb-3">
            <div className="relative animate-pulse-ring">
              <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center text-[36px] leading-none border-2 border-cream-200 relative z-10 shadow-md">
                🧠
              </div>
            </div>
            <motion.div
              className="absolute -bottom-1 -right-1 bg-gradient-to-r from-hermes-500 to-hermes-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold z-20 shadow-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              AI PM
            </motion.div>
          </div>

          <motion.h1
            className="text-xl font-bold text-slate-800 mb-0.5 font-serif tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {mockUser.name}
          </motion.h1>
          <motion.p
            className="text-xs text-slate-500 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            AI Native Product Manager
          </motion.p>
          <div className="hermes-divider my-3" />
        </motion.div>

        {/* 三大核心天赋卡片 */}
        <div className="grid grid-cols-3 gap-2.5">
          {topTalents.map(([key, score], i) => {
            const talent = talentDimensions.find(t => t.key === key)
            return (
              <motion.div
                key={key}
                className="glass-card rounded-2xl p-2.5 text-center cursor-pointer hover:shadow-md transition-shadow border border-hermes-100/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                onClick={() => onTalentSelect?.(key)}
              >
                <div className="text-lg mb-0.5">{talent?.icon}</div>
                <div className="text-[11px] text-slate-500 mb-0.5">{key}</div>
                <div className="text-lg font-bold text-hermes-600">
                  <AnimatedNumber target={score} duration={1500 + i * 200} />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* 高光时刻 */}
        <motion.div
          className="glass-card rounded-2xl p-3.5 text-center border border-hermes-100/30 relative group"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-[11px] text-slate-400 mb-1.5 tracking-wider">高光时刻</p>
          <TypewriterText texts={highMoments} />
          {/* 编辑按钮 */}
          <button
            onClick={onEditHighMoments}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/60 hover:bg-white hover:shadow-sm opacity-0 group-hover:opacity-100 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </motion.div>

        {/* ===== 天赋图谱 ===== */}
        <section ref={radarRef} data-section="radar" className="scroll-mt-4">
          <motion.div
            className="card-shadow bg-white rounded-3xl p-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-hermes-500" />
              <h2 className="font-semibold text-sm text-slate-800">天赋图谱</h2>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">点击节点探索你的天赋分布</p>
            <TalentRadarChart
              onDimensionClick={(dim) => onTalentSelect?.(dim)}
            />
          </motion.div>
        </section>

        {/* ===== 得分详情 ===== */}
        <section ref={scoresRef} data-section="scores" className="scroll-mt-4">
          <motion.div
            className="card-shadow bg-white rounded-3xl p-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-hermes-500" />
              <h2 className="font-semibold text-sm text-slate-800">天赋得分详情</h2>
            </div>
            <TalentScoreBarList
              selectedDim={selectedDim}
              onSelectDim={(dim) => setSelectedDim(dim)}
              onTalentSelect={onTalentSelect}
            />
          </motion.div>
        </section>

        {/* ===== 名人匹配 ===== */}
        <section ref={celebritiesRef} data-section="celebrities" className="scroll-mt-4 space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-hermes-500" />
            <h2 className="font-semibold text-sm text-slate-800">名人发展建议</h2>
            <span className="text-[11px] text-slate-400 ml-auto">基于天赋匹配</span>
          </div>
          {celebrities.map((celebrity) => (
            <CelebrityMatchCard key={celebrity.id} celebrity={celebrity} />
          ))}
        </section>

        {/* ===== 职业推荐 ===== */}
        <section ref={careersRef} data-section="careers" className="scroll-mt-4 space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-hermes-500" />
            <h2 className="font-semibold text-sm text-slate-800">职业推荐</h2>
            <span className="text-[11px] text-slate-400 ml-auto">天赋 + 市场匹配</span>
          </div>
          {careers.map((career) => (
            <CareerRecommendationCard key={career.id} career={career} />
          ))}
        </section>

        <div className="h-4" />
      </div>

      <BottomNav activeSection={activeSection} onNavClick={scrollToSection} />
    </div>
  )
}
