import { useState } from 'react'
import { Sigil, Painel, Titulo, BtnLink } from './UI'

export default function Lobby({ user, mesas, criarMesa, entrarMesa, salvarCapaMesa, onSelecionarMesa, logout }) {
  const [view, setView] = useState('lista')
  const [nomeMesa, setNomeMesa] = useState('')
  const [capaMesa, setCapaMesa] = useState('')
  const [codigo, setCodigo] = useState('')
  const [codigoCriado, setCodigoCriado] = useState(null)
  const [erro, setErro] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCriar = async e => {
    e.preventDefault()
    if (!nomeMesa.trim()) return
    setLoading(true)
    setErro(null)
    try {
      const cod = await criarMesa(nomeMesa.trim(), user, capaMesa)
      setCodigoCriado(cod)
      setNomeMesa('')
      setCapaMesa('')
    } catch (e) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEntrar = async e => {
    e.preventDefault()
    if (!codigo.trim()) return
    setLoading(true)
    setErro(null)
    try {
      await entrarMesa(codigo.trim(), user)
      setCodigo('')
      setView('lista')
    } catch (e) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  const mesasMestre = mesas.filter(m => m.mestreId === user.uid)
  const mesasJogador = mesas.filter(m => m.mestreId !== user.uid)

  return (
    <div style={{ minHeight: '100vh', maxWidth: 700, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Sigil size={40} />
          <div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 18, fontWeight: 700, color: '#c8a96e', letterSpacing: 3 }}>AKASHIC RECORDS</div>
            <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2 }}>ENTRE GALAXIAS · {user.displayName || user.email}</div>
          </div>
        </div>
        <button onClick={logout} style={{ background: 'transparent', border: 'none', color: '#2a3050', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, cursor: 'pointer' }}
          onMouseEnter={e => e.target.style.color = '#9a3030'}
          onMouseLeave={e => e.target.style.color = '#2a3050'}
        >SAIR</button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <BtnLink onClick={() => { setView('criar'); setErro(null); setCodigoCriado(null) }}>+ CRIAR MESA</BtnLink>
        <BtnLink onClick={() => { setView('entrar'); setErro(null) }}>ENTRAR EM MESA</BtnLink>
      </div>

      {view === 'criar' && (
        <Painel style={{ marginBottom: 24 }} className="anim">
          <Titulo>Nova Mesa</Titulo>
          {codigoCriado ? (
            <div>
              <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#8a9ab0', marginBottom: 16 }}>
                Mesa criada! Compartilhe o codigo abaixo com seus jogadores:
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
            <form onSubmit={handleCriar} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
                <MesaCapaPreview capaURL={capaMesa} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input value={nomeMesa} onChange={e => setNomeMesa(e.target.value)} placeholder="Nome da mesa..." required style={{ flex: 1 }} />
                  <UploadCapa onImagem={setCapaMesa} label={capaMesa ? 'ALTERAR CAPA' : '+ CAPA / LOGO'} />
                </div>
              </div>
              <button type="submit" disabled={loading} style={{
                alignSelf: 'flex-end',
                background: 'rgba(200,169,110,0.08)',
                border: '1px solid #c8a96e55',
                color: '#c8a96e',
                fontFamily: 'Share Tech Mono,monospace',
                fontSize: 10,
                letterSpacing: 1,
                padding: '8px 16px',
                borderRadius: 2,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>{loading ? '...' : 'CRIAR'}</button>
            </form>
          )}
          {erro && <div style={{ color: '#c06060', fontFamily: 'Share Tech Mono,monospace', fontSize: 11, marginTop: 10 }}>{erro}</div>}
        </Painel>
      )}

      {view === 'entrar' && (
        <Painel style={{ marginBottom: 24 }}>
          <Titulo>Entrar em Mesa</Titulo>
          <form onSubmit={handleEntrar} style={{ display: 'flex', gap: 10 }}>
            <input value={codigo} onChange={e => setCodigo(e.target.value.toUpperCase())}
              placeholder="CODIGO DA MESA" maxLength={6} required
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

      {mesasMestre.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 3, color: '#c8a96e', marginBottom: 12 }}>SUAS MESAS - MESTRE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mesasMestre.map(m => (
              <MesaCard key={m.id} mesa={m} papel="MESTRE" onEntrar={() => onSelecionarMesa(m)} onAtualizarCapa={salvarCapaMesa} />
            ))}
          </div>
        </div>
      )}

      {mesasJogador.length > 0 && (
        <div>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 3, color: '#4a9aba', marginBottom: 12 }}>SUAS MESAS - JOGADOR</div>
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
          <span style={{ fontSize: 13, fontFamily: 'Share Tech Mono,monospace', letterSpacing: 1 }}>Crie uma ou entre com um codigo.</span>
        </div>
      )}
    </div>
  )
}

