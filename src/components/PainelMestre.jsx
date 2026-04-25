// src/components/PainelMestre.jsx
import { useState } from 'react'
import { useFichasMesa } from '../hooks/useFicha'
import { PERICIAS } from '../data/sistema'
import { Painel, Titulo, Barra, Tag } from './UI'
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

export default function PainelMestre({ mesa, onVoltar }) {
  const { fichas, loading } = useFichasMesa(mesa.id)
  const [selecionada, setSelecionada] = useState(null)
  const [abaVer, setAbaVer] = useState('geral')

  const liberarCampo = async (uid, campo, liberar) => {
    const ficha = fichas.find(f => f.uid === uid)
    if (!ficha) return
    const camposBloqueados = { ...(ficha.camposBloqueados || {}) }
    if (liberar) {
      camposBloqueados[campo] = false // false = liberado pelo mestre
    } else {
      delete camposBloqueados[campo] // volta ao padrão bloqueado
    }
    await setDoc(doc(db, 'mesas', mesa.id, 'fichas', uid), { camposBloqueados }, { merge: true })
  }

  if (loading) return <Splash texto="CARREGANDO..." />

  if (selecionada) {
    const ficha = fichas.find(f => f.uid === selecionada)
    return <VisualizarFicha ficha={ficha} onVoltar={() => setSelecionada(null)} abaVer={abaVer} setAbaVer={setAbaVer} liberarCampo={(campo, liberar) => liberarCampo(selecionada, campo, liberar)} />
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2, marginBottom: 4 }}>VISÃO DO MESTRE</div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 19, fontWeight: 700, color: '#c8a96e', letterSpacing: 2 }}>{mesa.nome}</div>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', marginTop: 3 }}>CÓDIGO: {mesa.codigo}</div>
        </div>
        <button onClick={onVoltar} style={{ background: 'transparent', border: '1px solid #2a3050', color: '#4a6080', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, padding: '7px 14px', borderRadius: 2, cursor: 'pointer' }}>← VOLTAR</button>
      </div>

      {fichas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#2a3050', fontFamily: 'Crimson Text,serif', fontSize: 16 }}>
          Nenhum jogador criou ficha ainda.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {fichas.map(f => <CardFichaResumida key={f.uid} ficha={f} onClick={() => { setSelecionada(f.uid); setAbaVer('geral') }} />)}
        </div>
      )}
    </div>
  )
}

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
      style={{
        background: h ? 'rgba(200,169,110,0.03)' : 'linear-gradient(145deg,#0d0e18,#09090f)',
        border: `1px solid ${h ? '#c8a96e44' : '#1a1d35'}`,
        padding: '16px 20px', borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s'
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {ficha.fotoURL && <img src={ficha.fotoURL} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 2, border: '1px solid #1a1d35' }} />}
          <div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 16, color: h ? '#c8a96e' : '#c8cdd8', letterSpacing: 1 }}>{ficha.nome || 'Sem nome'}</div>
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

const ABAS_VER = [
  { id: 'geral', label: 'GERAL' },
  { id: 'pericias', label: 'PERÍCIAS' },
  { id: 'capacidades', label: 'CAPACIDADES' },
  { id: 'combate', label: 'COMBATE' },
  { id: 'inventario', label: 'INVENTÁRIO' },
]

