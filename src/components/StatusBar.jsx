import { useState, useEffect } from 'react'

export default function StatusBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }))
    }
    update()
    const timer = setInterval(update, 10000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute top-0 left-0 right-0 h-11 flex items-center justify-between px-6 z-30 text-slate-700">
      {/* 左：时间 */}
      <span className="text-xs font-semibold w-14">{time}</span>

      {/* 中：留空（灵动岛区域） */}
      <div className="flex-1" />

      {/* 右：信号 + 电池 */}
      <div className="flex items-center gap-1.5">
        {/* 信号条 */}
        <svg width="16" height="12" viewBox="0 0 16 12" className="fill-slate-700">
          <rect x="0" y="8" width="3" height="4" rx="0.5" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
          <rect x="9" y="2" width="3" height="10" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
        </svg>
        {/* 电池 */}
        <svg width="24" height="12" viewBox="0 0 24 12" className="stroke-slate-700 fill-none" strokeWidth="1.2">
          <rect x="0" y="0" width="20" height="12" rx="3" fill="none" />
          <rect x="22" y="3.5" width="2" height="5" rx="1" fill="currentColor" stroke="none" />
          <rect x="2" y="2" width="16" height="8" rx="1.5" fill="currentColor" stroke="none" opacity="0.9" />
          <rect x="17" y="3" width="0.5" height="6" fill="#EDDDAF" stroke="none" />
        </svg>
      </div>
    </div>
  )
}
