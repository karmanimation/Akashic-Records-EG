import { useState } from 'react'
import { useResumosMesa } from '../hooks/useFicha'
import { PERICIAS, GENESES_DATA } from '../data/sistema'
import { Painel, Titulo, Tag } from './UI'

const CATEGORIAS_NPC = ['Boss', 'Principal', 'Inimigo', 'Aliado', 'Coadjuvante', 'Padrao']
const COR_CATEGORIA = { Boss: '#9a3030', Principal: '#c8a96e', Inimigo: '#8a4a20', Aliado: '#3a8a50', Coadjuvante: '#4a9aba', Padrao: '#5a6580', 'Padrão': '#5a6580' }

const ABAS_VER = [
  { id: 'geral', label: 'GERAL' },
  { id: 'pericias', label: 'PERICIAS' },
  { id: 'capacidades', label: 'CAPACIDADES' },
  { id: 'combate', label: 'COMBATE' },
  { id: 'inventario', label: 'INVENTARIO' },
  { id: 'manifestacao', label: 'MANIFESTACAO' },
]

export default function FichasPublicas({ mesa, onVoltar, voltarLabel = 'VOLTAR A FICHA' }) {
  const { resumos, loading, error } = useResumosMesa(mesa.id)
  const [abaPrincipal, setAbaPrincipal] = useState('jogadores')
  const [selecionada, setSelecionada] = useState(null)
  const [abaVer, setAbaVer] = useState('geral')

  const fichaSelecionada = resumos.find(f => f.id === selecionada?.id)

  if (loading) return <Splash texto="CARREGANDO FICHAS..." />
  if (error) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px' }}>
        <button onClick={onVoltar} style={{ ...botaoSecundario, marginBottom: 18 }}>{voltarLabel}</button>
        <Painel>
          <Titulo cor="#c05050">Fichas indisponiveis</Titulo>
          <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#8a9ab0', lineHeight: 1.6 }}>
            Nao foi possivel carregar os resumos desta mesa. Verifique se as regras do Firestore permitem leitura da colecao <span style={{ fontFamily: 'Share Tech Mono,monospace', color: '#c8a96e' }}>resumos</span> para jogadores da mesa.
          </div>
        </Painel>
      </div>
    )
  }

  if (selecionada && fichaSelecionada) {
    return (
      <VisualizarFichaPublica
        ficha={fichaSelecionada}
        tipo={selecionada.tipo}
        abaVer={abaVer}
        setAbaVer={setAbaVer}
        onVoltar={() => setSelecionada(null)}
      />
    )
  }

  const jogadores = resumos.filter(f => f.tipo === 'jogador')
  const npcs = resumos.filter(f => f.tipo === 'npc')

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          {mesa.capaURL && <img src={mesa.capaURL} alt="" style={{ width: 72, height: 72, objectFit: 'cover', border: '1px solid #1a1d35', borderRadius: 2, flexShrink: 0 }} />}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2, marginBottom: 4 }}>VISAO RESUMIDA</div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 19, fontWeight: 700, color: '#c8a96e', letterSpacing: 2 }}>{mesa.nome}</div>
            <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', marginTop: 3 }}>FICHAS DE JOGADORES E NPCs</div>
          </div>
        </div>
        <button onClick={onVoltar} style={botaoSecundario}>{voltarLabel}</button>
      </div>

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

      {abaPrincipal === 'jogadores' && (
        jogadores.length === 0 ? (
          <Vazio>Nenhum jogador criou ficha ainda.</Vazio>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {jogadores.map(f => (
              <CardFichaResumida
                key={f.id}
                ficha={f}
                onClick={() => { setSelecionada({ tipo: 'jogador', id: f.id }); setAbaVer('geral') }}
              />
            ))}
          </div>
        )
      )}

      {abaPrincipal === 'npcs' && (
        npcs.length === 0 ? (
          <Vazio>Nenhum NPC criado ainda.</Vazio>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {CATEGORIAS_NPC.map(cat => {
              const lista = npcs.filter(n => normalizarCategoria(n.categoriaNPC) === cat)
              if (lista.length === 0) return null
              const cor = COR_CATEGORIA[cat] || '#5a6580'
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 14, height: 1, background: cor, opacity: 0.6 }} />
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 3, color: cor, textTransform: 'uppercase' }}>{cat}</div>
                    <div style={{ flex: 1, height: 1, background: `linear-gradient(to right,${cor}55,transparent)` }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {lista.map(npc => (
                      <CardFichaResumida
                        key={npc.id}
                        ficha={npc}
                        cor={cor}
                        etiqueta={npc.categoriaNPC || 'NPC'}
                        onClick={() => { setSelecionada({ tipo: 'npc', id: npc.id }); setAbaVer('geral') }}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}

function VisualizarFichaPublica({ ficha, tipo, onVoltar, abaVer, setAbaVer }) {
  const focos = ficha.focos || {}
  const man = ficha.manifestacao || { ativo: false, tipo: 'vazio', nome: '', liberado: false, focos: {}, pericias: {} }
  const corMan = man.tipo === 'energia' ? '#c0d0ff' : '#8080c0'

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
        <button onClick={onVoltar} style={botaoSecundario}>VOLTAR A LISTA</button>
        <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2, color: tipo === 'npc' ? '#c8a96e' : '#4a9aba', border: `1px solid ${tipo === 'npc' ? '#c8a96e55' : '#4a9aba55'}`, padding: '5px 10px', borderRadius: 2 }}>{tipo === 'npc' ? 'NPC' : 'JOGADOR'}</span>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>
        {ficha.fotoURL && <img src={ficha.fotoURL} alt="" style={{ width: 100, aspectRatio: '3/4', objectFit: 'cover', border: '1px solid #1a1d35', borderRadius: 2 }} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 22, fontWeight: 700, color: '#c8a96e', letterSpacing: 2, marginBottom: 6 }}>{ficha.nome || 'Sem nome'}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {ficha.classe && <Tag>{ficha.classe}</Tag>}
            {ficha.trilha && <Tag cor="#4a9aba">{ficha.trilha}</Tag>}
            {(ficha.elementos || []).map(el => <Tag key={el} cor="#6a3a8a">{el}</Tag>)}
            {ficha.genese && <Tag cor="#5a7050">{ficha.genese}</Tag>}
            {tipo === 'npc' && ficha.categoriaNPC && <Tag cor={COR_CATEGORIA[ficha.categoriaNPC] || '#5a6580'}>{ficha.categoriaNPC}</Tag>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['VIDA', ficha.reservas?.vida?.atual||0, ficha.reservas?.vida?.max||1, '#9a3030'], ['ESFORCO', ficha.reservas?.esforco?.atual||0, ficha.reservas?.esforco?.max||1, '#4a9aba'], ['SANIDADE', ficha.reservas?.sanidade?.atual||0, ficha.reservas?.sanidade?.max||1, '#6a3a8a']].map(([l,a,m,c]) => (
              <MiniBar key={l} label={l} atual={a} max={m} cor={c} />
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#3a4560', letterSpacing: 2 }}>NIVEL</div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 36, fontWeight: 900, color: '#4a9aba', lineHeight: 1 }}>{ficha.nivel || 1}</div>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #1a1d35', marginBottom: 16, overflowX: 'auto' }}>
        {ABAS_VER.map(a => (
          <button key={a.id} onClick={() => setAbaVer(a.id)} style={{ background: 'transparent', border: 'none', borderBottom: abaVer === a.id ? '2px solid #c8a96e' : '2px solid transparent', color: abaVer === a.id ? '#c8a96e' : '#3a4560', fontFamily: 'Cormorant SC,serif', fontSize: 11, letterSpacing: 2, padding: '10px 16px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{a.label}</button>
        ))}
      </div>

      {abaVer === 'geral' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Painel>
            <Titulo>Focos</Titulo>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(88px,1fr))', gap: 8 }}>
              {Object.entries(focos).map(([attr, val]) => (
                <div key={attr} style={{ textAlign: 'center', background: '#09090f', border: '1px solid #1a1d35', padding: '10px 6px', borderRadius: 2 }}>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#4a5070', letterSpacing: 1, marginBottom: 4 }}>{attr.slice(0, 3).toUpperCase()}</div>
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 24, fontWeight: 900, color: val > 0 ? '#c8a96e' : '#2a3050' }}>{val}</div>
                </div>
              ))}
            </div>
          </Painel>
          {ficha.notas && <Painel><Titulo>{tipo === 'npc' ? 'Notas' : 'Historia'}</Titulo><div style={textoLongo}>{ficha.notas}</div></Painel>}
          {ficha.anotacoesSessao && <Painel><Titulo cor="#4a9aba">Anotacoes</Titulo><div style={textoLongo}>{ficha.anotacoesSessao}</div></Painel>}
        </div>
      )}

      {abaVer === 'pericias' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(PERICIAS).map(([attr, lista]) => (
            <Painel key={attr}>
              <Titulo>{attr} - Foco {ficha.focos?.[attr] || 0}</Titulo>
              {lista.map(per => {
                const val = ficha.pericias?.[per] || 0
                const bonusGenese = (GENESES_DATA[ficha.genese]?.bonusPericias || [])
                  .some(p => p.toLowerCase() === per.toLowerCase()) ? 2 : 0
                const bonusMan = man.ativo ? (man.pericias?.[per] || 0) : 0
                const total = val + bonusGenese + bonusMan
                return (
                  <div key={per} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '4px 8px', borderBottom: '1px solid #0f1020' }}>
                    <span style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: total > 0 ? '#c8cdd8' : '#4a5070' }}>{per}</span>
                    <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 13, color: total > 0 ? '#c8a96e' : '#2a3050', fontWeight: total > 0 ? 'bold' : 'normal', whiteSpace: 'nowrap' }}>
                      {total > 0 ? `+${total}` : '-'}
                      {(bonusGenese > 0 || bonusMan > 0) && <span style={{ color: '#4a5070', fontSize: 10 }}> ({val}{bonusGenese > 0 ? ` + genese ${bonusGenese}` : ''}{bonusMan > 0 ? ` + manifestacao ${bonusMan}` : ''})</span>}
                    </span>
                  </div>
                )
              })}
            </Painel>
          ))}
        </div>
      )}

      {abaVer === 'capacidades' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['habilidades', 'magias', 'passivas', 'poderes'].map(tipoCap => {
            const lista = ficha[tipoCap] || []
            const cores = { habilidades: '#c8a96e', magias: '#4a9aba', passivas: '#6a3a8a', poderes: '#9a3030' }
            return (
              <Painel key={tipoCap}>
                <Titulo cor={cores[tipoCap]}>{tipoCap.charAt(0).toUpperCase() + tipoCap.slice(1)}</Titulo>
                {lista.length === 0 ? <LinhaVazia>Nenhum registro.</LinhaVazia> : lista.map((item, i) => (
                  <div key={item.id || i} style={{ borderLeft: `2px solid ${cores[tipoCap]}44`, paddingLeft: 10, marginBottom: 8 }}>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: cores[tipoCap] }}>{item.nome || 'Sem nome'}</div>
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
          <Painel>
            <Titulo>Estatisticas</Titulo>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 8 }}>
              {[['RESISTENCIA', ficha.combate?.resistencia], ['DEFESA', ficha.combate?.defesa], ['CONTRA ATAQUE', ficha.combate?.contraAtaque], ['ESQUIVA', ficha.combate?.esquiva], ['ARMADURA', ficha.combate?.armaduraBase], ['MOVIMENTO', ficha.combate?.movimento]].map(([l, v]) => (
                <div key={l} style={{ textAlign: 'center', background: '#09090f', border: '1px solid #1a1d35', padding: '8px' }}>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 1 }}>{l}</div>
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 20, fontWeight: 700, color: '#c8cdd8' }}>{v || 0}</div>
                </div>
              ))}
            </div>
            {ficha.combate?.traumas && <div style={{ marginTop: 12 }}><div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2, marginBottom: 6 }}>TRAUMAS</div><div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#9a5050', lineHeight: 1.5 }}>{ficha.combate.traumas}</div></div>}
          </Painel>
          <Painel>
            <Titulo>Arsenal</Titulo>
            {(ficha.armas || []).length === 0 ? <LinhaVazia>Nenhuma arma registrada.</LinhaVazia> : (ficha.armas || []).map((arma, i) => (
              <div key={arma.id || i} style={{ border: '1px solid #1a1d35', padding: 10, borderRadius: 2, marginBottom: 8 }}>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 14, color: '#c8cdd8', marginBottom: 8 }}>{arma.nome || 'Sem nome'}</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                  {[['Dano', arma.dano], ['Pericia', arma.pericia], ['Critico', arma.critico], ['Municao', arma.municao], ['Espaco', arma.espaco], ['Alcance', arma.alcance]].map(([l, v]) => v && (
                    <div key={l}>
                      <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 1 }}>{l.toUpperCase()}</div>
                      <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 12, color: '#c8a96e' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Painel>
        </div>
      )}

      {abaVer === 'inventario' && (
        <Painel>
          <Titulo>Inventario</Titulo>
          {(ficha.inventario || []).length === 0 ? <LinhaVazia>Inventario vazio.</LinhaVazia> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(ficha.inventario || []).map((item, i) => (
                <div key={item.id || i} style={{ display: 'grid', gridTemplateColumns: '1fr 45px 45px 2fr', gap: 8, padding: '6px 0', borderBottom: '1px solid #0f1020' }}>
                  <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#c8cdd8' }}>{item.item || 'Item'}</div>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 12, color: '#c8a96e', textAlign: 'center' }}>{item.qtd || 1}</div>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 12, color: '#5a6580', textAlign: 'center' }}>{item.peso || 0}</div>
                  <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 14, color: '#6a7090', fontStyle: 'italic' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          )}
        </Painel>
      )}

      {abaVer === 'manifestacao' && (
        <Painel>
          <Titulo cor={corMan}>Manifestacao</Titulo>
          <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#8a9ab0', lineHeight: 1.5, marginBottom: 14 }}>
            {man.nome || 'Sem nome'} - {man.ativo ? 'ativa' : 'inativa'} - {man.tipo === 'energia' ? 'energia pura' : 'vazio'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(man.focos || {}).filter(([, v]) => v > 0).map(([attr, v]) => <BadgeValor key={attr} label={attr} valor={v} cor={corMan} />)}
            {Object.entries(man.pericias || {}).filter(([, v]) => v > 0).map(([per, v]) => <BadgeValor key={per} label={per} valor={v} cor={corMan} />)}
            {!Object.values(man.focos || {}).some(v => v > 0) && !Object.values(man.pericias || {}).some(v => v > 0) && <LinhaVazia>Nenhum bonus registrado.</LinhaVazia>}
          </div>
        </Painel>
      )}
    </div>
  )
}

