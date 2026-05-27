import { useEffect, useRef } from 'react'

export default function MobileFrame({ children, currentPhase = 'welcome' }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, left: 0 })
  }, [currentPhase])

  return (
    <div className="h-screen flex bg-[#1e1e1e] overflow-hidden">
      {/* ===== 左侧：内容预览区 ===== */}
      <div className="flex-1 relative bg-[#151515]">
        {/* 顶部工具栏 */}
        <div className="absolute top-0 left-0 right-0 h-9 bg-[#3c3c3c] flex items-center px-4 z-50">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[11px] text-[#bbb] font-mono">AI 天赋测评 — Demo</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#666] font-mono">
            <span>Presenter</span>
          </div>
        </div>

        {/* 内容区 — 居中手机演示画布 */}
        <div className="h-full pt-[60px] px-3 sm:px-6 pb-6 flex items-center justify-center">
          <div className="relative w-full max-w-[430px] h-[calc(100vh-84px)] max-h-[860px] rounded-[34px] bg-[#111] p-2 shadow-2xl shadow-black/50 border border-white/10">
            <div
              ref={scrollRef}
              className="h-full rounded-[26px] overflow-y-auto overflow-x-hidden scroll-smooth bg-cream"
              style={{
                WebkitOverflowScrolling: 'touch',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* ===== 右侧：调试信息面板（桌面端可见） ===== */}
      <div className="hidden lg:flex w-72 xl:w-80 bg-[#252526] border-l border-[#3c3c3c] flex-col">
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
              const isActive = p === currentPhase
              const isDone = i < currentIndex
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

        {/* 视口信息 */}
        <div className="px-4 py-3 border-b border-[#3c3c3c]">
          <div className="text-[10px] text-[#888] font-mono uppercase tracking-wider mb-2">Layout</div>
          <div className="space-y-1.5 text-[11px] text-[#999] font-mono">
            <div className="flex justify-between">
              <span>Mode</span>
              <span className="text-[#ff8a00]">Presenter Demo</span>
            </div>
            <div className="flex justify-between">
              <span>Device</span>
              <span className="text-[#bbb]">430px</span>
            </div>
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
              <span>Flow</span>
              <span className="text-[#bbb]">4 Phases</span>
            </div>
          </div>
        </div>

        {/* 操作提示 */}
        <div className="flex-1 px-4 py-3">
          <div className="text-[10px] text-[#888] font-mono uppercase tracking-wider mb-2">Controls</div>
          <div className="space-y-1.5 text-[10px] text-[#666] font-mono">
            <div>📱 Scroll to navigate</div>
            <div>👆 Tap cards to expand</div>
            <div>🔄 Welcome → Onboard → Analysis → Report</div>
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
