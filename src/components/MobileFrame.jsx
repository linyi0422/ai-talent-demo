import { useRef } from 'react'
import StatusBar from './StatusBar'

export default function MobileFrame({ children }) {
  const scrollRef = useRef(null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-4 md:p-8">
      {/* 手机外壳 */}
      <div className="relative w-full max-w-[390px] aspect-[390/844] max-h-[95vh] bg-slate-800 rounded-[44px] p-[10px] shadow-[0_0_0_2px_#1a1a1a,0_0_0_4px_#2a2a2a,0_20px_60px_rgba(0,0,0,0.5)]">
        {/* 静音开关 */}
        <div className="absolute -left-[5px] top-[120px] w-[4px] h-8 bg-slate-700 rounded-l-sm" />
        {/* 音量上 */}
        <div className="absolute -left-[5px] top-[170px] w-[4px] h-14 bg-slate-700 rounded-l-sm" />
        {/* 音量下 */}
        <div className="absolute -left-[5px] top-[240px] w-[4px] h-14 bg-slate-700 rounded-l-sm" />
        {/* 电源键 */}
        <div className="absolute -right-[5px] top-[170px] w-[4px] h-16 bg-slate-700 rounded-r-sm" />

        {/* 灵动岛 */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[120px] h-[32px] bg-slate-900 rounded-b-[20px] z-50" />

        {/* 屏幕区域 */}
        <div className="w-full h-full bg-[#EDDDAF] rounded-[34px] overflow-hidden relative">
          {/* 状态栏 */}
          <StatusBar />

          {/* 滚动内容区 */}
          <div
            ref={scrollRef}
            className="h-full overflow-y-auto overflow-x-hidden pt-11 pb-6 scroll-smooth"
            style={{
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {children}
          </div>

          {/* Home 指示条 */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-slate-700 rounded-full z-30" />
        </div>
      </div>

      {/* 桌面端：手机下方提示 */}
      <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 text-xs tracking-wider">
        ↓ 滚动查看完整报告
      </div>
    </div>
  )
}
