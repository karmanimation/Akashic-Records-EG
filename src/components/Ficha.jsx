// src/components/Ficha.jsx
import { useState } from 'react'
import { CLASSES, PERICIAS, GENESES, ELEMENTOS, TIPOS_ARMA, CATALOGO_ARMAS, CATALOGO_PODERES, GRAUS_AMEACA, CARGA_POR_FORCA, fichaInicial } from '../data/sistema'
import { Painel, Titulo, Campo, Grid2, Grid3, Barra, Tag, BtnLink, BtnPerigo } from './UI'

const ABAS = [
  { id: 'identidade', label: 'IDENTIDADE' },
  { id: 'atributos', label: 'ATRIBUTOS' },
  { id: 'pericias', label: 'PERÍCIAS' },
  { id: 'capacidades', label: 'CAPACIDADES' },
  { id: 'combate', label: 'COMBATE' },
  { id: 'inventario', label: 'INVENTÁRIO' },
]

function calcularEstagio(focos) {
  const vals = Object.values(focos)
  const min = Math.min(...vals)
  if (vals.some(v => v >= 11)) return 3
  if (vals.some(v => v >= 6)) return 2
  return 1
}

function calcularCargaMax(forca) {
  return CARGA_POR_FORCA[forca] || 1
}

function calcularPesoTotal(armas) {
  return (armas || []).reduce((total, a) => total + (Number(a.espaco) || 0), 0)
}

