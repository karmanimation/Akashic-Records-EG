// src/components/PainelMestre.jsx
import { useState } from 'react'
import { useFichasMesa, useNPCs } from '../hooks/useFicha'
import { CLASSES, PERICIAS, GENESES, ELEMENTOS, TIPOS_ARMA, CATALOGO_ARMAS, CATALOGO_MAGIAS, CATALOGO_PODERES, ACESSORIOS_ARMA, TIPOS_MUNICAO, CARGA_POR_FORCA, CAPACIDADES_AUTOMATICAS, fichaInicial } from '../data/sistema'
import { Painel, Titulo, Tag, Campo, Grid2, BtnLink, BtnPerigo } from './UI'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

const CAMPOS_BLOQUEAVEIS = [
  { key: 'classe', label: 'Classe' },
  { key: 'trilha', label: 'Trilha' },
  { key: 'genese', label: 'Gênese' },
  { key: 'elementos', label: 'Elementos' },
  { key: 'focos', label: 'Atributos (Focos)' },
  { key: 'pericias', label: 'Perícias' },
  { key: 'habilidades', label: 'Habilidades' },
  { key: 'passivas', label: 'Passivas' },
  { key: 'magias', label: 'Magias' },
  { key: 'poderes', label: 'Poderes' },
]

const CATEGORIAS_NPC = ['Boss', 'Principal', 'Inimigo', 'Aliado', 'Coadjuvante', 'Padrão']
const COR_CATEGORIA = { Boss: '#9a3030', Principal: '#c8a96e', Inimigo: '#8a4a20', Aliado: '#3a8a50', Coadjuvante: '#4a9aba', 'Padrão': '#5a6580' }