function CardFichaResumida({ ficha, onClick, cor = '#c8a96e', etiqueta }) {
  const [h, setH] = useState(false)
  const vidaAtual = ficha.reservas?.vida?.atual || 0
  const vidaMax = ficha.reservas?.vida?.max || 1
  const efAtual = ficha.reservas?.esforco?.atual || 0
  const efMax = ficha.reservas?.esforco?.max || 1
  const sanAtual = ficha.reservas?.sanidade?.atual || 0
  const sanMax = ficha.reservas?.sanidade?.max || 1

  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? 'rgba(200,169,110,0.03)' : 'linear-gradient(145deg,#0d0e18,#09090f)', border: `1px solid ${h ? cor + '66' : '#1a1d35'}`, padding: '16px 20px', borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
          {ficha.fotoURL && <img src={ficha.fotoURL} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 2, border: '1px solid #1a1d35', flexShrink: 0 }} />}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 16, color: h ? cor : '#c8cdd8', letterSpacing: 1 }}>{ficha.nome || 'Sem nome'}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
              {ficha.classe && <Tag>{ficha.classe}</Tag>}
              {ficha.trilha && <Tag cor="#4a9aba">{ficha.trilha}</Tag>}
              {etiqueta && <Tag cor={cor}>{etiqueta}</Tag>}
              {(ficha.elementos || []).map(el => <Tag key={el} cor="#6a3a8a">{el}</Tag>)}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
          <button type="button" title="Visualizar ficha resumida" onClick={onClick} style={{ width: 34, height: 34, borderRadius: 2, background: h ? 'rgba(200,169,110,0.08)' : 'transparent', border: `1px solid ${h ? cor + '66' : '#2a3050'}`, color: h ? cor : '#4a6080', fontSize: 16, cursor: 'pointer' }}>◉</button>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 2 }}>NIVEL</div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 24, fontWeight: 900, color: '#4a9aba' }}>{ficha.nivel || 1}</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[['VIDA', vidaAtual, vidaMax, '#9a3030'], ['ESFORCO', efAtual, efMax, '#4a9aba'], ['SANIDADE', sanAtual, sanMax, '#6a3a8a']].map(([l,a,m,c]) => (
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
      <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: cor, width: 58, letterSpacing: 1 }}>{label}</div>
      <div style={{ flex: 1, height: 3, background: '#0d0e18', border: '1px solid #1a1d35', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: cor, boxShadow: `0 0 5px ${cor}55` }} />
      </div>
      <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', width: 44, textAlign: 'right' }}>{atual}/{max}</div>
    </div>
  )
}