export default function Ficha({ ficha, setFicha, salvar, salvando, ultimoSalvo, onVoltar }) {
  const [aba, setAba] = useState('identidade')
  const [uploadando, setUploadando] = useState(false)
  const [catalogoAberto, setCatalogoAberto] = useState(null) // {tipo, categoria}
  const [catalogoArmaAberto, setCatalogoArmaAberto] = useState(false)
  const [categoriaArma, setCategoriaArma] = useState('Leve')

  const f = ficha
  const estagio = calcularEstagio(f.focos)
  const cargaMax = calcularCargaMax(f.focos.Força)
  const pesoAtual = calcularPesoTotal(f.armas)
  const statusTotal = Object.values(f.focos).reduce((a, b) => a + b, 0)
  const estamina = f.focos.Força + f.focos.Vigor
  const reacao = f.focos.Agilidade + f.focos.Domínio

  // Verificar se pode aumentar um foco
  const podeAumentarFoco = (attr, val) => {
    const outros = Object.entries(f.focos).filter(([k]) => k !== attr).map(([, v]) => v)
    if (val >= 5 && outros.some(v => v < 5)) return false // todos precisam estar em 5 antes de passar para 6
    if (val >= 10 && outros.some(v => v < 10)) return false // todos precisam estar em 10 antes de passar para 11
    if (val >= 15) return false
    return true
  }

  const set = (k, v) => setFicha(p => ({ ...p, [k]: v }))
  const setNested = (obj, k, v) => setFicha(p => ({ ...p, [obj]: { ...p[obj], [k]: v } }))
  const setFoco = (attr, v) => {
    const atual = f.focos[attr]
    if (v > atual && !podeAumentarFoco(attr, atual)) return
    const novo = Math.max(0, Math.min(15, v))
    setFicha(p => ({ ...p, focos: { ...p.focos, [attr]: novo } }))
  }
  const setReserva = (tipo, campo, v) => setFicha(p => ({
    ...p, reservas: { ...p.reservas, [tipo]: { ...p.reservas[tipo], [campo]: Number(v) } }
  }))
  const setPericia = (per, v) => setFicha(p => ({ ...p, pericias: { ...p.pericias, [per]: Math.max(0, v) } }))

  const toggleElemento = (nome) => {
    const el = ELEMENTOS.find(e => e.nome === nome)
    if (el?.bloqueado) return
    const atual = f.elementos || []
    if (atual.includes(nome)) {
      setFicha(p => ({ ...p, elementos: atual.filter(e => e !== nome) }))
    } else {
      setFicha(p => ({ ...p, elementos: [...atual, nome] }))
    }
  }

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
        const max = 400
        let w = img.width, h = img.height
        if (w > h) { if (w > max) { h = h * max / w; w = max } }
        else { if (h > max) { w = w * max / h; h = max } }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        const base64 = canvas.toDataURL('image/jpeg', 0.8)
        set('fotoURL', base64)
        salvar({ ...ficha, fotoURL: base64 })
        setUploadando(false)
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  const addCap = tipo => setFicha(p => ({ ...p, [tipo]: [...(p[tipo] || []), { id: Date.now(), nome: '', desc: '' }] }))
  const remCap = (tipo, id) => setFicha(p => ({ ...p, [tipo]: p[tipo].filter(x => x.id !== id) }))
  const updCap = (tipo, id, k, v) => setFicha(p => ({ ...p, [tipo]: p[tipo].map(x => x.id === id ? { ...x, [k]: v } : x) }))

  const addArmaDosCatalogo = (arma) => {
    setFicha(p => ({
      ...p, armas: [...(p.armas || []), {
        id: Date.now(), nome: arma.nome, tipo: categoriaArma,
        dano: arma.dano, pericia: arma.pericia, critico: arma.critico,
        municao: arma.municao, espaco: arma.espaco, alcance: arma.alcance,
        grauAmeaca: 1
      }]
    }))
    setCatalogoArmaAberto(false)
  }

  const addArmaManual = () => setFicha(p => ({
    ...p, armas: [...(p.armas || []), { id: Date.now(), nome: '', tipo: '', dano: '', pericia: '', critico: '', municao: '', espaco: 0, alcance: '', grauAmeaca: 1 }]
  }))
  const remArma = id => setFicha(p => ({ ...p, armas: p.armas.filter(a => a.id !== id) }))
  const updArma = (id, k, v) => setFicha(p => ({ ...p, armas: p.armas.map(a => a.id === id ? { ...a, [k]: v } : a) }))

  const addCapDoCatalogo = (tipo, item) => {
    setFicha(p => ({ ...p, [tipo]: [...(p[tipo] || []), { id: Date.now(), nome: item.nome, desc: item.desc }] }))
    setCatalogoAberto(null)
  }

  const addItem = () => setFicha(p => ({ ...p, inventario: [...(p.inventario || []), { id: Date.now(), item: '', qtd: 1, desc: '' }] }))
  const remItem = id => setFicha(p => ({ ...p, inventario: p.inventario.filter(i => i.id !== id) }))
  const updItem = (id, k, v) => setFicha(p => ({ ...p, inventario: p.inventario.map(i => i.id === id ? { ...i, [k]: v } : i) }))

  const corEstagio = estagio === 3 ? '#9a3030' : estagio === 2 ? '#4a9aba' : '#c8a96e'

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px 60px', position: 'relative' }}>

      {/* Modal Catálogo de Capacidades */}
      {catalogoAberto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0d0e18', border: '1px solid #1a1d35', borderRadius: 2, width: '100%', maxWidth: 600, maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1a1d35', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 14, color: '#c8a96e', letterSpacing: 2 }}>CATÁLOGO — {catalogoAberto.tipo.toUpperCase()}</div>
              <button onClick={() => setCatalogoAberto(null)} style={{ background: 'transparent', border: 'none', color: '#5a6580', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Habilidades/Passivas da Classe */}
              {(catalogoAberto.tipo === 'habilidades' || catalogoAberto.tipo === 'passivas') && (
                <>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2, marginBottom: 4 }}>CLASSE: {f.classe.toUpperCase()}</div>
                  {(CLASSES[f.classe]?.[catalogoAberto.tipo] || []).map((item, i) => (
                    <div key={i} onClick={() => addCapDoCatalogo(catalogoAberto.tipo, item)} style={{ background: '#09090f', border: '1px solid #1a1d35', padding: 12, borderRadius: 2, cursor: 'pointer', transition: 'border-color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#c8a96e44'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1d35'}>
                      <div style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: '#c8a96e', marginBottom: 4 }}>{item.nome}</div>
                      <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 13, color: '#6a7090', lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  ))}
                </>
              )}
              {/* Magias/Poderes por Elemento */}
              {(catalogoAberto.tipo === 'magias' || catalogoAberto.tipo === 'poderes') && (
                <>
                  {(f.elementos || []).length === 0 && (
                    <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#3a4560', textAlign: 'center', padding: 20 }}>Nenhum elemento selecionado na aba Identidade.</div>
                  )}
                  {(f.elementos || []).map(elem => (
                    <div key={elem}>
                      <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#4a9aba', letterSpacing: 2, margin: '8px 0 4px' }}>ELEMENTO: {elem.toUpperCase()}</div>
                      {(CATALOGO_PODERES[elem] || [{ nome: elem, desc: `Poder do elemento ${elem} — a ser definido.` }]).map((item, i) => (
                        <div key={i} onClick={() => addCapDoCatalogo(catalogoAberto.tipo, item)} style={{ background: '#09090f', border: '1px solid #1a1d35', padding: 12, borderRadius: 2, cursor: 'pointer', marginBottom: 6, transition: 'border-color 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#4a9aba44'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1d35'}>
                          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: '#4a9aba', marginBottom: 4 }}>{item.nome}</div>
                          <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 13, color: '#6a7090', lineHeight: 1.5 }}>{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Catálogo de Armas */}
      {catalogoArmaAberto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0d0e18', border: '1px solid #1a1d35', borderRadius: 2, width: '100%', maxWidth: 700, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1a1d35', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 14, color: '#c8a96e', letterSpacing: 2 }}>CATÁLOGO DE ARMAS</div>
              <button onClick={() => setCatalogoArmaAberto(false)} style={{ background: 'transparent', border: 'none', color: '#5a6580', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #1a1d35', overflowX: 'auto' }}>
              {Object.keys(CATALOGO_ARMAS).map(cat => (
                <button key={cat} onClick={() => setCategoriaArma(cat)} style={{
                  background: 'transparent', border: 'none',
                  borderBottom: categoriaArma === cat ? '2px solid #c8a96e' : '2px solid transparent',
                  color: categoriaArma === cat ? '#c8a96e' : '#3a4560',
                  fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1,
                  padding: '10px 16px', cursor: 'pointer', whiteSpace: 'nowrap'
                }}>{cat.toUpperCase()}</button>
              ))}
            </div>
            <div style={{ overflowY: 'auto', padding: 12 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1a1d35' }}>
                    {['ARMA','DANO','ESPAÇO','ALCANCE','CRÍTICO','PERÍCIA',''].map((h,i) => (
                      <th key={i} style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 1, padding: '6px 8px', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(CATALOGO_ARMAS[categoriaArma] || []).map((arma, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #0f1020' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,169,110,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ fontFamily: 'Cinzel,serif', fontSize: 12, color: '#c8cdd8', padding: '8px' }}>{arma.nome}</td>
                      <td style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 11, color: '#9a3030', padding: '8px' }}>{arma.dano}</td>
                      <td style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 11, color: '#c8a96e', padding: '8px' }}>{arma.espaco}</td>
                      <td style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#6a7090', padding: '8px' }}>{arma.alcance}</td>
                      <td style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#6a7090', padding: '8px' }}>{arma.critico}</td>
                      <td style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#4a9aba', padding: '8px' }}>{arma.pericia}</td>
                      <td style={{ padding: '8px' }}>
                        <button onClick={() => addArmaDosCatalogo(arma)} style={{
                          background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.3)',
                          color: '#c8a96e', fontFamily: 'Share Tech Mono,monospace', fontSize: 9,
                          padding: '4px 10px', borderRadius: 2, cursor: 'pointer'
                        }}>+ ADD</button>
                      </td>
                    </tr>
                  ))}
                  {(CATALOGO_ARMAS[categoriaArma] || []).length === 0 && (
                    <tr><td colSpan={7} style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#2a3050', textAlign: 'center', padding: 20 }}>Sem armas cadastradas nesta categoria.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Header fixo */}
      <div style={{
        borderBottom: '1px solid #1a1d35', padding: '16px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        position: 'sticky', top: 0, background: 'rgba(5,5,8,0.97)',
        backdropFilter: 'blur(8px)', zIndex: 100, gap: 12
      }}>
        <div>
          <button onClick={onVoltar} style={{ background: 'transparent', border: 'none', color: '#6a7490', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1, cursor: 'pointer', marginBottom: 4, padding: 0 }}
            onMouseEnter={e => e.target.style.color = '#c8a96e'}
            onMouseLeave={e => e.target.style.color = '#6a7490'}>← MESAS</button>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#6a7490', letterSpacing: 3, marginBottom: 3 }}>AKASHIC RECORDS · ENTRE GALÁXIAS</div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 20, fontWeight: 700, color: '#c8a96e', letterSpacing: 2 }}>{f.nome || 'SEM NOME'}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            {f.classe && <Tag>{f.classe}</Tag>}
            {f.trilha && <Tag cor="#4a9aba">{f.trilha}</Tag>}
            {(f.elementos || []).map(el => <Tag key={el} cor="#6a3a8a">{el}</Tag>)}
            <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2, color: corEstagio, background: `${corEstagio}15`, border: `1px solid ${corEstagio}44`, padding: '2px 8px', borderRadius: 2 }}>ESTÁGIO {estagio}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#7a849a', letterSpacing: 2 }}>NÍVEL</div>
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
              <div>
                <div style={{ width: '100%', aspectRatio: '3/4', background: '#09090f', border: '1px solid #1a1d35', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(10px 0%,100% 0%,100% calc(100% - 10px),calc(100% - 10px) 100%,0% 100%,0% 10px)' }}>
                  {f.fotoURL
                    ? <img src={f.fotoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                    : <div style={{ textAlign: 'center', padding: 12 }}><div style={{ fontSize: 24, marginBottom: 4, opacity: 0.2 }}>◎</div><div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#2a3050', letterSpacing: 1 }}>SEM FOTO</div></div>
                  }
                </div>
                <div style={{ marginTop: 8 }}>
                  <input type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} id="foto-input" />
                  <button onClick={() => document.getElementById('foto-input').click()} style={{ marginTop: 0, width: '100%', background: 'transparent', border: '1px solid #1a1d35', color: '#3a4560', fontFamily: 'Share Tech Mono,monospace', fontSize: 8, letterSpacing: 1, padding: '6px', borderRadius: 2, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.target.style.borderColor = '#c8a96e55'; e.target.style.color = '#c8a96e' }}
                    onMouseLeave={e => { e.target.style.borderColor = '#1a1d35'; e.target.style.color = '#3a4560' }}>
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
                      <Campo label="Estágio">
                        <div style={{ background: 'rgba(5,5,12,0.9)', border: `1px solid ${corEstagio}44`, padding: '8px 12px', borderRadius: 2, fontFamily: 'Cinzel,serif', fontSize: 18, color: corEstagio, textAlign: 'center' }}>
                          {estagio}
                        </div>
                      </Campo>
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
                      <input value={f.personalidade || ''} onChange={e => set('personalidade', e.target.value)} placeholder="Descreva brevemente..." />
                    </Campo>
                  </Grid2>
                </Painel>
              </div>
            </div>

            {/* Elementos múltiplos */}
            <Painel>
              <Titulo>Elementos</Titulo>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ELEMENTOS.map(el => {
                  const selecionado = (f.elementos || []).includes(el.nome) && el.nome !== 'Nenhum'
                  return (
                    <button key={el.nome} onClick={() => !el.bloqueado && toggleElemento(el.nome)}
                      disabled={el.bloqueado}
                      style={{
                        background: el.bloqueado ? 'rgba(150,30,30,0.08)' : selecionado ? 'rgba(106,58,138,0.2)' : 'transparent',
                        border: `1px solid ${el.bloqueado ? '#5a2020' : selecionado ? '#6a3a8a' : '#2a3050'}`,
                        color: el.bloqueado ? '#5a2020' : selecionado ? '#9a5aba' : '#5a6580',
                        fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1,
                        padding: '6px 12px', borderRadius: 2, cursor: el.bloqueado ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        textDecoration: el.bloqueado ? 'line-through' : 'none'
                      }}>
                      {el.nome}{el.bloqueado ? ' 🔒' : ''}
                    </button>
                  )
                })}
              </div>
            </Painel>

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
              <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 1, marginBottom: 12, lineHeight: 1.6 }}>
                Estágio 1: 0–5 em todos · Estágio 2: todos em 5 para avançar um para 6 · Estágio 3: todos em 10 para avançar um para 11
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(f.focos).map(([attr, val]) => {
                  const podeAumentar = podeAumentarFoco(attr, val)
                  return (
                    <div key={attr} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 95, fontFamily: 'Cinzel,serif', fontSize: 12, letterSpacing: 2, color: '#8a9ab0' }}>{attr.toUpperCase()}</div>
                      <div style={{ display: 'flex', gap: 7 }}>
                        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => {
                          const ativo = val >= n
                          const cor = n <= 5 ? '#c8a96e' : n <= 10 ? '#4a9aba' : '#9a3030'
                          return (
                            <button key={n} onClick={() => setFoco(attr, val === n ? n - 1 : n)} style={{
                              width: n > 10 ? 22 : n > 5 ? 26 : 30,
                              height: n > 10 ? 22 : n > 5 ? 26 : 30,
                              borderRadius: '50%',
                              border: `1px solid ${ativo ? cor : '#1a2030'}`,
                              background: ativo ? `${cor}20` : 'transparent',
                              color: ativo ? cor : '#1a2030',
                              fontSize: n > 5 ? 10 : 14,
                              boxShadow: ativo ? `0 0 8px ${cor}33` : 'none',
                              cursor: 'pointer', transition: 'all 0.15s',
                              opacity: !ativo && !podeAumentar && n === val + 1 ? 0.3 : 1
                            }}>{ativo ? '◆' : '◇'}</button>
                          )
                        })}
                      </div>
                      <div style={{ fontFamily: 'Cinzel,serif', fontSize: 22, fontWeight: 700, color: val > 0 ? '#c8a96e' : '#2a3050', minWidth: 28, textAlign: 'center' }}>{val}</div>
                    </div>
                  )
                })}
                <div style={{ paddingTop: 10, borderTop: '1px solid #1a1d35', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2 }}>
                    STATUS TOTAL: <span style={{ color: '#4a9aba', fontSize: 13, fontFamily: 'Cinzel,serif' }}>{statusTotal}</span>
                  </span>
                  <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2, color: corEstagio }}>ESTÁGIO {estagio}</span>
                </div>
              </div>
            </Painel>

            <Painel>
              <Titulo>Reservas</Titulo>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { key: 'vida', label: 'PONTOS DE VIDA', cor: '#9a3030' },
                  { key: 'esforco', label: 'PONTOS DE ESFORÇO', cor: '#4a9aba' },
                  { key: 'sanidade', label: 'SANIDADE', cor: '#6a3a8a' },
                ].map(r => (
                  <div key={r.key}>
                    <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: r.cor, letterSpacing: 2, marginBottom: 8 }}>{r.label}</div>
                    <Grid2>
                      <Campo label="ATUAL">
                        <input type="number" min={0} value={f.reservas[r.key].atual}
                          onChange={e => setReserva(r.key, 'atual', e.target.value)}
                          style={{ fontFamily: 'Cinzel,serif', fontSize: 18, textAlign: 'center', color: r.cor }} />
                      </Campo>
                      <Campo label="MÁXIMO">
                        <input type="number" min={0} value={f.reservas[r.key].max}
                          onChange={e => setReserva(r.key, 'max', e.target.value)}
                          style={{ fontFamily: 'Cinzel,serif', fontSize: 18, textAlign: 'center' }} />
                      </Campo>
                    </Grid2>
                    <div style={{ marginTop: 6, height: 4, background: '#0d0e18', border: '1px solid #1a1d35', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${f.reservas[r.key].max > 0 ? Math.min(100, (f.reservas[r.key].atual / f.reservas[r.key].max) * 100) : 0}%`, background: r.cor, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </Painel>

            <Painel>
              <Titulo>Subatributos</Titulo>
              <Grid2>
                {[['ESTAMINA', estamina, 'Força + Vigor', '#c08040'], ['REAÇÃO', reacao, 'Agilidade + Domínio', '#40a060']].map(([l,v,d,c]) => (
                  <div key={l} style={{ background: '#09090f', border: '1px solid #1a1d35', padding: 16, textAlign: 'center', borderRadius: 2 }}>
                    <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2, color: c, marginBottom: 6 }}>{l}</div>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: 38, fontWeight: 900, color: c, lineHeight: 1 }}>{v}</div>
                <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#2a3050', marginTop: 5 }}>{d}</div>
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
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <span style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: val > 0 ? '#c8cdd8' : '#4a5070' }}>{per}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => setPericia(per, val - 1)} style={{ background: 'transparent', border: '1px solid #1a2030', color: '#4a5070', width: 20, height: 20, borderRadius: 2, cursor: 'pointer', fontSize: 12 }}>−</button>
                          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 13, color: val > 0 ? '#c8a96e' : '#2a3050', minWidth: 28, textAlign: 'center', fontWeight: val > 0 ? 'bold' : 'normal' }}>{val > 0 ? `+${val}` : '—'}</div>
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
                        <input value={item.nome} onChange={e => updCap(key, item.id, 'nome', e.target.value)} placeholder="Nome..." style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: cor }} />
                        <BtnPerigo onClick={() => remCap(key, item.id)}>✕</BtnPerigo>
                      </div>
                      <textarea value={item.desc} onChange={e => updCap(key, item.id, 'desc', e.target.value)} rows={2} placeholder="Descrição, efeito, custo em PE..." style={{ fontSize: 14 }} />
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 14, height: 1, background: '#c8a96e', opacity: 0.5 }} />
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 3, color: '#c8a96e', textTransform: 'uppercase' }}>Arsenal</div>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,rgba(200,169,110,0.25),transparent)', minWidth: 40 }} />
                </div>
                <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: pesoAtual > cargaMax ? '#9a3030' : '#3a4560', letterSpacing: 1 }}>
                  PESO: {pesoAtual}/{cargaMax}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
                {(f.armas || []).map(arma => (
                  <div key={arma.id} style={{ border: `1px solid ${Number(arma.espaco) + (pesoAtual - Number(arma.espaco)) > cargaMax ? '#5a2020' : '#1a1d35'}`, padding: 12, borderRadius: 2 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 8, marginBottom: 8 }}>
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
                      <Campo label="ESPAÇO (PESO)">
                        <input type="number" min={0} value={arma.espaco || 0} onChange={e => updArma(arma.id,'espaco',Number(e.target.value))} />
                      </Campo>
                      <Campo label="GRAU DE AMEAÇA">
                        <select value={arma.grauAmeaca || 1} onChange={e => updArma(arma.id,'grauAmeaca',Number(e.target.value))}>
                          <option value={1}>Ameaça 1 — Dano cheio</option>
                          <option value={2}>Ameaça 2 — Crítico 2x</option>
                          <option value={3}>Ameaça 3 — Crítico +2x</option>
                        </select>
                      </Campo>
                    </div>
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

            <Painel>
              <Titulo>Proteção</Titulo>
              <Grid2>
                {[['colete','COLETE / ARMADURA'],['escudo','ESCUDO'],['acessorioPessoal','ACESSÓRIO PESSOAL'],['acessorioBelico','ACESSÓRIO BÉLICO']].map(([k,l]) => (
                  <Campo key={k} label={l}><input value={f.protecao?.[k] || ''} onChange={e => setNested('protecao',k,e.target.value)} placeholder="—" /></Campo>
                ))}
              </Grid2>
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
