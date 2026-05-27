import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles, Check, Edit3, X, Bot, Zap } from 'lucide-react'
import InsightOrb from './InsightOrb'
import { demoHighMoments } from '../data/demoValues'

const STEPS = [
  {
    key: 'moment1',
    aiGreeting: '你好！我是你的 AI 天赋分析师 🧠',
    aiMessage: '在开始分析之前，我想先了解你。告诉我——你最骄傲的一件事是什么？',
    aiHint: '比如拿过什么奖、做成过什么项目、突破过什么难关...',
    placeholder: '大学期间带队拿下全国创新创业大赛金奖...',
    demo: '带队拿下全国创新创业大赛金奖，从0到1打造AI产品',
    aiConfirm: '很棒的经历！这种成就感往往暗示着你的核心天赋 ✨',
    maxLength: 60,
  },
  {
    key: 'moment2',
    aiMessage: '很有意思！那有没有一个时刻，让你觉得「这就是我」？',
    aiHint: '那个让你确认自己方向、发现自己天赋的时刻',
    placeholder: '独立完成AI产品从0到1，拿到2000+用户...',
    demo: '独立完成AI产品0到1，获2000+用户和500+付费',
    aiConfirm: '这正是自我驱动的体现！AI 已经在捕捉你的天赋信号了 📡',
    maxLength: 60,
  },
  {
    key: 'moment3',
    aiMessage: '最后一个问题——还有什么时刻让你闪闪发光？',
    aiHint: '可以是任何领域——学习、创作、社交、运动...',
    placeholder: '公众号单篇阅读量突破30万...',
    demo: '公众号单篇阅读30万+，IMA知识库1万+条提示词',
    aiConfirm: '太好了！我已收集到足够的信息，准备为你生成天赋报告 🚀',
    maxLength: 60,
  },
]

