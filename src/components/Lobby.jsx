// src/components/Lobby.jsx
import { useState } from 'react'
import { Sigil, Painel, Titulo, BtnLink } from './UI'

export default function Lobby({ user, mesas, criarMesa, entrarMesa, onSelecionarMesa, logout }) {
  const [view, setView] = useState('lista') // lista | criar | entrar  const [nomeMesa, setNomeMesa] = useState('')
  const [codigo, setCodigo] = useState('')
  const [codigoCriado, setCodigoCriado] = useState(null)
  const [erro, setErro] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCriar = async e => {
    e.preventDefault()
    if (!nomeMesa.trim()) return
    setLoading(true); setErro(null)
    try {
      const cod = await criarMesa(nomeMesa.trim(), user)
      setCodigoCriado(cod)
      setNomeMesa('')
    } catch (e) { setErro(e.message) }
    finally { setLoading(false) }
  }

  const handleEntrar = async e => {
    e.preventDefault()
    if (!codigo.trim()) return
    setLoading(true); setErro(null)
    try {
      const nome = await entrarMesa(codigo.trim(), user)
      setCodigo('')
      setView('lista')
    } catch (e) { setErro(e.message) }
    finally { setLoading(false) }
  }

  const mesasMestre = mesas.filter(m => m.mestreId === user.uid)
  const mesasJogador = mesas.filter(m => m.mestreId !== user.uid)

  return (
    <div style={{ minHeight: '100vh', maxWidth: 700, margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Sigil size={40} />
          <div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 18, fontWeight: 700, color: '#c8a96e', letterSpacing: 3 }}>AKASHIC RECORDS</div>
            <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2 }}>ENTRE GALÁXIAS · {user.displayName || user.email}</div>
          </div>
        </div>
        <button onClick={logout} style={{ background: 'transparent', border: 'none', color: '#2a3050', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, cursor: 'pointer' }}
          onMouseEnter={e => e.target.style.color = '#9a3030'}
          onMouseLeave={e => e.target.style.color = '#2a3050'}
        >SAIR</button>
      </div>

      {/* Ações */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <BtnLink onClick={() => { setView('criar'); setErro(null); setCodigoCriado(null) }}>+ CRIAR MESA</BtnLink>
        <BtnLink onClick={() => { setView('entrar'); setErro(null) }}>↗ ENTRAR EM MESA</BtnLink>
      </div>

      {/* Criar mesa */}
      {view === 'criar' && (
        <Painel style={{ marginBottom: 24 }} className="anim">
          <Titulo>Nova Mesa</Titulo>
          {codigoCriado ? (
            <div>
              <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#8a9ab0', marginBottom: 16 }}>
                Mesa criada! Compartilhe o código abaixo com seus jogadores:
              </div>
              <div style={{
                fontFamily: 'Cinzel,serif', fontSize: 36, fontWeight: 900,
                color: '#c8a96e', letterSpacing: 8, textAlign: 'center',
                background: 'rgba(200,169,110,0.06)', border: '1px solid #c8a96e33',
                padding: '16px', borderRadius: 2, marginBottom: 16
              }}>{codigoCriado}</div>
              <BtnLink onClick={() => { setView('lista'); setCodigoCriado(null) }}>VER MESAS</BtnLink>
            </div>
          ) : (
            <form onSubmit={handleCriar} style={{ display: 'flex', gap: 10 }}>
              <input value={nomeMesa} onChange={e => setNomeMesa(e.target.value)} placeholder="Nome da mesa..." required style={{ flex: 1 }} />
              <button type="submit" disabled={loading} style={{
                background: 'rgba(200,169,110,0.08)', border: '1px solid #c8a96e55',
                color: '#c8a96e', fontFamily: 'Share Tech Mono,monospace', fontSize: 10,
                letterSpacing: 1, padding: '8px 16px', borderRadius: 2, cursor: 'pointer', whiteSpace: 'nowrap'
              }}>{loading ? '...' : 'CRIAR'}</button>
            </form>
          )}
          {erro && <div style={{ color: '#c06060', fontFamily: 'Share Tech Mono,monospace', fontSize: 11, marginTop: 10 }}>{erro}</div>}
        </Painel>
      )}

      {/* Entrar em mesa */}
      {view === 'entrar' && (
        <Painel style={{ marginBottom: 24 }}>
          <Titulo>Entrar em Mesa</Titulo>
          <form onSubmit={handleEntrar} style={{ display: 'flex', gap: 10 }}>
            <input value={codigo} onChange={e => setCodigo(e.target.value.toUpperCase())}
              placeholder="CÓDIGO DA MESA" maxLength={6} required
              style={{ flex: 1, fontFamily: 'Cinzel,serif', fontSize: 18, letterSpacing: 4, textAlign: 'center' }} />
            <button type="submit" disabled={loading} style={{
              background: 'rgba(74,154,186,0.08)', border: '1px solid #4a9aba55',
              color: '#4a9aba', fontFamily: 'Share Tech Mono,monospace', fontSize: 10,
              letterSpacing: 1, padding: '8px 16px', borderRadius: 2, cursor: 'pointer', whiteSpace: 'nowrap'
            }}>{loading ? '...' : 'ENTRAR'}</button>
          </form>
          {erro && <div style={{ color: '#c06060', fontFamily: 'Share Tech Mono,monospace', fontSize: 11, marginTop: 10 }}>{erro}</div>}
        </Painel>
      )}

      {/* Mesas como Mestre */}
      {mesasMestre.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 3, color: '#c8a96e', marginBottom: 12 }}>SUAS MESAS — MESTRE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mesasMestre.map(m => (
              <MesaCard key={m.id} mesa={m} papel="MESTRE" onEntrar={() => onSelecionarMesa(m)} />
            ))}
          </div>
        </div>
      )}

      {/* Mesas como Jogador */}
      {mesasJogador.length > 0 && (
        <div>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 3, color: '#4a9aba', marginBottom: 12 }}>SUAS MESAS — JOGADOR</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mesasJogador.map(m => (
              <MesaCard key={m.id} mesa={m} papel="JOGADOR" onEntrar={() => onSelecionarMesa(m)} />
            ))}
          </div>
        </div>
      )}

      {mesas.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#2a3050', fontFamily: 'Crimson Text,serif', fontSize: 16 }}>
          Nenhuma mesa ainda.<br />
          <span style={{ fontSize: 13, fontFamily: 'Share Tech Mono,monospace', letterSpacing: 1 }}>Crie uma ou entre com um código.</span>
        </div>
      )}
    </div>
  )
}