function VisualizarFicha({ ficha, onVoltar, abaVer, setAbaVer, liberarCampo }) {
  const vidaAtual = ficha.reservas?.vida?.atual || 0
  const vidaMax = ficha.reservas?.vida?.max || 1
  const efAtual = ficha.reservas?.esforco?.atual || 0
  const efMax = ficha.reservas?.esforco?.max || 1
  const sanAtual = ficha.reservas?.sanidade?.atual || 0
  const sanMax = ficha.reservas?.sanidade?.max || 1
  const focos = ficha.focos || {}

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      <button onClick={onVoltar} style={{ background: 'transparent', border: '1px solid #2a3050', color: '#4a6080', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, padding: '7px 14px', borderRadius: 2, cursor: 'pointer', marginBottom: 20 }}>← VOLTAR À LISTA</button>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>
        {ficha.fotoURL && (
          <img src={ficha.fotoURL} alt="" style={{ width: 100, aspectRatio: '3/4', objectFit: 'cover', border: '1px solid #1a1d35', borderRadius: 2, clipPath: 'polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px)' }} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 22, fontWeight: 700, color: '#c8a96e', letterSpacing: 2, marginBottom: 6 }}>{ficha.nome || 'Sem nome'}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {ficha.classe && <Tag>{ficha.classe}</Tag>}
            {ficha.trilha && <Tag cor="#4a9aba">{ficha.trilha}</Tag>}
            {(ficha.elementos || []).map(el => <Tag key={el} cor="#6a3a8a">{el}</Tag>)}
            {ficha.genese && <Tag cor="#5a7050">{ficha.genese}</Tag>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['VIDA', vidaAtual, vidaMax, '#9a3030'], ['ESFORÇO', efAtual, efMax, '#4a9aba'], ['SANIDADE', sanAtual, sanMax, '#6a3a8a']].map(([l,a,m,c]) => (
              <MiniBar key={l} label={l} atual={a} max={m} cor={c} />
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 2 }}>NÍVEL</div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 36, fontWeight: 900, color: '#4a9aba', lineHeight: 1 }}>{ficha.nivel || 1}</div>
        </div>
      </div>

      {/* Abas de visualização */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1a1d35', marginBottom: 16, overflowX: 'auto' }}>
        {ABAS_VER.map(a => (
          <button key={a.id} onClick={() => setAbaVer(a.id)} style={{
            background: 'transparent', border: 'none',
            borderBottom: abaVer === a.id ? '2px solid #c8a96e' : '2px solid transparent',
            color: abaVer === a.id ? '#c8a96e' : '#3a4560',
            fontFamily: 'Cormorant SC,serif', fontSize: 11, letterSpacing: 2,
            padding: '10px 16px', cursor: 'pointer', whiteSpace: 'nowrap'
          }}>{a.label}</button>
        ))}
      </div>

      {/* Geral */}
      {abaVer === 'geral' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Controle de campos — só aparece se a ficha estiver finalizada */}
          {ficha.finalizada && (
            <Painel style={{ border: '1px solid rgba(200,169,110,0.25)' }}>
              <Titulo cor="#c8a96e">Controle de Edição do Jogador</Titulo>
              <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 14, color: '#6a7090', marginBottom: 12 }}>
                Ficha finalizada. Libere campos específicos para o jogador poder editar.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {CAMPOS_BLOQUEAVEIS.map(({ key, label }) => {
                  const liberado = ficha.camposBloqueados?.[key] === false
                  return (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', background: '#09090f', border: `1px solid ${liberado ? 'rgba(50,180,80,0.3)' : '#1a1d35'}`, borderRadius: 2 }}>
                      <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: liberado ? '#5aaa70' : '#5a6580', letterSpacing: 1 }}>{label}</div>
                      <button onClick={() => liberarCampo(key, !liberado)} style={{
                        background: liberado ? 'rgba(50,180,80,0.1)' : 'rgba(200,169,110,0.06)',
                        border: `1px solid ${liberado ? 'rgba(50,180,80,0.4)' : 'rgba(200,169,110,0.25)'}`,
                        color: liberado ? '#5aaa70' : '#c8a96e',
                        fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1,
                        padding: '5px 12px', borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s'
                      }}>
                        {liberado ? '🔓 LIBERADO' : '🔒 LIBERAR'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </Painel>
          )}
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
          {ficha.notas && (
            <Painel>
              <Titulo>Notas</Titulo>
              <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#8a9ab0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{ficha.notas}</div>
            </Painel>
          )}
        </div>
      )}

      {/* Perícias */}
      {abaVer === 'pericias' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(PERICIAS).map(([attr, lista]) => {
            const comPontos = lista.filter(p => (ficha.pericias?.[p] || 0) > 0)
            if (comPontos.length === 0) return null
            return (
              <Painel key={attr}>
                <Titulo>{attr} — Foco {ficha.focos?.[attr] || 0}</Titulo>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {comPontos.map(per => (
                    <div key={per} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px' }}>
                      <span style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#c8cdd8' }}>{per}</span>
                      <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 13, color: '#c8a96e', fontWeight: 'bold' }}>+{ficha.pericias[per]}</span>
                    </div>
                  ))}
                </div>
              </Painel>
            )
          })}
        </div>
      )}

      {/* Capacidades */}
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
                    {item.desc && <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 14, color: '#6a7090', marginTop: 2, lineHeight: 1.5 }}>{item.desc}</div>}
                  </div>
                ))}
              </Painel>
            )
          })}
        </div>
      )}

      {/* Combate */}
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
              {ficha.combate.traumas && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2, marginBottom: 6 }}>TRAUMAS</div>
                  <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#9a5050', lineHeight: 1.5 }}>{ficha.combate.traumas}</div>
                </div>
              )}
            </Painel>
          )}
          {(ficha.armas || []).length > 0 && (
            <Painel>
              <Titulo>Arsenal</Titulo>
              {(ficha.armas || []).map((arma, i) => (
                <div key={i} style={{ border: '1px solid #1a1d35', padding: 10, borderRadius: 2, marginBottom: 8 }}>
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 14, color: '#c8cdd8', marginBottom: 6 }}>{arma.nome}</div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {[['Dano', arma.dano], ['Perícia', arma.pericia], ['Crítico', arma.critico], ['Munição', arma.municao], ['Espaço', arma.espaco], ['Alcance', arma.alcance]].map(([l, v]) => v && (
                      <div key={l}>
                        <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 1 }}>{l.toUpperCase()}</div>
                        <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 12, color: '#c8a96e' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Painel>
          )}
        </div>
      )}

      {/* Inventário */}
      {abaVer === 'inventario' && (
        <Painel>
          <Titulo>Inventário</Titulo>
          {(ficha.inventario || []).length === 0 ? (
            <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#2a3050', padding: '12px 0' }}>Inventário vazio.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 45px 2fr', gap: 8, marginBottom: 4 }}>
                {['ITEM','QTD','DESCRIÇÃO'].map(h => <div key={h} style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#2a3050', letterSpacing: 1 }}>{h}</div>)}
              </div>
              {(ficha.inventario || []).map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 45px 2fr', gap: 8, padding: '6px 0', borderBottom: '1px solid #0f1020' }}>
                  <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#c8cdd8' }}>{item.item}</div>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 12, color: '#c8a96e', textAlign: 'center' }}>{item.qtd}</div>
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

function Splash({ texto }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Share Tech Mono,monospace', fontSize: 11, letterSpacing: 3, color: '#3a4560' }}>
      {texto}
    </div>
  )
}
