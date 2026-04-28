// src/components/PainelMestre.jsx
import { useState } from 'react'
import { useFichasMesa, useNPCs } from '../hooks/useFicha'
import { CLASSES, PERICIAS, GENESES, ELEMENTOS, TIPOS_ARMA, CATALOGO_ARMAS, CATALOGO_MAGIAS, CATALOGO_PODERES, ACESSORIOS_ARMA, TIPOS_MUNICAO, CARGA_POR_FORCA, CAPACIDADES_AUTOMATICAS, fichaInicial } from '../data/sistema'
import { Painel, Titulo, Tag, Campo, Grid2, BtnLink, BtnPerigo } from './UI'

const CATEGORIAS_NPC = ['Boss', 'Principal', 'Inimigo', 'Aliado', 'Coadjuvante', 'Padrão']
const COR_CATEGORIA = { Boss: '#9a3030', Principal: '#c8a96e', Inimigo: '#8a4a20', Aliado: '#3a8a50', Coadjuvante: '#4a9aba', 'Padrão': '#5a6580' }

export default function PainelMestre({ mesa, onVoltar, excluirMesa }) {
  const { fichas, loading, liberarFicha, travarFicha, excluirFicha, rejeitarExclusao } = useFichasMesa(mesa.id)
  const { npcs, salvarNPC, excluirNPC } = useNPCs(mesa.id)
  const [selecionada, setSelecionada] = useState(null)
  const [abaVer, setAbaVer] = useState('geral')
  const [abaPrincipal, setAbaPrincipal] = useState('jogadores')
  const [npcSelecionado, setNpcSelecionado] = useState(null)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(null)
  const [confirmandoMesa1, setConfirmandoMesa1] = useState(false)
  const [confirmandoMesa2, setConfirmandoMesa2] = useState(false)

  const aprovarExclusao = async (uid) => {
    if (!uid) return
    try {
      await excluirFicha(uid)
      setConfirmandoExclusao(null)
      setSelecionada(null)
    } catch (e) {
      alert('Erro ao excluir ficha: ' + e.message)
    }
  }

  const handleRejeitarExclusao = async (uid) => {
    if (!uid) return
    try {
      await rejeitarExclusao(uid)
      setConfirmandoExclusao(null)
    } catch (e) {
      alert('Erro ao rejeitar: ' + e.message)
    }
  }

  const handleExcluirMesa = async () => {
    try {
      setConfirmandoMesa2(false)
      await excluirMesa()
    } catch (e) {
      alert('Erro ao excluir mesa: ' + e.message)
    }
  }

  if (loading) return <Splash texto="CARREGANDO..." />

  // Fichas com solicitação de exclusão pendente
  const solicitacoesPendentes = fichas.filter(f => f.solicitandoExclusao)

  if (selecionada) {
    const ficha = fichas.find(f => f.uid === selecionada)
    if (!ficha) return <Splash texto="CARREGANDO..." />
    return <VisualizarFicha ficha={ficha} fichas={fichas} uid={selecionada} onVoltar={() => setSelecionada(null)} abaVer={abaVer} setAbaVer={setAbaVer} liberarFicha={() => liberarFicha(selecionada)} travarFicha={() => travarFicha(selecionada)} aprovarExclusao={() => aprovarExclusao(selecionada)} rejeitarExclusao={() => handleRejeitarExclusao(selecionada)} />
  }

  if (npcSelecionado !== null) {
    const npc = npcSelecionado === 'novo' ? fichaInicial() : npcs.find(n => n.id === npcSelecionado)
    return <EditarNPC npc={npc} isNovo={npcSelecionado === 'novo'} onVoltar={() => setNpcSelecionado(null)} salvarNPC={async (dados) => { await salvarNPC(dados); setNpcSelecionado(null) }} excluirNPC={async () => { await excluirNPC(npcSelecionado); setNpcSelecionado(null) }} />
  }
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
              <button onClick={() => handleRejeitarExclusao(confirmandoExclusao)} style={{ flex: 1, background: 'transparent', border: '1px solid #2a3050', color: '#6a7090', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1, padding: '10px', borderRadius: 2, cursor: 'pointer' }}>REJEITAR</button>
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
        <button onClick={() => setConfirmandoMesa1(true)} style={{ background: 'transparent', border: '1px solid #5a202055', color: '#6a3030', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, padding: '7px 14px', borderRadius: 2, cursor: 'pointer' }}>🗑 EXCLUIR MESA</button>
      </div>

      {/* Modal 1ª confirmação — excluir mesa */}
      {confirmandoMesa1 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0d0e18', border: '1px solid #9a3030', borderRadius: 2, padding: 32, maxWidth: 420, width: '100%' }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 16, color: '#c05050', letterSpacing: 2, marginBottom: 12 }}>EXCLUIR MESA</div>
            <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#8a9ab0', lineHeight: 1.6, marginBottom: 20 }}>
              Você está prestes a excluir a mesa <strong style={{ color: '#c8a96e' }}>{mesa.nome}</strong>.<br /><br />
              Isso irá remover <strong style={{ color: '#c05050' }}>todas as fichas e NPCs</strong> permanentemente. Esta ação é irreversível.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setConfirmandoMesa1(false); setConfirmandoMesa2(true) }} style={{ flex: 1, background: 'rgba(154,48,48,0.15)', border: '1px solid #9a3030', color: '#c05050', fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, padding: '10px', borderRadius: 2, cursor: 'pointer' }}>SIM, CONTINUAR</button>
              <button onClick={() => setConfirmandoMesa1(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #2a3050', color: '#6a7090', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, padding: '10px', borderRadius: 2, cursor: 'pointer' }}>CANCELAR</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2ª confirmação — excluir mesa */}
      {confirmandoMesa2 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0d0e18', border: '2px solid #9a3030', borderRadius: 2, padding: 32, maxWidth: 420, width: '100%' }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 16, color: '#c05050', letterSpacing: 2, marginBottom: 12 }}>CONFIRMAÇÃO FINAL</div>
            <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#c05050', lineHeight: 1.6, marginBottom: 20 }}>
              Tem <strong>absoluta certeza</strong>? A mesa <strong style={{ color: '#c8a96e' }}>{mesa.nome}</strong> e todo seu conteúdo será apagado para sempre. Não há como desfazer.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleExcluirMesa} style={{ flex: 1, background: 'rgba(154,48,48,0.25)', border: '2px solid #9a3030', color: '#ff5050', fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, padding: '12px', borderRadius: 2, cursor: 'pointer' }}>EXCLUIR PERMANENTEMENTE</button>
              <button onClick={() => setConfirmandoMesa2(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #2a3050', color: '#6a7090', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, padding: '12px', borderRadius: 2, cursor: 'pointer' }}>CANCELAR</button>
            </div>
          </div>
        </div>
      )}

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
                <button onClick={() => handleRejeitarExclusao(f.uid)} style={{ background: 'transparent', border: '1px solid #2a3050', color: '#5a6080', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, padding: '5px 12px', borderRadius: 2, cursor: 'pointer' }}>REJEITAR</button>
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
              <CardFichaResumida key={f.uid} ficha={f} onClick={() => { setConfirmandoExclusao(null); setSelecionada(f.uid); setAbaVer('geral') }} />
            ))}
          </div>
        )
      )}

      {/* Lista de NPCs */}
      {abaPrincipal === 'npcs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button onClick={() => { setConfirmandoExclusao(null); setNpcSelecionado('novo') }} style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.3)', color: '#c8a96e', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1, padding: '8px 16px', borderRadius: 2, cursor: 'pointer' }}>+ CRIAR NPC</button>
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
                    <div key={npc.id} onClick={() => { setConfirmandoExclusao(null); setNpcSelecionado(npc.id) }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(145deg,#0d0e18,#09090f)', border: `1px solid ${cor}33`, padding: '12px 16px', borderRadius: 2, cursor: 'pointer', transition: 'border-color 0.2s' }}
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

function VisualizarFicha({ fichas, uid, onVoltar, abaVer, setAbaVer, liberarFicha, travarFicha, aprovarExclusao, rejeitarExclusao }) {
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
        <div style={{ marginBottom: 16, background: '#0d0e18', border: `1px solid ${ficha.liberada ? 'rgba(50,180,80,0.4)' : 'rgba(200,169,110,0.3)'}`, borderRadius: 2, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 3, color: ficha.liberada ? '#5aaa70' : '#c8a96e', textTransform: 'uppercase', marginBottom: 4 }}>
              {ficha.liberada ? '🔓 FICHA LIBERADA PARA EDIÇÃO' : '🔒 FICHA FINALIZADA — EDIÇÃO BLOQUEADA'}
            </div>
            <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 13, color: '#5a6580' }}>
              {ficha.liberada ? 'O jogador pode editar classe, trilha, gênese, elementos, atributos, perícias e capacidades.' : 'O jogador só pode editar nome, foto, reservas, combate, arsenal e inventário.'}
            </div>
          </div>
          <button
            onClick={() => ficha.liberada ? travarFicha() : liberarFicha()}
            style={{
              background: ficha.liberada ? 'rgba(154,48,48,0.15)' : 'rgba(50,180,80,0.12)',
              border: `1px solid ${ficha.liberada ? '#9a3030' : 'rgba(50,180,80,0.5)'}`,
              color: ficha.liberada ? '#c05050' : '#5aaa70',
              fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1,
              padding: '10px 20px', borderRadius: 2, cursor: 'pointer',
              minWidth: 140, minHeight: 40, transition: 'all 0.2s'
            }}>
            {ficha.liberada ? '🔒 BLOQUEAR' : '🔓 LIBERAR TUDO'}
          </button>
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
          <Painel>
            <Titulo cor="#3a5060">Histórico de Atualizações</Titulo>
            {(ficha.historico || []).length === 0 ? (
              <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#2a3050' }}>Nenhuma atualização registrada ainda.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(ficha.historico || []).map((entrada, i) => {
                  const data = new Date(entrada.timestamp)
                  const formatado = data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
                  return (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '7px 10px', background: i === 0 ? 'rgba(74,154,186,0.05)' : 'transparent', border: `1px solid ${i === 0 ? 'rgba(74,154,186,0.2)' : '#0f1020'}`, borderRadius: 2 }}>
                      <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a5070', whiteSpace: 'nowrap', marginTop: 1, minWidth: 100 }}>{formatado}</div>
                      <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 14, color: i === 0 ? '#7a9ab0' : '#4a5570', lineHeight: 1.4 }}>{entrada.resumo}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </Painel>
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
  const [uploadando, setUploadando] = useState(false)
  const [catalogoAberto, setCatalogoAberto] = useState(null)
  const [catalogoArmaAberto, setCatalogoArmaAberto] = useState(false)
  const [categoriaArma, setCategoriaArma] = useState('Leve')

  const set = (k, v) => setDados(p => ({ ...p, [k]: v }))
  const setNested = (obj, k, v) => setDados(p => ({ ...p, [obj]: { ...p[obj], [k]: v } }))
  const setFoco = (attr, v) => setDados(p => ({ ...p, focos: { ...p.focos, [attr]: Math.max(0, Math.min(15, v)) } }))
  const setReserva = (tipo, campo, v) => setDados(p => ({ ...p, reservas: { ...p.reservas, [tipo]: { ...p.reservas[tipo], [campo]: Number(v) } } }))
  const setPericia = (per, v) => setDados(p => ({ ...p, pericias: { ...p.pericias, [per]: Math.max(0, v) } }))
  const addCap = tipo => setDados(p => ({ ...p, [tipo]: [...(p[tipo] || []), { id: Date.now(), nome: '', desc: '' }] }))
  const remCap = (tipo, id) => setDados(p => ({ ...p, [tipo]: p[tipo].filter(x => x.id !== id) }))
  const updCap = (tipo, id, k, v) => setDados(p => ({ ...p, [tipo]: p[tipo].map(x => x.id === id ? { ...x, [k]: v } : x) }))
  const addArmaManual = () => setDados(p => ({ ...p, armas: [...(p.armas || []), { id: Date.now(), nome: '', tipo: '', dano: '', pericia: '', critico: '', municao: '', espaco: 0, alcance: '', grauAmeaca: 1, tipoMunicao: 'Padrão', acessorios: [] }] }))
  const addArmaDoCatalogo = (arma) => { setDados(p => ({ ...p, armas: [...(p.armas || []), { id: Date.now(), nome: arma.nome, tipo: categoriaArma, dano: arma.dano, pericia: arma.pericia, critico: arma.critico, municao: arma.municao, espaco: arma.espaco, alcance: arma.alcance, grauAmeaca: 1, tipoMunicao: 'Padrão', acessorios: [] }] })); setCatalogoArmaAberto(false) }
  const remArma = id => setDados(p => ({ ...p, armas: p.armas.filter(a => a.id !== id) }))
  const updArma = (id, k, v) => setDados(p => ({ ...p, armas: p.armas.map(a => a.id === id ? { ...a, [k]: v } : a) }))
  const addItem = () => setDados(p => ({ ...p, inventario: [...(p.inventario || []), { id: Date.now(), item: '', qtd: 1, peso: 0, desc: '' }] }))
  const remItem = id => setDados(p => ({ ...p, inventario: p.inventario.filter(i => i.id !== id) }))
  const updItem = (id, k, v) => setDados(p => ({ ...p, inventario: p.inventario.map(i => i.id === id ? { ...i, [k]: v } : i) }))
  const addCapDoCatalogo = (tipo, item) => { setDados(p => ({ ...p, [tipo]: [...(p[tipo] || []), { id: Date.now(), nome: item.nome, desc: item.desc, doCatalogo: true }] })); setCatalogoAberto(null) }

  const handleFoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 1024 * 1024) { alert('Imagem muito grande. Use até 1MB.'); return }
    setUploadando(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const max = 400; let w = img.width, h = img.height
        if (w > h) { if (w > max) { h = h * max / w; w = max } } else { if (h > max) { w = w * max / h; h = max } }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        set('fotoURL', canvas.toDataURL('image/jpeg', 0.8))
        setUploadando(false)
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

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

      {/* Modal Catálogo de Capacidades */}
      {catalogoAberto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0d0e18', border: '1px solid #1a1d35', borderRadius: 2, width: '100%', maxWidth: 620, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #1a1d35', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: '#c8a96e', letterSpacing: 2 }}>CATÁLOGO — {catalogoAberto.tipo.toUpperCase()}</div>
              <button onClick={() => setCatalogoAberto(null)} style={{ background: 'transparent', border: 'none', color: '#5a6580', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {(catalogoAberto.tipo === 'habilidades' || catalogoAberto.tipo === 'passivas') && (
                <>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2, marginBottom: 4 }}>CLASSE: {dados.classe.toUpperCase()}</div>
                  {(CLASSES[dados.classe]?.[catalogoAberto.tipo] || []).map((item, i) => (
                    <div key={i} onClick={() => addCapDoCatalogo(catalogoAberto.tipo, item)} style={{ background: '#09090f', border: '1px solid #1a1d35', padding: '10px 12px', borderRadius: 2, cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#c8a96e44'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1d35'}>
                      <div style={{ fontFamily: 'Cinzel,serif', fontSize: 12, color: '#c8a96e', marginBottom: 4 }}>{item.nome}</div>
                      <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 13, color: '#6a7090', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{item.desc}</div>
                    </div>
                  ))}
                </>
              )}
              {catalogoAberto.tipo === 'magias' && (dados.elementos || []).map(elem => {
                const magias = CATALOGO_MAGIAS[elem]; if (!magias) return null
                return <div key={elem}><div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#4a9aba', letterSpacing: 2, margin: '10px 0 6px' }}>ELEMENTO: {elem.toUpperCase()}</div>{Object.entries(magias).map(([circ, lista]) => (<div key={circ}><div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#2a3050', margin: '6px 0 4px' }}>{circ}</div>{lista.map((item, i) => (<div key={i} onClick={() => addCapDoCatalogo('magias', item)} style={{ background: '#09090f', border: '1px solid #1a1d35', padding: '9px 12px', borderRadius: 2, cursor: 'pointer', marginBottom: 5 }} onMouseEnter={e => e.currentTarget.style.borderColor = '#4a9aba44'} onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1d35'}><div style={{ fontFamily: 'Cinzel,serif', fontSize: 12, color: '#4a9aba' }}>{item.nome}</div><div style={{ fontFamily: 'Crimson Text,serif', fontSize: 13, color: '#6a7090' }}>{item.desc}</div></div>))}</div>))}</div>
              })}
              {catalogoAberto.tipo === 'poderes' && (dados.elementos || []).map(elem => {
                const poderes = CATALOGO_PODERES[elem]; if (!poderes) return null
                return <div key={elem}><div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#9a3030', letterSpacing: 2, margin: '10px 0 6px' }}>ELEMENTO: {elem.toUpperCase()}</div>{poderes.map((item, i) => (<div key={i} onClick={() => addCapDoCatalogo('poderes', item)} style={{ background: '#09090f', border: '1px solid #1a1d35', padding: '9px 12px', borderRadius: 2, cursor: 'pointer', marginBottom: 5 }} onMouseEnter={e => e.currentTarget.style.borderColor = '#9a303044'} onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1d35'}><div style={{ fontFamily: 'Cinzel,serif', fontSize: 12, color: '#9a3030' }}>{item.nome}</div><div style={{ fontFamily: 'Crimson Text,serif', fontSize: 13, color: '#6a7090' }}>{item.desc}</div></div>))}</div>
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal Catálogo de Armas */}
      {catalogoArmaAberto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0d0e18', border: '1px solid #1a1d35', borderRadius: 2, width: '100%', maxWidth: 720, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #1a1d35', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: '#c8a96e', letterSpacing: 2 }}>CATÁLOGO DE ARMAS</div>
              <button onClick={() => setCatalogoArmaAberto(false)} style={{ background: 'transparent', border: 'none', color: '#5a6580', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #1a1d35', overflowX: 'auto' }}>
              {Object.keys(CATALOGO_ARMAS).map(cat => (
                <button key={cat} onClick={() => setCategoriaArma(cat)} style={{ background: 'transparent', border: 'none', borderBottom: categoriaArma === cat ? '2px solid #c8a96e' : '2px solid transparent', color: categoriaArma === cat ? '#c8a96e' : '#3a4560', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, padding: '10px 16px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{cat.toUpperCase()}</button>
              ))}
            </div>
            <div style={{ overflowY: 'auto', padding: 12 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: '1px solid #1a1d35' }}>{['ARMA','DANO','ESPAÇO','ALCANCE','CRÍTICO','PERÍCIA',''].map((h,i) => <th key={i} style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', padding: '6px 8px', textAlign: 'left' }}>{h}</th>)}</tr></thead>
                <tbody>{(CATALOGO_ARMAS[categoriaArma] || []).map((arma, i) => (
                  <tr key={i} onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,169,110,0.04)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} style={{ borderBottom: '1px solid #0f1020' }}>
                    <td style={{ fontFamily: 'Cinzel,serif', fontSize: 12, color: '#c8cdd8', padding: '8px' }}>{arma.nome}</td>
                    <td style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 11, color: '#9a3030', padding: '8px' }}>{arma.dano}</td>
                    <td style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 11, color: '#c8a96e', padding: '8px' }}>{arma.espaco}</td>
                    <td style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#6a7090', padding: '8px' }}>{arma.alcance}</td>
                    <td style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#6a7090', padding: '8px' }}>{arma.critico}</td>
                    <td style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#4a9aba', padding: '8px' }}>{arma.pericia}</td>
                    <td style={{ padding: '8px' }}><button onClick={() => addArmaDoCatalogo(arma)} style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.3)', color: '#c8a96e', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, padding: '4px 10px', borderRadius: 2, cursor: 'pointer' }}>+ ADD</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {confirmandoExclusao && !isNovo && (
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
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 14 }}>
              <div>
                <div style={{ width: '100%', aspectRatio: '3/4', background: '#09090f', border: '1px solid #1a1d35', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(10px 0%,100% 0%,100% calc(100% - 10px),calc(100% - 10px) 100%,0% 100%,0% 10px)' }}>
                  {dados.fotoURL ? <img src={dados.fotoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ textAlign: 'center', padding: 12 }}><div style={{ fontSize: 24, opacity: 0.2 }}>◎</div><div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#2a3050' }}>SEM FOTO</div></div>}
                </div>
                <div style={{ marginTop: 8 }}>
                  <input type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} id="npc-foto-input" />
                  <button onClick={() => document.getElementById('npc-foto-input').click()} style={{ width: '100%', background: 'transparent', border: '1px solid #1a1d35', color: '#3a4560', fontFamily: 'Share Tech Mono,monospace', fontSize: 8, letterSpacing: 1, padding: '6px', borderRadius: 2, cursor: 'pointer', textAlign: 'center' }}
                    onMouseEnter={e => { e.target.style.borderColor = `${corCat}55`; e.target.style.color = corCat }}
                    onMouseLeave={e => { e.target.style.borderColor = '#1a1d35'; e.target.style.color = '#3a4560' }}>
                    {uploadando ? 'ENVIANDO...' : dados.fotoURL ? 'ALTERAR FOTO' : '+ UPLOAD DE FOTO'}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Painel>
                  <Titulo cor={corCat}>Dados do NPC</Titulo>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Campo label="Nome"><input value={dados.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome do NPC..." style={{ fontFamily: 'Cinzel,serif', fontSize: 15 }} /></Campo>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <Campo label="Categoria">
                        <select value={dados.categoriaNPC} onChange={e => set('categoriaNPC', e.target.value)}>
                          {CATEGORIAS_NPC.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </Campo>
                      <Campo label="Nível"><input type="number" min={1} max={300} value={dados.nivel} onChange={e => set('nivel', Number(e.target.value))} /></Campo>
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
                    </div>
                  </div>
                </Painel>
              </div>
            </div>
            <Painel>
              <Titulo>Elementos</Titulo>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ELEMENTOS.map(el => {
                  const selecionado = (dados.elementos || []).includes(el.nome) && el.nome !== 'Nenhum'
                  return (
                    <button key={el.nome} onClick={() => { if (el.bloqueado) return; const atual = dados.elementos || []; set('elementos', selecionado ? atual.filter(e => e !== el.nome) : [...atual, el.nome]) }} disabled={el.bloqueado}
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
            {[{ key: 'habilidades', label: 'Habilidades', sub: 'gastam PE', cor: '#c8a96e' }, { key: 'magias', label: 'Magias', sub: 'rituais', cor: '#4a9aba' }, { key: 'passivas', label: 'Passivas', sub: 'não gastam PE', cor: '#6a3a8a' }, { key: 'poderes', label: 'Poderes', sub: 'sobrenaturais', cor: '#9a3030' }].map(({ key, label, sub, cor }) => (
              <Painel key={key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 14, height: 1, background: cor, opacity: 0.6 }} />
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 3, color: cor, textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 1 }}>· {sub}</div>
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(to right,${cor}55,transparent)` }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                  {(dados[key] || []).map(item => (
                    <div key={item.id} style={{ borderLeft: `2px solid ${cor}44`, paddingLeft: 12 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                        <input value={item.nome} onChange={e => updCap(key, item.id, 'nome', e.target.value)} placeholder="Nome..." style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: cor }} />
                        <BtnPerigo onClick={() => remCap(key, item.id)}>✕</BtnPerigo>
                      </div>
                      <textarea value={item.desc} onChange={e => !item.doCatalogo && updCap(key, item.id, 'desc', e.target.value)} disabled={item.doCatalogo} rows={2} placeholder="Descrição, efeito..." style={{ fontSize: 14, cursor: item.doCatalogo ? 'not-allowed' : undefined, opacity: item.doCatalogo ? 0.75 : 1 }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <BtnLink onClick={() => setCatalogoAberto({ tipo: key })} cor={cor}>📖 CATÁLOGO</BtnLink>
                  <BtnLink onClick={() => addCap(key)} cor={cor}>+ MANUAL</BtnLink>
                </div>
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
                <Campo label="Traumas / Condições / Resistências"><textarea value={dados.combate?.traumas || ''} rows={3} onChange={e => setNested('combate', 'traumas', e.target.value)} placeholder="Condições especiais, resistências, fraquezas, imunidades..." /></Campo>
              </div>
            </Painel>
            <Painel>
              <Titulo>Arsenal</Titulo>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
                {(dados.armas || []).map(arma => (
                  <div key={arma.id} style={{ border: '1px solid #1a1d35', padding: 12, borderRadius: 2 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 8, marginBottom: 8 }}>
                      <Campo label="Nome"><input value={arma.nome} onChange={e => updArma(arma.id,'nome',e.target.value)} placeholder="Nome da arma..." style={{ fontFamily: 'Cinzel,serif' }} /></Campo>
                      <Campo label="Tipo"><select value={arma.tipo} onChange={e => updArma(arma.id,'tipo',e.target.value)}><option value="">—</option>{TIPOS_ARMA.map(t => <option key={t}>{t}</option>)}</select></Campo>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 8 }}>
                      {[['dano','DANO'],['pericia','PERÍCIA'],['municao','MUNIÇÃO'],['alcance','ALCANCE']].map(([k,l]) => (
                        <Campo key={k} label={l}><input value={arma[k] || ''} onChange={e => updArma(arma.id,k,e.target.value)} placeholder="—" /></Campo>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 8 }}>
                      <Campo label="CRÍTICO"><input value={arma.critico || ''} onChange={e => updArma(arma.id,'critico',e.target.value)} placeholder="—" /></Campo>
                      <Campo label="ESPAÇO"><input type="number" min={0} value={arma.espaco || 0} onChange={e => updArma(arma.id,'espaco',Number(e.target.value))} /></Campo>
                      <Campo label="GRAU DE AMEAÇA"><select value={arma.grauAmeaca || 1} onChange={e => updArma(arma.id,'grauAmeaca',Number(e.target.value))}><option value={1}>Ameaça 1</option><option value={2}>Ameaça 2</option><option value={3}>Ameaça 3</option></select></Campo>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                      <Campo label="TIPO DE MUNIÇÃO"><select value={arma.tipoMunicao || 'Padrão'} onChange={e => updArma(arma.id,'tipoMunicao',e.target.value)}>{TIPOS_MUNICAO.map(m => <option key={m.nome}>{m.nome}</option>)}</select></Campo>
                      <Campo label="ACESSÓRIOS"><select onChange={e => { if (!e.target.value) return; const atual = arma.acessorios || []; if (!atual.includes(e.target.value)) updArma(arma.id,'acessorios',[...atual, e.target.value]); e.target.value = '' }}><option value="">+ Adicionar...</option>{ACESSORIOS_ARMA.map(a => <option key={a.nome} value={a.nome}>{a.nome} (peso {a.peso})</option>)}</select></Campo>
                    </div>
                    {(arma.acessorios || []).length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
                        {(arma.acessorios || []).map(ac => (<span key={ac} onClick={() => updArma(arma.id,'acessorios',(arma.acessorios||[]).filter(x=>x!==ac))} style={{ background: 'rgba(74,154,186,0.1)', border: '1px solid rgba(74,154,186,0.3)', color: '#4a9aba', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, padding: '2px 8px', borderRadius: 2, cursor: 'pointer' }}>{ac} ✕</span>))}
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <BtnPerigo onClick={() => remArma(arma.id)}>REMOVER</BtnPerigo>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <BtnLink onClick={() => setCatalogoArmaAberto(true)}>📖 CATÁLOGO</BtnLink>
                <BtnLink onClick={addArmaManual}>+ MANUAL</BtnLink>
              </div>
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
