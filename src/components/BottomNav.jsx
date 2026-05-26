import { motion } from 'framer-motion'
import { Radar, BarChart3, Crown, Briefcase } from 'lucide-react'

const navItems = [
  { key: 'radar', label: '天赋图谱', icon: Radar },
  { key: 'scores', label: '得分详情', icon: BarChart3 },
  { key: 'celebrities', label: '名人匹配', icon: Crown },
  { key: 'careers', label: '职业推荐', icon: Briefcase },
]

export default function BottomNav({ activeSection, onNavClick }) {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom,0px)]"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="glass-card mx-auto max-w-md rounded-t-2xl border-b-0" style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 138, 0, 0.1)',
        borderBottom: 'none',
      }}>
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.key
            return (
              <button
                key={item.key}
                onClick={() => onNavClick(item.key)}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all"
              >
                {isActive && (
                  <motion.div
                    layoutId="navBg"
                    className="absolute inset-1 bg-hermes-100 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`w-5 h-5 relative z-10 transition-colors ${
                    isActive ? 'text-hermes-600' : 'text-slate-400'
                  }`}
                />
                <span
                  className={`text-[10px] relative z-10 font-medium transition-colors ${
                    isActive ? 'text-hermes-700' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navDot"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-hermes-500"
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
