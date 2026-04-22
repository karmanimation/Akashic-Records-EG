// src/components/UI.jsx
import { useState } from 'react'

export function Painel({ children, style = {} }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg,#0d0e18,#09090f)',
      border: '1px solid #1a1d35', padding: 20, borderRadius: 2, ...style
    }}>{children}</div>
  )
}

export function Titulo({ children, cor = '#c8a96e' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <div style={{ width: 16, height: 1, background: cor, opacity: 0.5 }} />
      <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 3, color: cor, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{children}</div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right,${cor}44,transparent)` }} />
    </div>
  )
}

export function Campo({ label, children, style = {} }) {
  return (
    <div style={style}>
      <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2, color: '#3a4560', textTransform: 'uppercase', marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  )
}

export function Grid2({ children, gap = 12 }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap }}>{children}</div>
}

export function Grid3({ children, gap = 12 }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap }}>{children}</div>
}

export function Tag({ children, cor = '#c8a96e' }) {
  return (
    <span style={{
      background: `${cor}15`, border: `1px solid ${cor}44`, color: cor,
      fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2,
      padding: '2px 8px', borderRadius: 2
    }}>{children}</span>
  )
}

export function BtnLink({ children, onClick, cor = '#4a6080' }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: h ? 'rgba(200,169,110,0.08)' : 'transparent',
        border: `1px solid ${h ? '#c8a96e55' : '#2a3050'}`,
        color: h ? '#c8a96e' : cor,
        fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1,
        padding: '7px 16px', borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s'
      }}>{children}</button>
  )
}

export function BtnPerigo({ children, onClick }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: h ? 'rgba(150,30,30,0.12)' : 'transparent',
        border: `1px solid ${h ? '#8a3030' : '#3a1a1a'}`,
        color: '#7a3030',
        fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1,
        padding: '5px 10px', borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s'
      }}>{children}</button>
  )
}

export function Barra({ label, atual, max, cor, onChange }) {
  const pct = max > 0 ? Math.min(100, (atual / max) * 100) : 0
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2, color: cor }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input type="number" min={0} max={max} value={atual}
            onChange={e => onChange(Math.min(max, Math.max(0, Number(e.target.value))))}
            style={{ width: 44, textAlign: 'center', background: 'transparent', border: 'none', color: '#d8dae8', fontFamily: 'Cinzel,serif', fontSize: 15, fontWeight: 600, padding: 0 }} />
          <span style={{ color: '#2a3050' }}>/</span>
          <span style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: cor, opacity: 0.7 }}>{max}</span>
        </div>
      </div>
      <div style={{ height: 4, background: '#0d0e18', border: '1px solid #1a1d35', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: cor, transition: 'width 0.4s', boxShadow: `0 0 8px ${cor}66` }} />
      </div>
    </div>
  )
}

export function Sigil({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" stroke="#c8a96e" strokeWidth="0.5" opacity="0.35"/>
      <circle cx="32" cy="32" r="22" stroke="#4a9aba" strokeWidth="0.5" opacity="0.25"/>
      <circle cx="32" cy="32" r="6" stroke="#c8a96e" strokeWidth="1" opacity="0.7"/>
      <circle cx="32" cy="32" r="2.5" fill="#c8a96e" opacity="0.5"/>
      {[0,60,120,180,240,300].map((a,i) => {
        const rad = (a-90)*Math.PI/180
        return <circle key={i} cx={32+28*Math.cos(rad)} cy={32+28*Math.sin(rad)} r="1.5" fill="#c8a96e" opacity="0.4"/>
      })}
      <line x1="32" y1="2" x2="32" y2="62" stroke="#c8a96e" strokeWidth="0.3" opacity="0.15"/>
      <line x1="2" y1="32" x2="62" y2="32" stroke="#c8a96e" strokeWidth="0.3" opacity="0.15"/>
    </svg>
  )
}