export default function PainelMestre({ mesa, onVoltar }) {
  const { fichas, loading, excluirFicha } = useFichasMesa(mesa.id)
  const { npcs, salvarNPC, excluirNPC } = useNPCs(mesa.id)
  const [selecionada, setSelecionada] = useState(null)
  const [abaVer, setAbaVer] = useState('geral')
  const [abaPrincipal, setAbaPrincipal] = useState('jogadores') // 'jogadores' | 'npcs'
  const [npcSelecionado, setNpcSelecionado] = useState(null)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(null) // uid da ficha

  const liberarCampo = async (uid, campo, liberar) => {
    const ficha = fichas.find(f => f.uid === uid)
    if (!ficha) return
    const camposBloqueados = { ...(ficha.camposBloqueados || {}) }
    if (liberar) camposBloqueados[campo] = false
    else delete camposBloqueados[campo]
    await setDoc(doc(db, 'mesas', mesa.id, 'fichas', uid), { camposBloqueados }, { merge: true })
  }

  const aprovarExclusao = async (uid) => {
    await excluirFicha(uid)
    setConfirmandoExclusao(null)
    setSelecionada(null)
  }

  const rejeitarExclusao = async (uid) => {
    await setDoc(doc(db, 'mesas', mesa.id, 'fichas', uid), { solicitandoExclusao: false }, { merge: true })
    setConfirmandoExclusao(null)
  }

  if (loading) return <Splash texto="CARREGANDO..." />

  // Fichas com solicitação de exclusão pendente
  const solicitacoesPendentes = fichas.filter(f => f.solicitandoExclusao)

  if (selecionada) {
    const ficha = fichas.find(f => f.uid === selecionada)
    if (!ficha) return <Splash texto="CARREGANDO..." />
    return <VisualizarFicha ficha={ficha} fichas={fichas} uid={selecionada} onVoltar={() => setSelecionada(null)} abaVer={abaVer} setAbaVer={setAbaVer} liberarCampo={(campo, liberar) => liberarCampo(selecionada, campo, liberar)} aprovarExclusao={() => aprovarExclusao(selecionada)} rejeitarExclusao={() => rejeitarExclusao(selecionada)} />
  }

  if (npcSelecionado !== null) {
    const npc = npcSelecionado === 'novo' ? fichaInicial() : npcs.find(n => n.id === npcSelecionado)
    return <EditarNPC npc={npc} isNovo={npcSelecionado === 'novo'} onVoltar={() => setNpcSelecionado(null)} salvarNPC={async (dados) => { await salvarNPC(dados); setNpcSelecionado(null) }} excluirNPC={async () => { await excluirNPC(npcSelecionado); setNpcSelecionado(null) }} />
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>

      {/* Modal confirmação exclusão */}
      {confirmandoExclusao && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0d0e18', border: '1px solid #9a3030', borderRadius: 2, padding: 32, maxWidth: 420, width: '100%' }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 16, color: '#c05050', letterSpacing: 2, marginBottom: 12 }}>EXCLUIR FICHA</div>
            <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#8a9ab0', lineHeight: 1.6, marginBottom: 20 }}>
              O jogador <strong style={{ color: '#c8a96e' }}>{fichas.find(f => f.uid === confirmandoExclusao)?.nome || 'Sem nome'}</strong> solicitou a exclusão de sua ficha.<br /><br />
              Deseja aprovar e excluir permanentemente?
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => aprovarExclusao(confirmandoExclusao)} style={{ flex: 1, background: 'rgba(154,48,48,0.15)', border: '1px solid #9a3030', color: '#c05050', fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, padding: '10px', borderRadius: 2, cursor: 'pointer' }}>SIM, EXCLUIR</button>
              <button onClick={() => rejeitarExclusao(confirmandoExclusao)} style={{ flex: 1, background: 'transparent', border: '1px solid #2a3050', color: '#6a7090', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1, padding: '10px', borderRadius: 2, cursor: 'pointer' }}>REJEITAR</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2, marginBottom: 4 }}>VISÃO DO MESTRE</div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 19, fontWeight: 700, color: '#c8a96e', letterSpacing: 2 }}>{mesa.nome}</div>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', marginTop: 3 }}>CÓDIGO: {mesa.codigo}</div>
        </div>
        <button onClick={onVoltar} style={{ background: 'transparent', border: '1px solid #2a3050', color: '#4a6080', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, padding: '7px 14px', borderRadius: 2, cursor: 'pointer' }}>← VOLTAR</button>
      </div>

      {/* Alertas de exclusão pendente */}
      {solicitacoesPendentes.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {solicitacoesPendentes.map(f => (
            <div key={f.uid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(154,48,48,0.08)', border: '1px solid rgba(154,48,48,0.4)', borderRadius: 2, padding: '10px 14px', marginBottom: 8 }}>
              <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 14, color: '#c05050' }}>
                🗑 <strong>{f.nome || 'Sem nome'}</strong> solicitou exclusão da ficha
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setConfirmandoExclusao(f.uid)} style={{ background: 'rgba(154,48,48,0.15)', border: '1px solid #9a3030', color: '#c05050', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, padding: '5px 12px', borderRadius: 2, cursor: 'pointer' }}>APROVAR</button>
                <button onClick={() => rejeitarExclusao(f.uid)} style={{ background: 'transparent', border: '1px solid #2a3050', color: '#5a6080', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, padding: '5px 12px', borderRadius: 2, cursor: 'pointer' }}>REJEITAR</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Abas principais */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1a1d35', marginBottom: 20 }}>
        {[['jogadores', 'JOGADORES'], ['npcs', 'NPCs']].map(([id, label]) => (
          <button key={id} onClick={() => setAbaPrincipal(id)} style={{
            background: 'transparent', border: 'none',
            borderBottom: abaPrincipal === id ? '2px solid #c8a96e' : '2px solid transparent',
            color: abaPrincipal === id ? '#c8a96e' : '#3a4560',
            fontFamily: 'Cormorant SC,serif', fontSize: 13, letterSpacing: 2,
            padding: '10px 20px', cursor: 'pointer'
          }}>{label}</button>
        ))}
      </div>

      {/* Lista de Jogadores */}
      {abaPrincipal === 'jogadores' && (
        fichas.filter(f => !f.ehNPC).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#2a3050', fontFamily: 'Crimson Text,serif', fontSize: 16 }}>Nenhum jogador criou ficha ainda.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {fichas.filter(f => !f.ehNPC).map(f => (
              <CardFichaResumida key={f.uid} ficha={f} onClick={() => { setSelecionada(f.uid); setAbaVer('geral') }} />
            ))}
          </div>
        )
      )}

      {/* Lista de NPCs */}
      {abaPrincipal === 'npcs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button onClick={() => setNpcSelecionado('novo')} style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.3)', color: '#c8a96e', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1, padding: '8px 16px', borderRadius: 2, cursor: 'pointer' }}>+ CRIAR NPC</button>
          </div>
          {CATEGORIAS_NPC.map(cat => {
            const lista = npcs.filter(n => n.categoriaNPC === cat)
            if (lista.length === 0) return null
            const cor = COR_CATEGORIA[cat]
            return (
              <div key={cat} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 14, height: 1, background: cor, opacity: 0.6 }} />
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 3, color: cor, textTransform: 'uppercase' }}>{cat}</div>
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(to right,${cor}55,transparent)` }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {lista.map(npc => (
                    <div key={npc.id} onClick={() => setNpcSelecionado(npc.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(145deg,#0d0e18,#09090f)', border: `1px solid ${cor}33`, padding: '12px 16px', borderRadius: 2, cursor: 'pointer', transition: 'border-color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = `${cor}88`}
                      onMouseLeave={e => e.currentTarget.style.borderColor = `${cor}33`}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {npc.fotoURL && <img src={npc.fotoURL} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 2, border: '1px solid #1a1d35' }} />}
                        <div>
                          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 14, color: '#c8cdd8' }}>{npc.nome || 'Sem nome'}</div>
                          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', marginTop: 3 }}>{npc.classe || '—'} · Nível {npc.nivel || 1}</div>
                        </div>
                      </div>
                      <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: cor, background: `${cor}15`, border: `1px solid ${cor}44`, padding: '2px 8px', borderRadius: 2, letterSpacing: 1 }}>{cat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          {npcs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#2a3050', fontFamily: 'Crimson Text,serif', fontSize: 16 }}>Nenhum NPC criado ainda.</div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Card de ficha resumida ───────────────────────────────────
function CardFichaResumida({ ficha, onClick }) {
  const [h, setH] = useState(false)
  const vidaAtual = ficha.reservas?.vida?.atual || 0
  const vidaMax = ficha.reservas?.vida?.max || 1
  const efAtual = ficha.reservas?.esforco?.atual || 0
  const efMax = ficha.reservas?.esforco?.max || 1
  const sanAtual = ficha.reservas?.sanidade?.atual || 0
  const sanMax = ficha.reservas?.sanidade?.max || 1

  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? 'rgba(200,169,110,0.03)' : 'linear-gradient(145deg,#0d0e18,#09090f)', border: `1px solid ${ficha.solicitandoExclusao ? '#9a3030' : h ? '#c8a96e44' : '#1a1d35'}`, padding: '16px 20px', borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {ficha.fotoURL && <img src={ficha.fotoURL} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 2, border: '1px solid #1a1d35' }} />}
          <div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 16, color: h ? '#c8a96e' : '#c8cdd8', letterSpacing: 1 }}>{ficha.nome || 'Sem nome'}{ficha.solicitandoExclusao ? ' 🗑' : ''}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
              {ficha.classe && <Tag>{ficha.classe}</Tag>}
              {ficha.trilha && <Tag cor="#4a9aba">{ficha.trilha}</Tag>}
              {(ficha.elementos || []).map(el => <Tag key={el} cor="#6a3a8a">{el}</Tag>)}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 2 }}>NÍVEL</div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 24, fontWeight: 900, color: '#4a9aba' }}>{ficha.nivel || 1}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[['VIDA', vidaAtual, vidaMax, '#9a3030'], ['ESFORÇO', efAtual, efMax, '#4a9aba'], ['SANIDADE', sanAtual, sanMax, '#6a3a8a']].map(([l,a,m,c]) => (
          <MiniBar key={l} label={l} atual={a} max={m} cor={c} />
        ))}
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
        <div style={{ height: '100%', width: `${pct}%`, background: cor, boxShadow: `0 0 5px ${cor}55` }} />
      </div>
      <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', width: 40, textAlign: 'right' }}>{atual}/{max}</div>
    </div>
  )
}

// ─── Visualizar ficha do jogador ─────────────────────────────
const ABAS_VER = [
  { id: 'geral', label: 'GERAL' },
  { id: 'pericias', label: 'PERÍCIAS' },
  { id: 'capacidades', label: 'CAPACIDADES' },
  { id: 'combate', label: 'COMBATE' },
  { id: 'inventario', label: 'INVENTÁRIO' },
]

function VisualizarFicha({ fichas, uid, onVoltar, abaVer, setAbaVer, liberarCampo, aprovarExclusao, rejeitarExclusao }) {
  const ficha = fichas.find(f => f.uid === uid) || {}
  const focos = ficha.focos || {}
  const [confirmando, setConfirmando] = useState(false)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
        <button onClick={onVoltar} style={{ background: 'transparent', border: '1px solid #2a3050', color: '#4a6080', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, padding: '7px 14px', borderRadius: 2, cursor: 'pointer' }}>← VOLTAR À LISTA</button>
        {ficha.solicitandoExclusao && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(154,48,48,0.08)', border: '1px solid rgba(154,48,48,0.4)', borderRadius: 2, padding: '6px 12px' }}>
            <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#c05050' }}>🗑 SOLICITOU EXCLUSÃO</span>
            <button onClick={() => setConfirmando(true)} style={{ background: 'rgba(154,48,48,0.2)', border: '1px solid #9a3030', color: '#c05050', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, padding: '3px 10px', borderRadius: 2, cursor: 'pointer' }}>APROVAR</button>
            <button onClick={rejeitarExclusao} style={{ background: 'transparent', border: '1px solid #2a3050', color: '#5a6080', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, padding: '3px 10px', borderRadius: 2, cursor: 'pointer' }}>REJEITAR</button>
          </div>
        )}
      </div>

      {confirmando && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0d0e18', border: '1px solid #9a3030', borderRadius: 2, padding: 28, maxWidth: 380, width: '100%' }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 15, color: '#c05050', letterSpacing: 2, marginBottom: 10 }}>CONFIRMAR EXCLUSÃO</div>
            <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 14, color: '#8a9ab0', marginBottom: 18 }}>Excluir permanentemente a ficha de <strong style={{ color: '#c8a96e' }}>{ficha.nome}</strong>?</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { aprovarExclusao(); setConfirmando(false) }} style={{ flex: 1, background: 'rgba(154,48,48,0.15)', border: '1px solid #9a3030', color: '#c05050', fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, padding: '9px', borderRadius: 2, cursor: 'pointer' }}>SIM, EXCLUIR</button>
              <button onClick={() => setConfirmando(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #2a3050', color: '#6a7090', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, padding: '9px', borderRadius: 2, cursor: 'pointer' }}>CANCELAR</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>
        {ficha.fotoURL && <img src={ficha.fotoURL} alt="" style={{ width: 100, aspectRatio: '3/4', objectFit: 'cover', border: '1px solid #1a1d35', borderRadius: 2 }} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 22, fontWeight: 700, color: '#c8a96e', letterSpacing: 2, marginBottom: 6 }}>{ficha.nome || 'Sem nome'}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {ficha.classe && <Tag>{ficha.classe}</Tag>}
            {ficha.trilha && <Tag cor="#4a9aba">{ficha.trilha}</Tag>}
            {(ficha.elementos || []).map(el => <Tag key={el} cor="#6a3a8a">{el}</Tag>)}
            {ficha.genese && <Tag cor="#5a7050">{ficha.genese}</Tag>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['VIDA', ficha.reservas?.vida?.atual||0, ficha.reservas?.vida?.max||1, '#9a3030'], ['ESFORÇO', ficha.reservas?.esforco?.atual||0, ficha.reservas?.esforco?.max||1, '#4a9aba'], ['SANIDADE', ficha.reservas?.sanidade?.atual||0, ficha.reservas?.sanidade?.max||1, '#6a3a8a']].map(([l,a,m,c]) => (
              <MiniBar key={l} label={l} atual={a} max={m} cor={c} />
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#3a4560', letterSpacing: 2 }}>NÍVEL</div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 36, fontWeight: 900, color: '#4a9aba', lineHeight: 1 }}>{ficha.nivel || 1}</div>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #1a1d35', marginBottom: 16, overflowX: 'auto' }}>
        {ABAS_VER.map(a => (
          <button key={a.id} onClick={() => setAbaVer(a.id)} style={{ background: 'transparent', border: 'none', borderBottom: abaVer === a.id ? '2px solid #c8a96e' : '2px solid transparent', color: abaVer === a.id ? '#c8a96e' : '#3a4560', fontFamily: 'Cormorant SC,serif', fontSize: 11, letterSpacing: 2, padding: '10px 16px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{a.label}</button>
        ))}
      </div>

      {/* Painel de controle — sempre visível quando ficha finalizada */}
      {ficha.finalizada && (
        <div style={{ marginBottom: 16, background: '#0d0e18', border: '1px solid rgba(200,169,110,0.3)', borderRadius: 2, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 3, color: '#c8a96e', textTransform: 'uppercase' }}>Controle de Edição</div>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,rgba(200,169,110,0.4),transparent)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {CAMPOS_BLOQUEAVEIS.map(({ key, label }) => {
              const liberado = ficha.camposBloqueados?.[key] === false
              return (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', background: liberado ? 'rgba(50,180,80,0.06)' : '#09090f', border: `1px solid ${liberado ? 'rgba(50,180,80,0.35)' : '#1a2535'}`, borderRadius: 2 }}>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 11, color: liberado ? '#5aaa70' : '#6a7590', letterSpacing: 1 }}>{label}</div>
                  <button
                    onClick={() => liberarCampo(key, !liberado)}
                    style={{
                      background: liberado ? 'rgba(50,180,80,0.15)' : 'rgba(200,169,110,0.08)',
                      border: `1px solid ${liberado ? 'rgba(50,180,80,0.5)' : 'rgba(200,169,110,0.35)'}`,
                      color: liberado ? '#6acc80' : '#c8a96e',
                      fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1,
                      padding: '8px 18px', borderRadius: 2, cursor: 'pointer',
                      minWidth: 120, minHeight: 36,
                      transition: 'all 0.2s'
                    }}>
                    {liberado ? '🔓 LIBERADO' : '🔒 LIBERAR'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {abaVer === 'geral' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Painel>
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
          {ficha.notas && <Painel><Titulo>História</Titulo><div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#8a9ab0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{ficha.notas}</div></Painel>}
          {ficha.anotacoesSessao && <Painel><Titulo cor="#4a9aba">Anotações de Sessão</Titulo><div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#8a9ab0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{ficha.anotacoesSessao}</div></Painel>}
        </div>
      )}

      {abaVer === 'pericias' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(PERICIAS).map(([attr, lista]) => {
            const comPontos = lista.filter(p => (ficha.pericias?.[p] || 0) > 0)
            if (comPontos.length === 0) return null
            return (
              <Painel key={attr}>
                <Titulo>{attr} — Foco {ficha.focos?.[attr] || 0}</Titulo>
                {comPontos.map(per => (
                  <div key={per} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px' }}>
                    <span style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#c8cdd8' }}>{per}</span>
                    <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 13, color: '#c8a96e', fontWeight: 'bold' }}>+{ficha.pericias[per]}</span>
                  </div>
                ))}
              </Painel>
            )
          })}
        </div>
      )}

      {abaVer === 'capacidades' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['habilidades', 'magias', 'passivas', 'poderes'].map(tipo => {
            const lista = ficha[tipo] || []
            if (!lista.length) return null
            const cores = { habilidades: '#c8a96e', magias: '#4a9aba', passivas: '#6a3a8a', poderes: '#9a3030' }
            return (
              <Painel key={tipo}>
                <Titulo cor={cores[tipo]}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</Titulo>
                {lista.map((item, i) => (
                  <div key={i} style={{ borderLeft: `2px solid ${cores[tipo]}44`, paddingLeft: 10, marginBottom: 8 }}>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: cores[tipo] }}>{item.nome}</div>
                    {item.desc && <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 14, color: '#6a7090', marginTop: 2, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{item.desc}</div>}
                  </div>
                ))}
              </Painel>
            )
          })}
        </div>
      )}

      {abaVer === 'combate' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ficha.combate && (
            <Painel>
              <Titulo>Estatísticas</Titulo>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {[['RESISTÊNCIA', ficha.combate.resistencia], ['DEFESA', ficha.combate.defesa], ['CONTRA ATAQUE', ficha.combate.contraAtaque], ['ESQUIVA', ficha.combate.esquiva], ['ARMADURA', ficha.combate.armaduraBase], ['MOVIMENTO', ficha.combate.movimento]].map(([l, v]) => (
                  <div key={l} style={{ textAlign: 'center', background: '#09090f', border: '1px solid #1a1d35', padding: '8px' }}>
                    <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 1 }}>{l}</div>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 20, fontWeight: 700, color: '#c8cdd8' }}>{v || 0}</div>
                  </div>
                ))}
              </div>
              {ficha.combate.traumas && <div style={{ marginTop: 12 }}><div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2, marginBottom: 6 }}>TRAUMAS</div><div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#9a5050', lineHeight: 1.5 }}>{ficha.combate.traumas}</div></div>}
            </Painel>
          )}
          {(ficha.armas || []).length > 0 && (
            <Painel>
              <Titulo>Arsenal</Titulo>
              {(ficha.armas || []).map((arma, i) => (
                <div key={i} style={{ border: '1px solid #1a1d35', padding: 10, borderRadius: 2, marginBottom: 8 }}>
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 14, color: '#c8cdd8', marginBottom: 8 }}>{arma.nome}</div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                    {[['Dano', arma.dano], ['Perícia', arma.pericia], ['Crítico', arma.critico], ['Munição', arma.municao], ['Espaço', arma.espaco], ['Alcance', arma.alcance]].map(([l, v]) => v && (
                      <div key={l}>
                        <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 1 }}>{l.toUpperCase()}</div>
                        <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 12, color: '#c8a96e' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {arma.tipoMunicao && arma.tipoMunicao !== 'Padrão' && (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 1 }}>MUNIÇÃO:</div>
                      <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#4a9aba', background: 'rgba(74,154,186,0.1)', border: '1px solid rgba(74,154,186,0.3)', padding: '2px 8px', borderRadius: 2 }}>
                        {arma.tipoMunicao}{arma.tipoMunicao === 'Pesada' && arma.qtdMunicaoPesada ? ` · ${arma.qtdMunicaoPesada} balas (peso ${arma.qtdMunicaoPesada})` : ''}
                      </span>
                    </div>
                  )}
                  {(arma.acessorios || []).length > 0 && (
                    <div>
                      <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 1, marginBottom: 4 }}>ACESSÓRIOS</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {(arma.acessorios || []).map(ac => (
                          <span key={ac} style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#4a9aba', background: 'rgba(74,154,186,0.08)', border: '1px solid rgba(74,154,186,0.25)', padding: '2px 8px', borderRadius: 2 }}>{ac}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Painel>
          )}
        </div>
      )}

      {abaVer === 'inventario' && (
        <Painel>
          <Titulo>Inventário</Titulo>
          {(ficha.inventario || []).length === 0 ? (
            <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#2a3050', padding: '12px 0' }}>Inventário vazio.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 45px 45px 2fr', gap: 8, marginBottom: 4 }}>
                {['ITEM','QTD','PESO','DESCRIÇÃO'].map(h => <div key={h} style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#2a3050', letterSpacing: 1 }}>{h}</div>)}
              </div>
              {(ficha.inventario || []).map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 45px 45px 2fr', gap: 8, padding: '6px 0', borderBottom: '1px solid #0f1020' }}>
                  <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#c8cdd8' }}>{item.item}</div>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 12, color: '#c8a96e', textAlign: 'center' }}>{item.qtd}</div>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 12, color: '#5a6580', textAlign: 'center' }}>{item.peso || 0}</div>
                  <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 14, color: '#6a7090', fontStyle: 'italic' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          )}
        </Painel>
      )}
    </div>
  )
}

// ─── Editor de NPC ───────────────────────────────────────────
function EditarNPC({ npc, isNovo, onVoltar, salvarNPC, excluirNPC }) {
  const [dados, setDados] = useState({ ...fichaInicial(), categoriaNPC: 'Padrão', ...npc })
  const [salvando, setSalvando] = useState(false)
  const [aba, setAba] = useState('identidade')
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)

  const set = (k, v) => setDados(p => ({ ...p, [k]: v }))
  const setNested = (obj, k, v) => setDados(p => ({ ...p, [obj]: { ...p[obj], [k]: v } }))
  const setFoco = (attr, v) => setDados(p => ({ ...p, focos: { ...p.focos, [attr]: Math.max(0, Math.min(15, v)) } }))
  const setReserva = (tipo, campo, v) => setDados(p => ({ ...p, reservas: { ...p.reservas, [tipo]: { ...p.reservas[tipo], [campo]: Number(v) } } }))
  const setPericia = (per, v) => setDados(p => ({ ...p, pericias: { ...p.pericias, [per]: Math.max(0, v) } }))
  const addCap = tipo => setDados(p => ({ ...p, [tipo]: [...(p[tipo] || []), { id: Date.now(), nome: '', desc: '' }] }))
  const remCap = (tipo, id) => setDados(p => ({ ...p, [tipo]: p[tipo].filter(x => x.id !== id) }))
  const updCap = (tipo, id, k, v) => setDados(p => ({ ...p, [tipo]: p[tipo].map(x => x.id === id ? { ...x, [k]: v } : x) }))
  const addArma = () => setDados(p => ({ ...p, armas: [...(p.armas || []), { id: Date.now(), nome: '', tipo: '', dano: '', pericia: '', critico: '', municao: '', espaco: 0, alcance: '', grauAmeaca: 1 }] }))
  const remArma = id => setDados(p => ({ ...p, armas: p.armas.filter(a => a.id !== id) }))
  const updArma = (id, k, v) => setDados(p => ({ ...p, armas: p.armas.map(a => a.id === id ? { ...a, [k]: v } : a) }))
  const addItem = () => setDados(p => ({ ...p, inventario: [...(p.inventario || []), { id: Date.now(), item: '', qtd: 1, peso: 0, desc: '' }] }))
  const remItem = id => setDados(p => ({ ...p, inventario: p.inventario.filter(i => i.id !== id) }))
  const updItem = (id, k, v) => setDados(p => ({ ...p, inventario: p.inventario.map(i => i.id === id ? { ...i, [k]: v } : i) }))

  const handleSalvar = async () => {
    setSalvando(true)
    await salvarNPC(dados)
    setSalvando(false)
  }

  const corCat = COR_CATEGORIA[dados.categoriaNPC] || '#5a6580'
  const ABAS_NPC = [
    { id: 'identidade', label: 'IDENTIDADE' },
    { id: 'atributos', label: 'ATRIBUTOS' },
    { id: 'pericias', label: 'PERÍCIAS' },
    { id: 'capacidades', label: 'CAPACIDADES' },
    { id: 'combate', label: 'COMBATE' },
    { id: 'inventario', label: 'INVENTÁRIO' },
  ]

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px 60px' }}>
      {confirmandoExclusao && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0d0e18', border: '1px solid #9a3030', borderRadius: 2, padding: 28, maxWidth: 380, width: '100%' }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 15, color: '#c05050', letterSpacing: 2, marginBottom: 10 }}>EXCLUIR NPC</div>
            <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 14, color: '#8a9ab0', marginBottom: 18 }}>Excluir permanentemente <strong style={{ color: '#c8a96e' }}>{dados.nome || 'este NPC'}</strong>?</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={excluirNPC} style={{ flex: 1, background: 'rgba(154,48,48,0.15)', border: '1px solid #9a3030', color: '#c05050', fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, padding: '9px', borderRadius: 2, cursor: 'pointer' }}>SIM, EXCLUIR</button>
              <button onClick={() => setConfirmandoExclusao(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #2a3050', color: '#6a7090', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, padding: '9px', borderRadius: 2, cursor: 'pointer' }}>CANCELAR</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a1d35', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: 'rgba(5,5,8,0.97)', backdropFilter: 'blur(8px)', zIndex: 100 }}>
        <div>
          <button onClick={onVoltar} style={{ background: 'transparent', border: 'none', color: '#6a7490', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1, cursor: 'pointer', marginBottom: 4, padding: 0 }}>← NPCs</button>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2, marginBottom: 3 }}>NPC · APENAS MESTRE</div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 18, fontWeight: 700, color: corCat, letterSpacing: 2 }}>{dados.nome || 'SEM NOME'}</div>
          <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2, color: corCat, background: `${corCat}15`, border: `1px solid ${corCat}44`, padding: '2px 8px', borderRadius: 2 }}>{dados.categoriaNPC}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!isNovo && <button onClick={() => setConfirmandoExclusao(true)} style={{ background: 'transparent', border: '1px solid #5a202055', color: '#6a3030', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, padding: '6px 12px', cursor: 'pointer', borderRadius: 2 }}>🗑 EXCLUIR</button>}
          <button onClick={handleSalvar} disabled={salvando} style={{ background: 'transparent', border: '1px solid #c8a96e55', color: salvando ? '#3a4560' : '#c8a96e', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2, padding: '6px 14px', cursor: 'pointer', borderRadius: 2 }}>
            {salvando ? '◌ SALVANDO' : '◈ SALVAR'}
          </button>
        </div>
      </div>

      {/* Abas */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1a1d35', overflowX: 'auto', position: 'sticky', top: 80, background: 'rgba(5,5,8,0.97)', zIndex: 99 }}>
        {ABAS_NPC.map(a => (
          <button key={a.id} onClick={() => setAba(a.id)} style={{ background: 'transparent', border: 'none', borderBottom: aba === a.id ? `2px solid ${corCat}` : '2px solid transparent', color: aba === a.id ? corCat : '#3a4560', fontFamily: 'Cormorant SC,serif', fontSize: 12, letterSpacing: 2, padding: '12px 18px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{a.label}</button>
        ))}
      </div>

      <div style={{ paddingTop: 20 }}>

        {/* Identidade */}
        {aba === 'identidade' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="anim">
            <Painel>
              <Titulo>Dados do NPC</Titulo>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                <Campo label="Nome"><input value={dados.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome do NPC..." style={{ fontFamily: 'Cinzel,serif', fontSize: 15 }} /></Campo>
                <Campo label="Categoria">
                  <select value={dados.categoriaNPC} onChange={e => set('categoriaNPC', e.target.value)}>
                    {CATEGORIAS_NPC.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Campo>
                <Campo label="Classe">
                  <select value={dados.classe} onChange={e => set('classe', e.target.value)}>
                    {Object.keys(CLASSES).map(c => <option key={c}>{c}</option>)}
                  </select>
                </Campo>
                <Campo label="Trilha">
                  <select value={dados.trilha} onChange={e => set('trilha', e.target.value)}>
                    <option value="">— Sem trilha —</option>
                    {CLASSES[dados.classe]?.trilhas.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Campo>
                <Campo label="Raça"><input value={dados.raca || ''} onChange={e => set('raca', e.target.value)} placeholder="—" /></Campo>
                <Campo label="Nível"><input type="number" min={1} max={300} value={dados.nivel} onChange={e => set('nivel', Number(e.target.value))} /></Campo>
              </div>
            </Painel>
            <Painel>
              <Titulo>Elementos</Titulo>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ELEMENTOS.map(el => {
                  const selecionado = (dados.elementos || []).includes(el.nome) && el.nome !== 'Nenhum'
                  return (
                    <button key={el.nome} onClick={() => {
                      if (el.bloqueado) return
                      const atual = dados.elementos || []
                      set('elementos', selecionado ? atual.filter(e => e !== el.nome) : [...atual, el.nome])
                    }} disabled={el.bloqueado}
                      style={{ background: selecionado ? 'rgba(106,58,138,0.2)' : 'transparent', border: `1px solid ${el.bloqueado ? '#5a2020' : selecionado ? '#6a3a8a' : '#2a3050'}`, color: el.bloqueado ? '#5a2020' : selecionado ? '#9a5aba' : '#5a6580', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1, padding: '6px 12px', borderRadius: 2, cursor: el.bloqueado ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                      {el.nome}
                    </button>
                  )
                })}
              </div>
            </Painel>
            <Painel>
              <Titulo>Notas do Mestre</Titulo>
              <textarea value={dados.notas} onChange={e => set('notas', e.target.value)} rows={5} placeholder="Motivações, segredos, comportamento, lore..." />
            </Painel>
          </div>
        )}

        {/* Atributos */}
        {aba === 'atributos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="anim">
            <Painel>
              <Titulo>Focos</Titulo>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(dados.focos).map(([attr, val]) => (
                  <div key={attr} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 92, fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, color: '#8a9ab0' }}>{attr.toUpperCase()}</div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => {
                        const ativo = val >= n
                        const cor = n <= 5 ? '#c8a96e' : n <= 10 ? '#4a9aba' : '#9a3030'
                        const sz = n > 10 ? 20 : n > 5 ? 24 : 28
                        return <button key={n} onClick={() => setFoco(attr, val === n ? n - 1 : n)} style={{ width: sz, height: sz, borderRadius: '50%', border: `1px solid ${ativo ? cor : '#1a2030'}`, background: ativo ? `${cor}20` : 'transparent', color: ativo ? cor : '#1a2030', fontSize: n > 5 ? 9 : 13, cursor: 'pointer', transition: 'all 0.15s' }}>{ativo ? '◆' : '◇'}</button>
                      })}
                    </div>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 20, fontWeight: 700, color: val > 0 ? '#c8a96e' : '#2a3050', minWidth: 26, textAlign: 'center' }}>{val}</div>
                  </div>
                ))}
              </div>
            </Painel>
            <Painel>
              <Titulo>Reservas</Titulo>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[{ key: 'vida', label: 'PONTOS DE VIDA', cor: '#9a3030' }, { key: 'esforco', label: 'PONTOS DE ESFORÇO', cor: '#4a9aba' }, { key: 'sanidade', label: 'SANIDADE', cor: '#6a3a8a' }].map(r => (
                  <div key={r.key}>
                    <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: r.cor, letterSpacing: 2, marginBottom: 6 }}>{r.label}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <Campo label="ATUAL"><input type="number" min={0} value={dados.reservas[r.key].atual} onChange={e => setReserva(r.key, 'atual', e.target.value)} style={{ fontFamily: 'Cinzel,serif', fontSize: 18, textAlign: 'center', color: r.cor }} /></Campo>
                      <Campo label="MÁXIMO"><input type="number" min={0} value={dados.reservas[r.key].max} onChange={e => setReserva(r.key, 'max', e.target.value)} style={{ fontFamily: 'Cinzel,serif', fontSize: 18, textAlign: 'center' }} /></Campo>
                    </div>
                  </div>
                ))}
              </div>
            </Painel>
          </div>
        )}

        {/* Perícias */}
        {aba === 'pericias' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="anim">
            {Object.entries(PERICIAS).map(([attr, lista]) => (
              <Painel key={attr}>
                <Titulo>{attr} — Foco {dados.focos[attr]}</Titulo>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {lista.map(per => {
                    const val = dados.pericias[per] || 0
                    return (
                      <div key={per} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px' }}>
                        <span style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: val > 0 ? '#c8cdd8' : '#4a5070' }}>{per}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => setPericia(per, val - 1)} style={{ background: 'transparent', border: '1px solid #1a2030', color: '#4a5070', width: 20, height: 20, borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>−</button>
                          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 13, color: val > 0 ? '#c8a96e' : '#2a3050', minWidth: 28, textAlign: 'center' }}>{val > 0 ? `+${val}` : '—'}</div>
                          <button onClick={() => setPericia(per, val + 1)} style={{ background: 'transparent', border: '1px solid #1a2030', color: '#4a5070', width: 20, height: 20, borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>+</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Painel>
            ))}
          </div>
        )}

        {/* Capacidades */}
        {aba === 'capacidades' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="anim">
            {[{ key: 'habilidades', label: 'Habilidades', cor: '#c8a96e' }, { key: 'magias', label: 'Magias', cor: '#4a9aba' }, { key: 'passivas', label: 'Passivas', cor: '#6a3a8a' }, { key: 'poderes', label: 'Poderes', cor: '#9a3030' }].map(({ key, label, cor }) => (
              <Painel key={key}>
                <Titulo cor={cor}>{label}</Titulo>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                  {(dados[key] || []).map(item => (
                    <div key={item.id} style={{ borderLeft: `2px solid ${cor}44`, paddingLeft: 12 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                        <input value={item.nome} onChange={e => updCap(key, item.id, 'nome', e.target.value)} placeholder="Nome..." style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: cor }} />
                        <BtnPerigo onClick={() => remCap(key, item.id)}>✕</BtnPerigo>
                      </div>
                      <textarea value={item.desc} onChange={e => updCap(key, item.id, 'desc', e.target.value)} rows={2} placeholder="Descrição, efeito..." style={{ fontSize: 14 }} />
                    </div>
                  ))}
                </div>
                <BtnLink onClick={() => addCap(key)} cor={cor}>+ ADICIONAR</BtnLink>
              </Painel>
            ))}
          </div>
        )}

        {/* Combate */}
        {aba === 'combate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="anim">
            <Painel>
              <Titulo>Estatísticas</Titulo>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {[['resistencia','RESISTÊNCIA'],['defesa','DEFESA'],['contraAtaque','CONTRA ATAQUE'],['esquiva','ESQUIVA'],['armaduraBase','ARMADURA BASE'],['movimento','MOVIMENTO']].map(([k,l]) => (
                  <Campo key={k} label={l}><input type="number" min={0} value={dados.combate?.[k] || 0} onChange={e => setNested('combate', k, Number(e.target.value))} style={{ fontFamily: 'Cinzel,serif', fontSize: 18, textAlign: 'center' }} /></Campo>
                ))}
              </div>
              <div style={{ marginTop: 12 }}>
                <Campo label="Traumas / Condições"><textarea value={dados.combate?.traumas || ''} rows={3} onChange={e => setNested('combate', 'traumas', e.target.value)} placeholder="Condições especiais, resistências, fraquezas..." /></Campo>
              </div>
            </Painel>
            <Painel>
              <Titulo>Arsenal</Titulo>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                {(dados.armas || []).map(arma => (
                  <div key={arma.id} style={{ border: '1px solid #1a1d35', padding: 10, borderRadius: 2 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 8, marginBottom: 8 }}>
                      <Campo label="Nome"><input value={arma.nome} onChange={e => updArma(arma.id,'nome',e.target.value)} placeholder="Nome da arma..." style={{ fontFamily: 'Cinzel,serif' }} /></Campo>
                      <Campo label="Tipo">
                        <select value={arma.tipo} onChange={e => updArma(arma.id,'tipo',e.target.value)}>
                          <option value="">—</option>
                          {TIPOS_ARMA.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </Campo>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 8 }}>
                      {[['dano','DANO'],['pericia','PERÍCIA'],['municao','MUNIÇÃO'],['alcance','ALCANCE']].map(([k,l]) => (
                        <Campo key={k} label={l}><input value={arma[k] || ''} onChange={e => updArma(arma.id,k,e.target.value)} placeholder="—" /></Campo>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 8 }}>
                      <Campo label="CRÍTICO"><input value={arma.critico || ''} onChange={e => updArma(arma.id,'critico',e.target.value)} placeholder="—" /></Campo>
                      <Campo label="ESPAÇO"><input type="number" min={0} value={arma.espaco || 0} onChange={e => updArma(arma.id,'espaco',Number(e.target.value))} /></Campo>
                      <Campo label="GRAU DE AMEAÇA">
                        <select value={arma.grauAmeaca || 1} onChange={e => updArma(arma.id,'grauAmeaca',Number(e.target.value))}>
                          <option value={1}>Ameaça 1</option>
                          <option value={2}>Ameaça 2</option>
                          <option value={3}>Ameaça 3</option>
                        </select>
                      </Campo>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <BtnPerigo onClick={() => remArma(arma.id)}>REMOVER</BtnPerigo>
                    </div>
                  </div>
                ))}
              </div>
              <BtnLink onClick={addArma}>+ ARMA</BtnLink>
            </Painel>
          </div>
        )}

        {/* Inventário */}
        {aba === 'inventario' && (
          <div className="anim">
            <Painel>
              <Titulo>Inventário</Titulo>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 45px 55px 2fr 32px', gap: 6, marginBottom: 6 }}>
                {['ITEM','QTD','PESO','DESCRIÇÃO',''].map((h,i) => <div key={i} style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#2a3050', letterSpacing: 1 }}>{h}</div>)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {(dados.inventario || []).map(item => (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 45px 55px 2fr 32px', gap: 6, alignItems: 'center' }}>
                    <input value={item.item} onChange={e => updItem(item.id,'item',e.target.value)} placeholder="Item..." />
                    <input type="number" min={0} value={item.qtd} onChange={e => updItem(item.id,'qtd',Number(e.target.value))} style={{ textAlign: 'center' }} />
                    <input type="number" min={0} value={item.peso || 0} onChange={e => updItem(item.id,'peso',Number(e.target.value))} style={{ textAlign: 'center' }} />
                    <input value={item.desc} onChange={e => updItem(item.id,'desc',e.target.value)} placeholder="Descrição..." />
                    <button onClick={() => remItem(item.id)} style={{ background: 'transparent', border: '1px solid #2a1a1a', color: '#6a2020', width: 32, height: 32, borderRadius: 2, cursor: 'pointer', fontSize: 14 }}>✕</button>
                  </div>
                ))}
              </div>
              <BtnLink onClick={addItem}>+ ITEM</BtnLink>
            </Painel>
          </div>
        )}

      </div>
    </div>
  )
}

function Splash({ texto }) {
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Share Tech Mono,monospace', fontSize: 11, letterSpacing: 3, color: '#3a4560' }}>{texto}</div>
}