export default function AIChatOnboarding({ onSave, onBack, initialMoments = [] }) {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState(initialMoments.length >= 3 ? [...initialMoments] : ['', '', ''])
  const [showConfirm, setShowConfirm] = useState(false)
  const textareaRef = useRef(null)
  const chatEndRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [step])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [step, showConfirm])

  const current = STEPS[step]
  const currentValue = values[step]
  const isLastStep = step === STEPS.length - 1
  const isReviewStep = step === STEPS.length
  const allFilled = values.every(v => v.trim().length > 0)

  const updateValue = (val) => {
    const next = [...values]
    next[step] = val.slice(0, current.maxLength)
    setValues(next)
    setShowConfirm(false)
  }

  const goNext = () => {
    setShowConfirm(true)
    setTimeout(() => {
      if (step < STEPS.length - 1) {
        setStep(step + 1)
        setShowConfirm(false)
      } else {
        setStep(STEPS.length)
      }
    }, 1200)
  }

  const goBack = () => {
    if (step > 0) {
      setStep(step - 1)
      setShowConfirm(false)
    }
  }

  const handleSave = () => {
    onSave(values.filter(v => v.trim()))
  }

  const handleDemoFill = () => {
    setValues([...demoHighMoments])
    setStep(STEPS.length)
    setShowConfirm(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between px-6 sm:px-10 pt-4 pb-3 shrink-0">
        <button
          onClick={step === 0 ? onBack : goBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors"
        >
          {step === 0 ? (
            <X className="w-5 h-5 text-slate-500" />
          ) : (
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-hermes-500" />
          <span className="text-sm font-medium text-hermes-600">AI 天赋分析师</span>
        </div>

        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === step ? 'bg-hermes-500 scale-125' : i < step ? 'bg-hermes-300' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 对话区域 */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-4 space-y-5">
        {!isReviewStep ? (
          <>
            {step === 0 && (
              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="shrink-0">
                  <InsightOrb state="focused" size="sm" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-[85%]">
                  <p className="text-base text-slate-700">{current.aiGreeting}</p>
                </div>
              </motion.div>
            )}

            <motion.div
              className="flex items-start gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-9 h-9 rounded-full bg-hermes-50 flex items-center justify-center shrink-0 border border-hermes-100">
                <span className="text-base">🧠</span>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-[85%]">
                <p className="text-base text-slate-700 leading-relaxed">{current.aiMessage}</p>
                <p className="text-sm text-slate-400 mt-2">{current.aiHint}</p>
              </div>
            </motion.div>

            {currentValue.trim() && (
              <motion.div
                className="flex items-start gap-3 justify-end"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="bg-hermes-500 text-white rounded-2xl rounded-tr-sm p-4 shadow-sm max-w-[80%]">
                  <p className="text-base leading-relaxed">{currentValue}</p>
                </div>
              </motion.div>
            )}

            {showConfirm && (
              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="shrink-0">
                  <InsightOrb state="focused" size="sm" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-[85%]">
                  <p className="text-base text-slate-700">{current.aiConfirm}</p>
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-hermes-50 flex items-center justify-center shrink-0 border border-hermes-100">
                <span className="text-base">🧠</span>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-[85%]">
                <p className="text-base text-slate-700 leading-relaxed">
                  我已完整了解你的高光时刻，点击任意一条可以修改：
                </p>
              </div>
            </div>

            <div className="space-y-3 ml-12">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  onClick={() => { setStep(i); setShowConfirm(false) }}
                  className="group cursor-pointer"
                >
                  <div className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md hover:border-hermes-200 transition-card">
                    <div className="w-6 h-6 rounded-full bg-hermes-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-hermes-500">{i + 1}</span>
                    </div>
                    <p className="text-base text-slate-700 leading-relaxed flex-1">
                      {values[i] || <span className="text-slate-300 italic">未填写</span>}
                    </p>
                    <Edit3 className="w-4 h-4 text-slate-300 group-hover:text-hermes-400 transition-colors flex-shrink-0 mt-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 底部输入区 */}
      <div className="shrink-0 px-6 sm:px-10 pb-6 pt-3 bg-cream/80 backdrop-blur-sm" style={{ borderTop: '1px solid rgba(212, 200, 160, 0.35)' }}>
        {!isReviewStep ? (
          <>
            {values.every(v => !v.trim()) && (
              <motion.button
                onClick={handleDemoFill}
                className="w-full mb-3 py-3 rounded-2xl bg-hermes-50 text-hermes-600 text-sm font-medium flex items-center justify-center gap-2 border border-hermes-100 hover:bg-hermes-100 hover:border-hermes-200 hover:-translate-y-0.5 transition-btn active:scale-[0.98]"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="w-4 h-4" />
                一键填入并预览
              </motion.button>
            )}

            <div className="relative">
              <textarea
                ref={textareaRef}
                value={currentValue}
                onChange={(e) => updateValue(e.target.value)}
                placeholder={current.placeholder}
                rows={3}
                className="w-full px-5 py-4 bg-white rounded-2xl text-base text-slate-700 placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-hermes-100 shadow-sm focus:shadow-md transition-input"
              />
              <div className="flex items-center justify-between mt-2 px-2">
                <span className="text-xs text-slate-400">
                  {currentValue.length}/{current.maxLength}
                </span>
                {currentValue.trim().length > 0 && (
                  <span className="text-xs text-hermes-500 flex items-center gap-1">
                    <Check className="w-3 h-3" />已输入
                  </span>
                )}
              </div>
            </div>

            <motion.button
              onClick={goNext}
              disabled={!currentValue.trim() || showConfirm}
              className={`w-full mt-3 py-4 rounded-2xl font-medium text-base flex items-center justify-center gap-2 transition-btn ${
                currentValue.trim() && !showConfirm
                  ? 'bg-hermes-500 text-white shadow-md shadow-hermes-200 hover:bg-hermes-600 hover:-translate-y-0.5 active:scale-[0.98]'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              whileTap={currentValue.trim() ? { scale: 0.98 } : {}}
            >
              {showConfirm ? 'AI 分析中...' : (isLastStep ? '生成天赋报告' : '下一步')}
              {!showConfirm && <ArrowRight className="w-5 h-5" />}
            </motion.button>
          </>
        ) : (
          <motion.button
            onClick={handleSave}
            disabled={!allFilled}
            className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-btn ${
              allFilled
                ? 'bg-hermes-500 text-white shadow-lg shadow-hermes-200 hover:bg-hermes-600 hover:-translate-y-0.5 active:scale-[0.98]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            whileTap={allFilled ? { scale: 0.98 } : {}}
          >
            <Sparkles className="w-5 h-5" />
            确认，开始 AI 分析
          </motion.button>
        )}
      </div>
    </div>
  )
}
