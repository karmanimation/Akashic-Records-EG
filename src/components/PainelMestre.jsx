// src/components/PainelMestre.jsx
import { useState } from 'react'
import { useFichasMesa } from '../hooks/useFicha'
import { Painel, Titulo, Barra, Tag } from './UI'

export default function PainelMestre({ mesa, onVoltar }) {
  const { fichas, loading } = useFichasMesa(mesa.id)
  const [selecionada, setSelecionada] = useState(null)

  if (loading) return <Carregando />

  if (selecionada) {
    const ficha = fichas.find(f => f.uid === selecionada)
    return <VisualizarFicha ficha={ficha} onVoltar={() => setSelecionada(null)} />
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2, marginBottom: 4 }}>VISÃO DO MESTRE</div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 20, fontWeight: 700, color: '#c8a96e', letterSpacing: 2 }}>{mesa.nome}</div>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', marginTop: 4 }}>CÓDIGO: {mesa.codigo}</div>
        </div>
        <button onClick={onVoltar} style={{ background: 'transparent', border: '1px solid #2a3050', color: '#4a6080', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, padding: '7px 14px', borderRadius: 2, cursor: 'pointer' }}>← VOLTAR</button>
      </div>

      {fichas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#2a3050', fontFamily: 'Crimson Text,serif', fontSize: 16 }}>
          Nenhum jogador criou ficha ainda.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {fichas.map(f => <CardFichaResumida key={f.uid} ficha={f} onClick={() => setSelecionada(f.uid)} />)}
        </div>
      )}
    </div>
  )
}

function CardFichaResumida({ ficha, onClick }) {
  const [h, setH] = useState(false)
  const vidaMax = (ficha.focos?.Vigor || 0) * 5 + (ficha.reservas?.vida?.bonus || 0) + 10
  const esforcoMax = (ficha.focos?.Domínio || 0) * 3 + (ficha.reservas?.esforco?.bonus || 0) + 5
  const sanMax = (ficha.focos?.Intelecto || 0) * 3 + (ficha.reservas?.sanidade?.bonus || 0) + 10

  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: h ? 'rgba(200,169,110,0.03)' : 'linear-gradient(145deg,#0d0e18,#09090f)',
        border: `1px solid ${h ? '#c8a96e44' : '#1a1d35'}`,
        padding: '16px 20px', borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s'
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {ficha.fotoURL && (
            <img src={ficha.fotoURL} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 2, border: '1px solid #1a1d35' }} />
          )}
          <div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 16, color: h ? '#c8a96e' : '#c8cdd8', letterSpacing: 1 }}>{ficha.nome || 'Sem nome'}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
              {ficha.classe && <Tag>{ficha.classe}</Tag>}
              {ficha.trilha && <Tag cor="#4a9aba">{ficha.trilha}</Tag>}
              {ficha.elemento !== 'Nenhum' && ficha.elemento && <Tag cor="#6a3a8a">{ficha.elemento}</Tag>}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 2 }}>NÍVEL</div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 24, fontWeight: 900, color: '#4a9aba' }}>{ficha.nivel || 1}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <MiniBar label="VIDA" atual={ficha.reservas?.vida?.atual || 0} max={vidaMax} cor="#9a3030" />
        <MiniBar label="ESFORÇO" atual={ficha.reservas?.esforco?.atual || 0} max={esforcoMax} cor="#4a9aba" />
        <MiniBar label="SANIDADE" atual={ficha.reservas?.sanidade?.atual || 0} max={sanMax} cor="#6a3a8a" />
      </div>
    </div>
  )
}

function MiniBar({ label, atual, max, cor }) {
  const pct = max > 0 ? Math.min(100, (atual / max) * 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: cor, width: 52, letterSpacing: 1 }}>{label}</div>
      <div style={{ flex: 1, height: 3, background: '#0d0e18', border: '1px solid #1a1d35', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: cor, boxShadow: `0 0 6px ${cor}55` }} />
      </div>
      <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', width: 40, textAlign: 'right' }}>{atual}/{max}</div>
    </div>
  )
}

