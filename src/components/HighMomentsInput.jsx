import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles, Check, Edit3, X } from 'lucide-react'

const STEPS = [
  {
    key: 'moment1',
    label: '1 / 3',
    title: '你最骄傲的一件事？',
    hint: '比如：拿过什么奖、做成过什么项目、突破过什么难关...',
    placeholder: '大学期间带队拿下全国创新创业大赛金奖...',
    maxLength: 60,
  },
  {
    key: 'moment2',
    label: '2 / 3',
    title: '有什么经历让你觉得「这就是我」？',
    hint: '那个让你确认自己方向、发现自己天赋的时刻',
    placeholder: '独立完成AI产品从0到1，拿到2000+用户...',
    maxLength: 60,
  },
  {
    key: 'moment3',
    label: '3 / 3',
    title: '还有什么时刻让你闪闪发光？',
    hint: '可以是任何领域——学习、创作、社交、运动...',
    placeholder: '公众号单篇阅读量突破30万...',
    maxLength: 60,
  },
]

function StepDot({ active, done }) {
  return (
    <div
      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
        active
          ? 'bg-hermes-500 scale-125 shadow-sm shadow-hermes-300'
          : done
          ? 'bg-hermes-300'
          : 'bg-slate-200'
      }`}
    />
  )
}

export default function HighMomentsInput({ isOpen, onClose, onSave, initialMoments = [] }) {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState(['', '', ''])
  const [hasInteracted, setHasInteracted] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setStep(0)
      setValues(initialMoments.length >= 3 ? initialMoments : ['', '', ''])
      setHasInteracted(false)
    }
  }, [isOpen, initialMoments])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [step])

  const current = STEPS[step]
  const currentValue = values[step]
  const isLastStep = step === STEPS.length - 1
  const isReviewStep = step === STEPS.length
  const allFilled = values.every(v => v.trim().length > 0)

  const updateValue = (val) => {
    if (!hasInteracted) setHasInteracted(true)
    const next = [...values]
    next[step] = val.slice(0, current.maxLength)
    setValues(next)
  }

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
      setHasInteracted(false)
    } else {
      setStep(STEPS.length) // go to review
    }
  }

  const goBack = () => {
    if (step > 0) {
      setStep(step - 1)
      setHasInteracted(true)
    }
  }

  const handleSave = () => {
    onSave(values.filter(v => v.trim()))
    onClose()
  }

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 80 : -80, opacity: 0 }),
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col bg-cream"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* 顶部导航 */}
          <div className="flex items-center justify-between px-5 pt-3 pb-3">
            <button
              onClick={step === 0 ? onClose : goBack}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            >
              {step === 0 ? (
                <X className="w-5 h-5 text-slate-500" />
              ) : (
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              )}
            </button>

            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <StepDot key={s.key} active={i === step} done={values[i]?.trim().length > 0} />
              ))}
            </div>

            <div className="w-9" />
          </div>

          {/* 内容区 */}
          <div className="flex-1 flex flex-col justify-center px-6 pb-6 overflow-hidden">
            <AnimatePresence mode="wait" custom={step}>
              {!isReviewStep ? (
                <motion.div
                  key={`step-${step}`}
                  custom={step}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex flex-col gap-6"
                >
                  {/* 气泡提示 */}
                  <div className="relative">
                    <div className="bg-white rounded-2xl rounded-bl-md p-5 shadow-sm border border-slate-100">
                      <p className="text-xs font-medium text-hermes-500 mb-1 tracking-wide">
                        {current.label}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-800 mb-1.5">{current.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{current.hint}</p>
                    </div>
                    {/* 气泡尾巴 */}
                    <div className="absolute -bottom-2 left-5 w-4 h-4 bg-white border-b border-r border-slate-100 rotate-45" />
                  </div>

                  {/* 输入区 */}
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={currentValue}
                      onChange={(e) => updateValue(e.target.value)}
                      placeholder={current.placeholder}
                      rows={3}
                      className="w-full px-4 py-3.5 bg-white rounded-2xl border border-slate-200 text-slate-700 text-sm placeholder-slate-300 resize-none focus:outline-none focus:border-hermes-400 focus:ring-2 focus:ring-hermes-100 transition-all"
                    />
                    <div className="flex items-center justify-between mt-2">
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

                  {/* 下一步按钮 */}
                  <motion.button
                    onClick={goNext}
                    disabled={!currentValue.trim()}
                    className={`w-full py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                      currentValue.trim()
                        ? 'bg-hermes-500 text-white shadow-md shadow-hermes-200 hover:bg-hermes-600 active:scale-[0.98]'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                    whileTap={currentValue.trim() ? { scale: 0.98 } : {}}
                  >
                    {isLastStep ? '看看你的高光时刻' : '下一题'}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  {/* 跳过按钮 */}
                  {!isLastStep && currentValue.trim() && (
                    <button
                      onClick={goNext}
                      className="text-xs text-slate-400 hover:text-slate-500 transition-colors text-center"
                    >
                      写好了，继续 →
                    </button>
                  )}
                </motion.div>
              ) : (
                /* ====== 回顾确认页 ====== */
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col gap-5"
                >
                  <div className="text-center">
                    <motion.div
                      className="inline-flex items-center gap-2 px-4 py-1.5 bg-hermes-50 rounded-full mb-3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring' }}
                    >
                      <Sparkles className="w-4 h-4 text-hermes-500" />
                      <span className="text-sm font-medium text-hermes-600">回顾确认</span>
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-800">这就是你的高光时刻</h3>
                    <p className="text-sm text-slate-400 mt-1">点击任意一条可以修改</p>
                  </div>

                  {/* 三条高光 */}
                  <div className="space-y-3">
                    {STEPS.map((s, i) => (
                      <motion.div
                        key={s.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        onClick={() => {
                          setStep(i)
                          setHasInteracted(true)
                        }}
                        className="relative group"
                      >
                        <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-hermes-200 hover:shadow-sm transition-all cursor-pointer">
                          <div className="w-7 h-7 rounded-full bg-hermes-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-hermes-500">{i + 1}</span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed flex-1">
                            {values[i] || <span className="text-slate-300 italic">未填写</span>}
                          </p>
                          <Edit3 className="w-3.5 h-3.5 text-slate-300 group-hover:text-hermes-400 transition-colors flex-shrink-0 mt-1" />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* 确认按钮 */}
                  <motion.button
                    onClick={handleSave}
                    disabled={!allFilled}
                    className={`w-full py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                      allFilled
                        ? 'bg-hermes-500 text-white shadow-lg shadow-hermes-200 hover:bg-hermes-600 active:scale-[0.98]'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                    whileTap={allFilled ? { scale: 0.98 } : {}}
                  >
                    <Sparkles className="w-4 h-4" />
                    确认，生成我的天赋报告
                  </motion.button>

                  {!allFilled && (
                    <p className="text-xs text-slate-400 text-center">请填写所有高光时刻后确认</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
