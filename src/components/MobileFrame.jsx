import { useRef } from 'react'
import StatusBar from './StatusBar'

export default function MobileFrame({ children, currentPhase = 'welcome' }) {
  const scrollRef = useRef(null)

  return (
    <div className="min-h-screen flex bg-[#1e1e1e]">
      {/* ===== 左侧：手机预览区（模拟微信开发者工具） ===== */}
      <div className="flex-1 flex items-center justify-center bg-[#2c2c2c] relative">
        {/* 顶部工具栏 */}
        <div className="absolute top-0 left-0 right-0 h-9 bg-[#3c3c3c] flex items-center px-4 z-10 border-b border-[#4a4a4a]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[11px] text-[#999] font-mono">AI 天赋测评 — 预览</span>
          </div>
          <div className="w-16" />
        </div>

        {/* 手机外壳 — iPhone 15 Pro 风格 */}
        <div className="relative w-full max-w-[390px] aspect-[390/844] max-h-[82vh] bg-[#1a1a1a] rounded-[48px] p-[9px] shadow-[0_0_0_1.5px_#333,0_0_0_3px_#1a1a1a,0_25px_70px_rgba(0,0,0,0.6)] mt-6">
          {/* 侧边按钮 */}
          <div className="absolute -left-[3px] top-[140px] w-[3px] h-7 bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -left-[3px] top-[190px] w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -left-[3px] top-[255px] w-[3px] h-12 bg-[#2a2a2a] rounded-l-sm" />
          <div className="absolute -right-[3px] top-[195px] w-[3px] h-14 bg-[#2a2a2a] rounded-r-sm" />

          {/* 屏幕圆角外壳 */}
          <div className="w-full h-full bg-[#1a1a1a] rounded-[40px] overflow-hidden relative">
            {/* 灵动岛 */}
            <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[124px] h-[34px] bg-[#0a0a0a] rounded-[20px] z-50 shadow-inner" />

            {/* 屏幕内容区 */}
            <div className="w-full h-full bg-[#EDDDAF] rounded-[40px] overflow-hidden relative">
              {/* 状态栏 */}
              <StatusBar />

              {/* 滚动内容区 */}
              <div
                ref={scrollRef}
                className="h-full overflow-y-auto overflow-x-hidden pt-12 pb-6 scroll-smooth"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                {children}
              </div>

              {/* Home 指示条 */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-[#333] rounded-full z-30 opacity-60" />
            </div>
          </div>
        </div>

        {/* 底部设备信息 */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[10px] text-[#666] font-mono">
          <span>iPhone 15 Pro</span>
          <span className="text-[#444]">|</span>
          <span>390 × 844</span>
          <span className="text-[#444]">|</span>
          <span>DPR 3</span>
        </div>
      </div>

      {/* ===== 右侧：调试信息面板（桌面端可见） ===== */}
      <div className="hidden md:flex w-72 xl:w-80 bg-[#252526] border-l border-[#3c3c3c] flex-col">
        {/* 面板头部 */}
        <div className="h-9 bg-[#3c3c3c] flex items-center px-3 border-b border-[#4a4a4a] shrink-0">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-[11px] text-[#ccc] font-mono">Simulator</span>
          </div>
        </div>

        {/* 阶段指示器 */}
        <div className="px-4 py-3 border-b border-[#3c3c3c]">
          <div className="text-[10px] text-[#888] font-mono uppercase tracking-wider mb-2">Phase State</div>
          <div className="flex gap-1">
            {['welcome', 'onboard', 'analysis', 'report'].map((p, i) => {
              const phaseOrder = ['welcome', 'onboard', 'analysis', 'report']
              const currentIndex = phaseOrder.indexOf(currentPhase)
              const thisIndex = i
              const isActive = p === currentPhase
              const isDone = thisIndex < currentIndex
              return (
                <div key={p} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full h-1 rounded-full transition-all duration-500 ${
                    isActive ? 'bg-[#ff8a00]' : isDone ? 'bg-[#ff8a00]/40' : 'bg-[#3c3c3c]'
                  }`} />
                  <span className={`text-[8px] font-mono transition-colors duration-300 ${
                    isActive ? 'text-[#ff8a00]' : isDone ? 'text-[#ff8a00]/40' : 'text-[#666]'
                  }`}>{p.slice(0, 4)}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 技术栈信息 */}
        <div className="px-4 py-3 border-b border-[#3c3c3c]">
          <div className="text-[10px] text-[#888] font-mono uppercase tracking-wider mb-2">Tech Stack</div>
          <div className="space-y-1.5">
            {[
              { name: 'React 19', color: '#61dafb' },
              { name: 'Vite 8', color: '#646cff' },
              { name: 'Tailwind v4', color: '#38bdf8' },
              { name: 'ECharts 6', color: '#e43961' },
              { name: 'Framer Motion', color: '#ff0055' },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-[11px] text-[#aaa] font-mono">{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 项目信息 */}
        <div className="px-4 py-3 border-b border-[#3c3c3c]">
          <div className="text-[10px] text-[#888] font-mono uppercase tracking-wider mb-2">Project</div>
          <div className="space-y-1.5 text-[11px] text-[#999] font-mono">
            <div className="flex justify-between">
              <span>Design</span>
              <span className="text-[#ff8a00]">Hermès Orange</span>
            </div>
            <div className="flex justify-between">
              <span>Platform</span>
              <span>Mobile First</span>
            </div>
            <div className="flex justify-between">
              <span>Viewport</span>
              <span>390 × 844</span>
            </div>
          </div>
        </div>

        {/* 操作提示 */}
        <div className="flex-1 px-4 py-3">
          <div className="text-[10px] text-[#888] font-mono uppercase tracking-wider mb-2">Controls</div>
          <div className="space-y-1 text-[10px] text-[#666] font-mono">
            <div>📱 Scroll to navigate</div>
            <div>👆 Tap cards to expand</div>
            <div>🔄 Flow: Welcome → Onboard → Analysis → Report</div>
          </div>
        </div>

        {/* 底部链接 */}
        <div className="px-4 py-3 border-t border-[#3c3c3c]">
          <a
            href="https://github.com/linyi0422/ai-talent-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] text-[#ff8a00] font-mono hover:underline"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            github.com/linyi0422/ai-talent-demo
          </a>
        </div>
      </div>
    </div>
  )
}