function MesaCard({ mesa, papel, onEntrar, onAtualizarCapa }) {
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
        padding: 0,
        borderRadius: 2,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
        transition: 'all 0.2s'
      }}
    >
      <MesaCapaPreview capaURL={mesa.capaURL} compacta />
      <div style={{ flex: 1, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 15, color: h ? cor : '#c8cdd8', letterSpacing: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mesa.nome}</div>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', marginTop: 3, letterSpacing: 1 }}>
            {papel === 'MESTRE' ? `CODIGO: ${mesa.codigo} · ${mesa.jogadoresIds?.length || 0} JOGADOR(ES)` : `MESTRE: ${mesa.mestreNome}`}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {papel === 'MESTRE' && onAtualizarCapa && (
            <UploadCapa onImagem={(img) => onAtualizarCapa(mesa.id, img)} label="CAPA" compacto stopPropagation />
          )}
          <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, letterSpacing: 2, color: cor, background: `${cor}15`, border: `1px solid ${cor}33`, padding: '3px 8px', borderRadius: 2 }}>{papel}</span>
        </div>
      </div>
    </div>
  )
}

function MesaCapaPreview({ capaURL, compacta = false }) {
  return (
    <div style={{
      width: compacta ? 82 : 112,
      minHeight: compacta ? 72 : 86,
      flexShrink: 0,
      background: '#09090f',
      borderRight: compacta ? '1px solid #1a1d35' : undefined,
      border: compacta ? undefined : '1px solid #1a1d35',
      borderRadius: compacta ? 0 : 2,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {capaURL ? (
        <img src={capaURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ textAlign: 'center', color: '#2a3050', fontFamily: 'Share Tech Mono,monospace', fontSize: 8, letterSpacing: 1 }}>SEM<br />CAPA</div>
      )}
    </div>
  )
}

function UploadCapa({ onImagem, label, compacto = false, stopPropagation = false }) {
  const id = `mesa-capa-${Math.random().toString(36).slice(2)}`
  return (
    <>
      <input id={id} type="file" accept="image/*" style={{ display: 'none' }} onClick={e => stopPropagation && e.stopPropagation()} onChange={async e => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 2 * 1024 * 1024) {
          alert('Imagem muito grande. Use ate 2MB.')
          return
        }
        onImagem(await compactarImagem(file))
        e.target.value = ''
      }} />
      <button type="button" onClick={e => {
        if (stopPropagation) e.stopPropagation()
        document.getElementById(id)?.click()
      }} style={{
        background: 'transparent',
        border: '1px solid #2a3050',
        color: '#4a6080',
        fontFamily: 'Share Tech Mono,monospace',
        fontSize: compacto ? 8 : 9,
        letterSpacing: 1,
        padding: compacto ? '5px 8px' : '7px 12px',
        borderRadius: 2,
        cursor: 'pointer',
        width: compacto ? undefined : 'fit-content'
      }}>{label}</button>
    </>
  )
}

function compactarImagem(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = ev => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const max = 900
        let w = img.width
        let h = img.height
        if (w > h && w > max) {
          h = Math.round(h * max / w)
          w = max
        }
        if (h >= w && h > max) {
          w = Math.round(w * max / h)
          h = max
        }
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  })
}
