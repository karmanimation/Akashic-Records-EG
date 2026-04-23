// src/components/Ficha.jsx
import { useState } from 'react'
import { CLASSES, PERICIAS, GENESES, ELEMENTOS, PERSONALIDADES, TIPOS_ARMA } from '../data/sistema'
import { Painel, Titulo, Campo, Grid2, Grid3, Barra, Tag, BtnLink, BtnPerigo } from './UI'

const ABAS = [
  { id: 'identidade', label: 'IDENTIDADE' },
  { id: 'atributos', label: 'ATRIBUTOS' },
  { id: 'pericias', label: 'PERÍCIAS' },
  { id: 'capacidades', label: 'CAPACIDADES' },
  { id: 'combate', label: 'COMBATE' },
  { id: 'inventario', label: 'INVENTÁRIO' },
]

export default function Ficha({ ficha, setFicha, salvar, salvando, ultimoSalvo, onVoltar }) {
  const [aba, setAba] = useState('identidade')
  const [uploadando, setUploadando] = useState(false)

  const f = ficha
  const vidaMax = (f.focos.Vigor * 5) + (f.reservas?.vida?.bonus || 0) + 10
  const esforcoMax = (f.focos.Domínio * 3) + (f.reservas?.esforco?.bonus || 0) + 5
  const sanMax = (f.focos.Intelecto * 3) + (f.reservas?.sanidade?.bonus || 0) + 10
  const estamina = f.focos.Força + f.focos.Vigor
  const reacao = f.focos.Agilidade + f.focos.Domínio
  const statusTotal = Object.values(f.focos).reduce((a, b) => a + b, 0)

  const set = (k, v) => setFicha(p => ({ ...p, [k]: v }))
  const setNested = (obj, k, v) => setFicha(p => ({ ...p, [obj]: { ...p[obj], [k]: v } }))
  const setFoco = (attr, v) => setFicha(p => ({ ...p, focos: { ...p.focos, [attr]: Math.max(0, Math.min(5, v)) } }))
  const setReservaAtual = (tipo, v) => setFicha(p => ({ ...p, reservas: { ...p.reservas, [tipo]: { ...p.reservas[tipo], atual: v } } }))
  const setReservaBonus = (tipo, v) => setFicha(p => ({ ...p, reservas: { ...p.reservas, [tipo]: { ...p.reservas[tipo], bonus: v } } }))
  const setPericia = (per, v) => setFicha(p => ({ ...p, pericias: { ...p.pericias, [per]: Math.max(0, Math.min(10, v)) } }))

  const handleFoto = (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 1024 * 1024) {
    alert('Imagem muito grande. Use até 1MB.')
    return
  }
  setUploadando(true)
  const reader = new FileReader()
  reader.onload = (ev) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const max = 400
      let w = img.width, h = img.height
      if (w > h) { if (w > max) { h = h * max / w; w = max } }
      else { if (h > max) { w = w * max / h; h = max } }
      canvas.width = w; canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      set('fotoURL', canvas.toDataURL('image/jpeg', 0.8))
      setUploadando(false)
    }
    img.src = ev.target.result
  }
  reader.readAsDataURL(file)
}

  const addCap = tipo => setFicha(p => ({ ...p, [tipo]: [...(p[tipo] || []), { id: Date.now(), nome: '', desc: '' }] }))
  const remCap = (tipo, id) => setFicha(p => ({ ...p, [tipo]: p[tipo].filter(x => x.id !== id) }))
  const updCap = (tipo, id, k, v) => setFicha(p => ({ ...p, [tipo]: p[tipo].map(x => x.id === id ? { ...x, [k]: v } : x) }))

  const addArma = () => setFicha(p => ({ ...p, armas: [...(p.armas || []), { id: Date.now(), nome: '', tipo: '', dano: '', pericia: '', critico: '', municao: '' }] }))
  const remArma = id => setFicha(p => ({ ...p, armas: p.armas.filter(a => a.id !== id) }))
  const updArma = (id, k, v) => setFicha(p => ({ ...p, armas: p.armas.map(a => a.id === id ? { ...a, [k]: v } : a) }))

  const addItem = () => setFicha(p => ({ ...p, inventario: [...(p.inventario || []), { id: Date.now(), item: '', qtd: 1, desc: '' }] }))
  const remItem = id => setFicha(p => ({ ...p, inventario: p.inventario.filter(i => i.id !== id) }))
  const updItem = (id, k, v) => setFicha(p => ({ ...p, inventario: p.inventario.map(i => i.id === id ? { ...i, [k]: v } : i) }))

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Header fixo */}
      <div style={{
        borderBottom: '1px solid #1a1d35', padding: '16px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        position: 'sticky', top: 0, background: 'rgba(5,5,8,0.97)',
        backdropFilter: 'blur(8px)', zIndex: 100, gap: 12
      }}>
        <div>
          <button onClick={onVoltar} style={{ background: 'transparent', border: 'none', color: '#3a4560', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, cursor: 'pointer', marginBottom: 4, padding: 0 }}
            onMouseEnter={e => e.target.style.color = '#c8a96e'}
            onMouseLeave={e => e.target.style.color = '#3a4560'}
          >← MESAS</button>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#2a3050', letterSpacing: 3, marginBottom: 3 }}>AKASHIC RECORDS · ENTRE GALÁXIAS</div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 20, fontWeight: 700, color: '#c8a96e', letterSpacing: 2 }}>{f.nome || 'SEM NOME'}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
            {f.classe && <Tag>{f.classe}</Tag>}
            {f.trilha && <Tag cor="#4a9aba">{f.trilha}</Tag>}
            {f.elemento !== 'Nenhum' && f.elemento && <Tag cor="#6a3a8a">{f.elemento}</Tag>}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 2 }}>NÍVEL</div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 30, fontWeight: 900, color: '#4a9aba', lineHeight: 1 }}>{f.nivel}</div>
          </div>
          <button onClick={() => salvar(ficha)} disabled={salvando} style={{
            background: 'transparent', border: `1px solid ${salvando ? '#2a3050' : '#c8a96e55'}`,
            color: salvando ? '#3a4560' : '#c8a96e', fontFamily: 'Share Tech Mono,monospace',
            fontSize: 9, letterSpacing: 2, padding: '6px 14px', cursor: 'pointer', borderRadius: 2
          }}>{salvando ? '◌ SALVANDO' : '◈ SALVAR'}</button>
          {ultimoSalvo && <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#2a3050' }}>{ultimoSalvo.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>}
        </div>
      </div>

      {/* Abas */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1a1d35', overflowX: 'auto', position: 'sticky', top: 84, background: 'rgba(5,5,8,0.97)', backdropFilter: 'blur(8px)', zIndex: 99 }}>
        {ABAS.map(a => (
          <button key={a.id} onClick={() => setAba(a.id)} style={{
            background: 'transparent', border: 'none',
            borderBottom: aba === a.id ? '2px solid #c8a96e' : '2px solid transparent',
            color: aba === a.id ? '#c8a96e' : '#3a4560',
            fontFamily: 'Cormorant SC,serif', fontSize: 12, letterSpacing: 2,
            padding: '12px 18px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
          }}>{a.label}</button>
        ))}
      </div>

      <div style={{ paddingTop: 20 }}>

        {/* ── IDENTIDADE ── */}
        {aba === 'identidade' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="anim">
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 14 }}>
              {/* Foto */}
              <div>
                <div style={{
                  width: '100%', aspectRatio: '3/4', background: '#09090f',
                  border: '1px solid #1a1d35', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  clipPath: 'polygon(10px 0%,100% 0%,100% calc(100% - 10px),calc(100% - 10px) 100%,0% 100%,0% 10px)',
                  position: 'relative'
                }}>
                  {f.fotoURL
                    ? <img src={f.fotoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none' }} />
                    : <div style={{ textAlign: 'center', padding: 12 }}>
                        <div style={{ fontSize: 24, marginBottom: 4, opacity: 0.2 }}>◎</div>
                        <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#2a3050', letterSpacing: 1 }}>SEM FOTO</div>
                      </div>
                  }
                </div>

                <div style={{ marginTop: 8 }}>
  <input type="file" accept="image/*" onChange={handleFoto}
  style={{ display: 'none' }} id="foto-input" />
<button onClick={() => document.getElementById('foto-input').click()} style={{
  marginTop: 8, width: '100%', background: 'transparent',
  border: '1px solid #1a1d35', color: '#3a4560',
  fontFamily: 'Share Tech Mono,monospace', fontSize: 8,
  letterSpacing: 1, padding: '6px', borderRadius: 2, cursor: 'pointer',
  textAlign: 'center', transition: 'all 0.2s'
}}>
  {uploadando ? 'ENVIANDO...' : f.fotoURL ? 'ALTERAR FOTO' : '+ UPLOAD DE FOTO'}
</button>
</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Painel>
                  <Titulo>Dados Gerais</Titulo>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Campo label="Nome"><input value={f.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome do personagem..." style={{ fontFamily: 'Cinzel,serif', fontSize: 15 }} /></Campo>
                    <Grid2>
                      <Campo label="Raça"><input value={f.raca} onChange={e => set('raca', e.target.value)} placeholder="—" /></Campo>
                      <Campo label="Modificação"><input value={f.modificacao} onChange={e => set('modificacao', e.target.value)} placeholder="—" /></Campo>
                      <Campo label="Nível"><input type="number" min={1} max={300} value={f.nivel} onChange={e => set('nivel', Number(e.target.value))} /></Campo>
                      <Campo label="EXP"><input type="number" min={0} value={f.xp} onChange={e => set('xp', Number(e.target.value))} /></Campo>
                    </Grid2>
                  </div>
                </Painel>
                <Painel>
                  <Titulo>Classe & Origem</Titulo>
                  <Grid2>
                    <Campo label="Classe">
                      <select value={f.classe} onChange={e => set('classe', e.target.value)}>
                        {Object.keys(CLASSES).map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Campo>
                    <Campo label="Trilha">
                      <select value={f.trilha} onChange={e => set('trilha', e.target.value)}>
                        <option value="">— Sem trilha —</option>
                        {CLASSES[f.classe]?.trilhas.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </Campo>
                    <Campo label="Gênese">
                      <select value={f.genese} onChange={e => set('genese', e.target.value)}>
                        {GENESES.map(g => <option key={g}>{g}</option>)}
                      </select>
                    </Campo>
                    <Campo label="Personalidade">
                      <select value={f.personalidade} onChange={e => set('personalidade', e.target.value)}>
                        {PERSONALIDADES.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </Campo>
                    <Campo label="Elemento" style={{ gridColumn: 'span 2' }}>
                      <select value={f.elemento} onChange={e => set('elemento', e.target.value)}>
                        {ELEMENTOS.map(el => <option key={el}>{el}</option>)}
                      </select>
                    </Campo>
                  </Grid2>
                </Painel>
              </div>
            </div>
            <Painel>
              <Titulo>História & Anotações</Titulo>
              <textarea value={f.notas} onChange={e => set('notas', e.target.value)} rows={5} placeholder="Backstory, vínculos, segredos..." />
            </Painel>
          </div>
        )}

        {/* ── ATRIBUTOS ── */}
        {aba === 'atributos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="anim">
            <Painel>
              <Titulo>Focos</Titulo>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(f.focos).map(([attr, val]) => (
                  <div key={attr} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 95, fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: 2, color: '#8a9ab0' }}>{attr.toUpperCase()}</div>
                    <div style={{ display: 'flex', gap: 7 }}>
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => setFoco(attr, val === n ? n-1 : n)} style={{
                          width: 32, height: 32, borderRadius: '50%',
                          border: `1px solid ${val >= n ? '#c8a96e' : '#1a2030'}`,
                          background: val >= n ? 'rgba(200,169,110,0.1)' : 'transparent',
                          color: val >= n ? '#c8a96e' : '#1a2030', fontSize: 15,
                          boxShadow: val >= n ? '0 0 10px rgba(200,169,110,0.2)' : 'none',
                          cursor: 'pointer', transition: 'all 0.15s'
                        }}>{val >= n ? '◆' : '◇'}</button>
                      ))}
                    </div>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 22, fontWeight: 700, color: val > 0 ? '#c8a96e' : '#2a3050', minWidth: 28, textAlign: 'center' }}>{val}</div>
                  </div>
                ))}
                <div style={{ paddingTop: 10, borderTop: '1px solid #1a1d35', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2 }}>
                  STATUS TOTAL: <span style={{ color: '#4a9aba', fontSize: 13, fontFamily: 'Cinzel,serif' }}>{statusTotal}</span>
                </div>
              </div>
            </Painel>

            <Painel>
              <Titulo>Reservas</Titulo>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 16 }}>
                <Barra label="PONTOS DE VIDA" atual={f.reservas.vida.atual} max={vidaMax} cor="#9a3030" onChange={v => setReservaAtual('vida', v)} />
                <Barra label="PONTOS DE ESFORÇO" atual={f.reservas.esforco.atual} max={esforcoMax} cor="#4a9aba" onChange={v => setReservaAtual('esforco', v)} />
                <Barra label="SANIDADE" atual={f.reservas.sanidade.atual} max={sanMax} cor="#6a3a8a" onChange={v => setReservaAtual('sanidade', v)} />
              </div>
              <Titulo cor="#3a4560">Pontos Adicionais</Titulo>
              <Grid3>
                {[['vida','BÔNUS VIDA'],['esforco','BÔNUS ESFORÇO'],['sanidade','BÔNUS SANIDADE']].map(([k,l]) => (
                  <Campo key={k} label={l}>
                    <input type="number" min={0} value={f.reservas[k].bonus} onChange={e => setReservaBonus(k, Number(e.target.value))} />
                  </Campo>
                ))}
              </Grid3>
            </Painel>

            <Painel>
              <Titulo>Subatributos</Titulo>
              <Grid2>
                {[['ESTAMINA', estamina, 'Força + Vigor', '#c08040'], ['REAÇÃO', reacao, 'Agilidade + Domínio', '#40a060']].map(([l,v,d,c]) => (
                  <div key={l} style={{ background: '#09090f', border: '1px solid #1a1d35', padding: 16, textAlign: 'center', borderRadius: 2 }}>
                    <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2, color: c, marginBottom: 6 }}>{l}</div>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 38, fontWeight: 900, color: c, lineHeight: 1 }}>{v}</div>
                    <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#2a3050', marginTop: 5 }}>{d}</div>
                  </div>
                ))}
              </Grid2>
            </Painel>
          </div>
        )}

        {/* ── PERÍCIAS ── */}
        {aba === 'pericias' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="anim">
            {Object.entries(PERICIAS).map(([attr, lista]) => (
              <Painel key={attr}>
                <Titulo>{attr} — Foco {f.focos[attr]}</Titulo>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {lista.map(per => {
                    const val = f.pericias[per] || 0
                    return (
                      <div key={per} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', borderRadius: 2, transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,169,110,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: val > 0 ? '#c8cdd8' : '#4a5070' }}>{per}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => setPericia(per, val-1)} style={{ background: 'transparent', border: '1px solid #1a2030', color: '#4a5070', width: 20, height: 20, borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>−</button>
                          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 13, color: val > 0 ? '#c8a96e' : '#2a3050', minWidth: 28, textAlign: 'center', fontWeight: val > 0 ? 'bold' : 'normal' }}>{val > 0 ? `+${val}` : '—'}</div>
                          <button onClick={() => setPericia(per, val+1)} style={{ background: 'transparent', border: '1px solid #1a2030', color: '#4a5070', width: 20, height: 20, borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>+</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Painel>
            ))}
          </div>
        )}

        {/* ── CAPACIDADES ── */}
        {aba === 'capacidades' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="anim">
            {[
              { key: 'habilidades', label: 'Habilidades', cor: '#c8a96e' },
              { key: 'magias', label: 'Magias', cor: '#4a9aba' },
              { key: 'passivas', label: 'Passivas', cor: '#6a3a8a' },
              { key: 'poderes', label: 'Poderes', cor: '#9a3030' },
            ].map(({ key, label, cor }) => (
              <Painel key={key}>
                <Titulo cor={cor}>{label}</Titulo>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                  {(f[key] || []).map(item => (
                    <div key={item.id} style={{ borderLeft: `2px solid ${cor}44`, paddingLeft: 12 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                        <input value={item.nome} onChange={e => updCap(key, item.id, 'nome', e.target.value)} placeholder={`Nome...`} style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: cor }} />
                        <BtnPerigo onClick={() => remCap(key, item.id)}>✕</BtnPerigo>
                      </div>
                      <textarea value={item.desc} onChange={e => updCap(key, item.id, 'desc', e.target.value)} rows={2} placeholder="Descrição, efeito, custo em PE..." style={{ fontSize: 14 }} />
                    </div>
                  ))}
                </div>
                <BtnLink onClick={() => addCap(key)} cor={cor}>+ {label.slice(0,-1).toUpperCase()}</BtnLink>
              </Painel>
            ))}
          </div>
        )}

        {/* ── COMBATE ── */}
        {aba === 'combate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="anim">
            <Painel>
              <Titulo>Estatísticas</Titulo>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {[['resistencia','RESISTÊNCIA'],['defesa','DEFESA'],['contraAtaque','CONTRA ATAQUE'],['esquiva','ESQUIVA'],['armaduraBase','ARMADURA BASE'],['movimento','MOVIMENTO']].map(([k,l]) => (
                  <Campo key={k} label={l}>
                    <input type="number" min={0} value={f.combate?.[k] || 0} onChange={e => setNested('combate', k, Number(e.target.value))} style={{ fontFamily: 'Cinzel,serif', fontSize: 18, textAlign: 'center' }} />
                  </Campo>
                ))}
              </div>
              <div style={{ marginTop: 12 }}>
                <Campo label="Traumas">
                  <textarea value={f.combate?.traumas || ''} rows={3} onChange={e => setNested('combate', 'traumas', e.target.value)} placeholder="Traumas ativos, sequelas, condições..." />
                </Campo>
              </div>
            </Painel>

            <Painel>
              <Titulo>Arsenal</Titulo>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
                {(f.armas || []).map(arma => (
                  <div key={arma.id} style={{ border: '1px solid #1a1d35', padding: 12, borderRadius: 2 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 8, marginBottom: 8 }}>
                      <Campo label="Nome"><input value={arma.nome} onChange={e => updArma(arma.id,'nome',e.target.value)} placeholder="Ex: Katana Hereditária" style={{ fontFamily: 'Cinzel,serif' }} /></Campo>
                      <Campo label="Tipo">
                        <select value={arma.tipo} onChange={e => updArma(arma.id,'tipo',e.target.value)}>
                          <option value="">—</option>
                          {TIPOS_ARMA.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </Campo>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 8 }}>
                      {[['dano','DANO'],['pericia','PERÍCIA'],['critico','CRÍTICO'],['municao','MUNIÇÃO']].map(([k,l]) => (
                        <Campo key={k} label={l}><input value={arma[k]} onChange={e => updArma(arma.id,k,e.target.value)} placeholder="—" /></Campo>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <BtnPerigo onClick={() => remArma(arma.id)}>REMOVER</BtnPerigo>
                    </div>
                  </div>
                ))}
              </div>
              <BtnLink onClick={addArma}>+ ARMA</BtnLink>
            </Painel>

            <Painel>
              <Titulo>Proteção</Titulo>
              <Grid2>
                {[['colete','COLETE / ARMADURA'],['escudo','ESCUDO'],['acessorioPessoal','ACESSÓRIO PESSOAL'],['acessorioBelico','ACESSÓRIO BÉLICO']].map(([k,l]) => (
                  <Campo key={k} label={l}><input value={f.protecao?.[k] || ''} onChange={e => setNested('protecao',k,e.target.value)} placeholder="—" /></Campo>
                ))}
              </Grid2>
              <div style={{ marginTop: 12 }}>
                <Campo label="CAPACIDADE DE CARGA"><input type="number" min={0} value={f.capacidadeCarga || 0} onChange={e => set('capacidadeCarga', Number(e.target.value))} /></Campo>
              </div>
            </Painel>
          </div>
        )}

        {/* ── INVENTÁRIO ── */}
        {aba === 'inventario' && (
          <div className="anim">
            <Painel>
              <Titulo>Inventário</Titulo>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 55px 2fr 32px', gap: 6, marginBottom: 6 }}>
                {['ITEM','QTD','DESCRIÇÃO',''].map((h,i) => <div key={i} style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#2a3050', letterSpacing: 1 }}>{h}</div>)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {(f.inventario || []).map(item => (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 55px 2fr 32px', gap: 6, alignItems: 'center' }}>
                    <input value={item.item} onChange={e => updItem(item.id,'item',e.target.value)} placeholder="Item..." />
                    <input type="number" min={0} value={item.qtd} onChange={e => updItem(item.id,'qtd',Number(e.target.value))} style={{ textAlign: 'center' }} />
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