function VisualizarFicha({ ficha, onVoltar }) {
  const vidaMax = (ficha.focos?.Vigor || 0) * 5 + (ficha.reservas?.vida?.bonus || 0) + 10
  const esforcoMax = (ficha.focos?.Domínio || 0) * 3 + (ficha.reservas?.esforco?.bonus || 0) + 5
  const sanMax = (ficha.focos?.Intelecto || 0) * 3 + (ficha.reservas?.sanidade?.bonus || 0) + 10
  const focos = ficha.focos || {}

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      <button onClick={onVoltar} style={{ background: 'transparent', border: '1px solid #2a3050', color: '#4a6080', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, padding: '7px 14px', borderRadius: 2, cursor: 'pointer', marginBottom: 20 }}>← VOLTAR À LISTA</button>

      {/* Header do personagem */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>
        {ficha.fotoURL && (
          <img src={ficha.fotoURL} alt="" style={{ width: 100, aspectRatio: '3/4', objectFit: 'cover', border: '1px solid #1a1d35', borderRadius: 2, clipPath: 'polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px)' }} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 22, fontWeight: 700, color: '#c8a96e', letterSpacing: 2, marginBottom: 6 }}>{ficha.nome || 'Sem nome'}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {ficha.classe && <Tag>{ficha.classe}</Tag>}
            {ficha.trilha && <Tag cor="#4a9aba">{ficha.trilha}</Tag>}
            {ficha.elemento !== 'Nenhum' && ficha.elemento && <Tag cor="#6a3a8a">{ficha.elemento}</Tag>}
            {ficha.genese && <Tag cor="#5a7050">{ficha.genese}</Tag>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Barra label="VIDA" atual={ficha.reservas?.vida?.atual || 0} max={vidaMax} cor="#9a3030" onChange={() => {}} />
            <Barra label="ESFORÇO" atual={ficha.reservas?.esforco?.atual || 0} max={esforcoMax} cor="#4a9aba" onChange={() => {}} />
            <Barra label="SANIDADE" atual={ficha.reservas?.sanidade?.atual || 0} max={sanMax} cor="#6a3a8a" onChange={() => {}} />
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 2 }}>NÍVEL</div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 36, fontWeight: 900, color: '#4a9aba', lineHeight: 1 }}>{ficha.nivel || 1}</div>
        </div>
      </div>

      {/* Focos */}
      <Painel style={{ marginBottom: 12 }}>
        <Titulo>Focos</Titulo>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
          {Object.entries(focos).map(([attr, val]) => (
            <div key={attr} style={{ textAlign: 'center', background: '#09090f', border: '1px solid #1a1d35', padding: '10px 6px', borderRadius: 2 }}>
              <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#4a5070', letterSpacing: 1, marginBottom: 4 }}>{attr.slice(0, 3).toUpperCase()}</div>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 24, fontWeight: 900, color: val > 0 ? '#c8a96e' : '#2a3050' }}>{val}</div>
            </div>
          ))}
        </div>
      </Painel>

      {/* Combate */}
      {ficha.combate && (
        <Painel style={{ marginBottom: 12 }}>
          <Titulo>Combate</Titulo>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {[
              ['RESISTÊNCIA', ficha.combate.resistencia],
              ['DEFESA', ficha.combate.defesa],
              ['CONTRA ATAQUE', ficha.combate.contraAtaque],
              ['ESQUIVA', ficha.combate.esquiva],
              ['ARMADURA', ficha.combate.armaduraBase],
              ['MOVIMENTO', ficha.combate.movimento],
            ].map(([l, v]) => (
              <div key={l} style={{ textAlign: 'center', background: '#09090f', border: '1px solid #1a1d35', padding: '8px' }}>
                <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 1 }}>{l}</div>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 20, fontWeight: 700, color: '#c8cdd8' }}>{v || 0}</div>
              </div>
            ))}
          </div>
        </Painel>
      )}

      {/* Capacidades */}
      {['habilidades', 'magias', 'passivas', 'poderes'].map(tipo => {
        const lista = ficha[tipo] || []
        if (!lista.length) return null
        const cores = { habilidades: '#c8a96e', magias: '#4a9aba', passivas: '#6a3a8a', poderes: '#9a3030' }
        return (
          <Painel key={tipo} style={{ marginBottom: 12 }}>
            <Titulo cor={cores[tipo]}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</Titulo>
            {lista.map((item, i) => (
              <div key={i} style={{ borderLeft: `2px solid ${cores[tipo]}44`, paddingLeft: 10, marginBottom: 8 }}>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: cores[tipo] }}>{item.nome}</div>
                {item.desc && <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 14, color: '#6a7090', marginTop: 2 }}>{item.desc}</div>}
              </div>
            ))}
          </Painel>
        )
      })}

      {/* Notas */}
      {ficha.notas && (
        <Painel>
          <Titulo>Notas</Titulo>
          <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#8a9ab0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{ficha.notas}</div>
        </Painel>
      )}
    </div>
  )
}

function Carregando() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Share Tech Mono,monospace', fontSize: 11, letterSpacing: 3, color: '#3a4560' }}>
      CARREGANDO...
    </div>
  )
}