function BadgeValor({ label, valor, cor }) {
  return (
    <div style={{ width: 'fit-content', background: '#09090f', border: `1px solid ${cor}44`, padding: '6px 12px', borderRadius: 2, display: 'flex', gap: 8, alignItems: 'center' }}>
      <span style={{ fontFamily: 'Crimson Text,serif', fontSize: 14, color: '#6a7090' }}>{label}</span>
      <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 13, fontWeight: 700, color: cor }}>+{valor}</span>
    </div>
  )
}

function LinhaVazia({ children }) {
  return <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#2a3050', padding: '8px 0' }}>{children}</div>
}

function Vazio({ children }) {
  return <div style={{ textAlign: 'center', padding: '60px 0', color: '#2a3050', fontFamily: 'Crimson Text,serif', fontSize: 16 }}>{children}</div>
}

function Splash({ texto }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Share Tech Mono,monospace', fontSize: 11, letterSpacing: 3, color: '#3a4560' }}>
      {texto}
    </div>
  )
}

function normalizarCategoria(categoria) {
  return categoria === 'Padrão' ? 'Padrao' : (categoria || 'Padrao')
}

const botaoSecundario = {
  background: 'transparent',
  border: '1px solid #2a3050',
  color: '#4a6080',
  fontFamily: 'Share Tech Mono,monospace',
  fontSize: 9,
  letterSpacing: 1,
  padding: '7px 14px',
  borderRadius: 2,
  cursor: 'pointer'
}

const textoLongo = {
  fontFamily: 'Crimson Text,serif',
  fontSize: 15,
  color: '#8a9ab0',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap'
}
