export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 底色 — 牙白色基调 */}
      <div className="absolute inset-0 bg-[#EDDDAF]" />

      {/* 微妙棋盘格纹理 — 爱马仕经典元素 */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #2B313F 1px, transparent 1px),
            linear-gradient(-45deg, #2B313F 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 浮动光球 1 — 爱马仕橙 */}
      <div
        className="absolute w-[520px] h-[520px] rounded-full opacity-15 animate-blob"
        style={{
          background: 'radial-gradient(circle, rgba(255,138,0,0.5) 0%, rgba(255,138,0,0.05) 70%)',
          top: '-12%',
          right: '-15%',
          filter: 'blur(50px)',
        }}
      />

      {/* 浮动光球 2 — 暖金 */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-12 animate-blob"
        style={{
          background: 'radial-gradient(circle, rgba(255,161,51,0.4) 0%, rgba(237,221,175,0.1) 70%)',
          bottom: '5%',
          left: '-10%',
          animationDelay: '3s',
          filter: 'blur(45px)',
        }}
      />

      {/* 浮动光球 3 — 低调橙 */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full opacity-08 animate-blob"
        style={{
          background: 'radial-gradient(circle, rgba(255,138,0,0.25) 0%, rgba(237,221,175,0.05) 70%)',
          top: '35%',
          left: '25%',
          animationDelay: '6s',
          filter: 'blur(40px)',
        }}
      />

      {/* 右上角爱马仕经典锁链装饰 */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]">
        <svg viewBox="0 0 128 128" fill="none">
          <circle cx="64" cy="64" r="60" stroke="#2B313F" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="64" cy="64" r="44" stroke="#FF8A00" strokeWidth="1" />
          <circle cx="64" cy="64" r="28" stroke="#2B313F" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  )
}