function MesaCard({ mesa, papel, onEntrar }) {
  const [h, setH] = useState(false)
  const cor = papel === 'MESTRE' ? '#c8a96e' : '#4a9aba'
  return (
    <div
      onClick={onEntrar}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? 'rgba(200,169,110,0.04)' : 'linear-gradient(145deg,#0d0e18,#09090f)',
        border: `1px solid ${h ? cor + '55' : '#1a1d35'}`,
        padding: '14px 18px', borderRadius: 2, cursor: 'pointer',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        transition: 'all 0.2s'
      }}
    >
      <div>
        <div style={{ fontFamily: 'Cinzel,serif', fontSize: 15, color: h ? cor : '#c8cdd8', letterSpacing: 1 }}>{mesa.nome}</div>
        <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', marginTop: 3, letterSpacing: 1 }}>
          {papel === 'MESTRE' ? `CÓDIGO: ${mesa.codigo} · ${mesa.jogadoresIds?.length || 0} JOGADOR(ES)` : `MESTRE: ${mesa.mestreNome}`}
        </div>
      </div>
      <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, letterSpacing: 2, color: cor, background: `${cor}15`, border: `1px solid ${cor}33`, padding: '3px 8px', borderRadius: 2 }}>{papel}</span>
    </div>
  )
}
