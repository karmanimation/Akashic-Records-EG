// src/components/Ficha.jsx
import { useState } from 'react'
import { CLASSES, PERICIAS, GENESES, GENESES_DATA, ELEMENTOS, TIPOS_ARMA, CATALOGO_ARMAS, CATALOGO_MAGIAS, CATALOGO_PODERES, GRAUS_AMEACA, CARGA_POR_FORCA, CAPACIDADES_AUTOMATICAS, ACESSORIOS_ARMA, TIPOS_MUNICAO } from '../data/sistema'
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
  if (vals.some(v => v >= 11)) return 3
  if (vals.some(v => v >= 6)) return 2
  return 1
}

function calcularCargaMax(forca) {
  return CARGA_POR_FORCA[forca] || 1
}

// Verifica se pode aumentar um foco
function podeAumentar(focos, attr) {
  const val = focos[attr]
  const outros = Object.entries(focos).filter(([k]) => k !== attr).map(([, v]) => v)
  if (val >= 5 && outros.some(v => v < 5)) return false
  if (val >= 10 && outros.some(v => v < 10)) return false
  if (val >= 15) return false
  return true
}

// Campo bloqueado = ficha finalizada E não liberada pelo Mestre
function isBloqueado(ficha, campo) {
  if (!ficha.finalizada) return false  // não finalizada = tudo livre
  if (ficha.liberada) return false      // Mestre liberou tudo = tudo livre
  // Campos que nunca bloqueiam mesmo finalizada
  const sempreLivres = ['nome', 'fotoURL', 'notas', 'anotacoesSessao', 'nivel', 'raca', 'modificacao', 'personalidade', 'reservas', 'combate', 'armas', 'protecao', 'inventario']
  if (sempreLivres.includes(campo)) return false
  return true
}

export default function Ficha({ ficha, setFicha, salvar, salvando, ultimoSalvo, onVoltar, solicitarExclusao, cancelarExclusao }) {
  const [aba, setAba] = useState('identidade')
  const [uploadando, setUploadando] = useState(false)
  const [catalogoAberto, setCatalogoAberto] = useState(null)
  const [catalogoArmaAberto, setCatalogoArmaAberto] = useState(false)
  const [categoriaArma, setCategoriaArma] = useState('Leve')
  const [confirmandoFinalizar, setConfirmandoFinalizar] = useState(false)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)

  const f = ficha
  const bloq = (campo) => isBloqueado(ficha, campo)
  const estagio = calcularEstagio(f.focos)
  const cargaMax = calcularCargaMax(f.focos.Força)
  const pesoArmas = (f.armas || []).reduce((t, a) => {
    const pesoBase = Number(a.espaco) || 0
    const pesoMunicao = a.tipoMunicao === 'Pesada' ? (Number(a.qtdMunicaoPesada) || 0) : 0
    const pesoAcessorios = (a.acessorios || []).reduce((s, ac) => {
      const info = ACESSORIOS_ARMA.find(x => x.nome === ac)
      return s + (info?.peso || 0)
    }, 0)
    return t + pesoBase + pesoMunicao + pesoAcessorios
  }, 0)
  const pesoInventario = (f.inventario || []).reduce((t, i) => t + (Number(i.peso) || 0) * (Number(i.qtd) || 1), 0)
  const pesoAtual = pesoArmas + pesoInventario
  const statusTotal = Object.values(f.focos).reduce((a, b) => a + b, 0)
  const estamina = f.focos.Força + f.focos.Vigor
  const reacao = f.focos.Agilidade + f.focos.Domínio
  const corEstagio = estagio === 3 ? '#9a3030' : estagio === 2 ? '#4a9aba' : '#c8a96e'

  const set = (k, v) => setFicha(p => ({ ...p, [k]: v }))
  const setNested = (obj, k, v) => setFicha(p => ({ ...p, [obj]: { ...p[obj], [k]: v } }))

  const selecionarClasse = (novaClasse) => {
    if (bloq('classe')) return
    const base = CAPACIDADES_AUTOMATICAS[novaClasse]?.base || { habilidades: [], passivas: [] }
    setFicha(p => ({
      ...p, classe: novaClasse, trilha: '',
      // Remove só automáticas de classe (não de gênese, não manuais)
      habilidades: [
        ...(p.habilidades || []).filter(h => !h.automatica || h.deGenese),
        ...base.habilidades.map(h => ({ id: Date.now() + Math.random(), nome: h.nome, desc: h.desc, automatica: true }))
      ],
      passivas: [
        ...(p.passivas || []).filter(h => !h.automatica || h.deGenese),
        ...base.passivas.map(h => ({ id: Date.now() + Math.random(), nome: h.nome, desc: h.desc, automatica: true }))
      ]
    }))
  }

  const selecionarTrilha = (novaTrilha) => {
    if (bloq('trilha')) return
    const trilhaData = CAPACIDADES_AUTOMATICAS[f.classe]?.trilhas?.[novaTrilha]
    setFicha(p => ({
      ...p, trilha: novaTrilha,
      // Remove só as deTrilha, preserva tudo mais (classe, gênese, manuais)
      passivas: [
        ...(p.passivas || []).filter(h => !h.deTrilha),
        ...(trilhaData?.nivel30 ? [{ id: Date.now() + Math.random(), nome: trilhaData.nivel30.nome, desc: trilhaData.nivel30.desc, automatica: true, deTrilha: true }] : [])
      ]
    }))
  }

  // Trocar gênese: remove capacidades antigas da gênese e adiciona as novas
  const selecionarGenese = (novaGenese) => {
    if (bloq('genese')) return
    const data = GENESES_DATA[novaGenese] || { habilidades: [], passivas: [], bonusPericias: [], descricao: '' }
    const passivaBase = data.bonusPericias?.length > 0 ? [{
      id: Date.now() + Math.random(),
      nome: `Base — ${novaGenese}`,
      desc: `${data.descricao}\n\nBônus de Perícia: +2 em ${data.bonusPericias.join(' e ')}.`,
      automatica: true,
      deGenese: true
    }] : []
    setFicha(p => ({
      ...p,
      genese: novaGenese,
      habilidades: [
        ...(p.habilidades || []).filter(h => !h.deGenese),
        ...data.habilidades.map(h => ({ id: Date.now() + Math.random(), nome: h.nome, desc: h.desc, automatica: true, deGenese: true }))
      ],
      passivas: [
        ...(p.passivas || []).filter(h => !h.deGenese),
        ...passivaBase,
        ...data.passivas.map(h => ({ id: Date.now() + Math.random(), nome: h.nome, desc: h.desc, automatica: true, deGenese: true }))
      ]
    }))
  }

  const setFoco = (attr, v) => {
    if (bloq('focos')) return
    if (v > f.focos[attr] && !podeAumentar(f.focos, attr)) return
    const novo = Math.max(0, Math.min(15, v))
    setFicha(p => ({ ...p, focos: { ...p.focos, [attr]: novo } }))
  }

  const setReserva = (tipo, campo, v) => setFicha(p => ({
    ...p, reservas: { ...p.reservas, [tipo]: { ...p.reservas[tipo], [campo]: Number(v) } }
  }))

  const setPericia = (per, v) => {
    if (bloq('pericias')) return
    setFicha(p => ({ ...p, pericias: { ...p.pericias, [per]: Math.max(0, v) } }))
  }

  const toggleElemento = (nome) => {
    if (bloq('elementos')) return
    const el = ELEMENTOS.find(e => e.nome === nome)
    if (el?.bloqueado) return
    const atual = f.elementos || []
    if (atual.includes(nome)) {
      // Só pode tirar se não finalizado
      if (f.finalizada) return
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

  const addCap = (tipo) => {
    if (bloq(tipo)) return
    setFicha(p => ({ ...p, [tipo]: [...(p[tipo] || []), { id: Date.now(), nome: '', desc: '' }] }))
  }
  const remCap = (tipo, id) => {
    const item = (ficha[tipo] || []).find(x => x.id === id)
    if (item?.automatica) return // nunca remove automáticas
    if (bloq(tipo)) return
    setFicha(p => ({ ...p, [tipo]: p[tipo].filter(x => x.id !== id) }))
  }
  const updCap = (tipo, id, k, v) => {
    const item = (ficha[tipo] || []).find(x => x.id === id)
    if (item?.automatica && k === 'nome') return
    setFicha(p => ({ ...p, [tipo]: p[tipo].map(x => x.id === id ? { ...x, [k]: v } : x) }))
  }

  const addCapDoCatalogo = (tipo, item) => {
    if (bloq(tipo)) return
    setFicha(p => ({ ...p, [tipo]: [...(p[tipo] || []), { id: Date.now(), nome: item.nome, desc: item.desc, doCatalogo: true }] }))
    setCatalogoAberto(null)
  }

  const addArmaDosCatalogo = (arma) => {
    setFicha(p => ({
      ...p, armas: [...(p.armas || []), {
        id: Date.now(), nome: arma.nome, tipo: categoriaArma,
        dano: arma.dano, pericia: arma.pericia, critico: arma.critico,
        municao: arma.municao, espaco: arma.espaco, alcance: arma.alcance,
        grauAmeaca: 1, tipoMunicao: 'Padrão', acessorios: []
      }]
    }))
    setCatalogoArmaAberto(false)
  }
  const addArmaManual = () => setFicha(p => ({
    ...p, armas: [...(p.armas || []), { id: Date.now(), nome: '', tipo: '', dano: '', pericia: '', critico: '', municao: '', espaco: 0, alcance: '', grauAmeaca: 1, tipoMunicao: 'Padrão', acessorios: [] }]
  }))
  const remArma = id => setFicha(p => ({ ...p, armas: p.armas.filter(a => a.id !== id) }))
  const updArma = (id, k, v) => setFicha(p => ({ ...p, armas: p.armas.map(a => a.id === id ? { ...a, [k]: v } : a) }))

  const addItem = () => setFicha(p => ({ ...p, inventario: [...(p.inventario || []), { id: Date.now(), item: '', qtd: 1, peso: 0, desc: '' }] }))
  const remItem = id => setFicha(p => ({ ...p, inventario: p.inventario.filter(i => i.id !== id) }))
  const updItem = (id, k, v) => setFicha(p => ({ ...p, inventario: p.inventario.map(i => i.id === id ? { ...i, [k]: v } : i) }))

  const finalizarFicha = async () => {
    const fichaFinalizada = { ...ficha, finalizada: true }
    setFicha(fichaFinalizada)
    await salvar(fichaFinalizada)
    setConfirmandoFinalizar(false)
  }

  // Estilo visual de campo bloqueado
  const inputStyle = (campo) => bloq(campo) ? {
    opacity: 0.6, cursor: 'not-allowed', background: 'rgba(5,5,12,0.5)'
  } : {}

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px 60px', position: 'relative' }}>

      {/* Modal confirmação finalizar */}
      {confirmandoFinalizar && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0d0e18', border: '1px solid #9a3030', borderRadius: 2, padding: 32, maxWidth: 420, width: '100%' }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 16, color: '#c8a96e', letterSpacing: 2, marginBottom: 12 }}>FINALIZAR FICHA</div>
            <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#8a9ab0', lineHeight: 1.6, marginBottom: 20 }}>
              Após finalizar, você <strong style={{ color: '#c8a96e' }}>não poderá modificar</strong> as escolhas de classe, trilha, gênese, elementos, atributos, perícias e capacidades sem a permissão do Mestre.<br /><br />
              Tem certeza que a ficha está completa?
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={finalizarFicha} style={{ flex: 1, background: 'rgba(154,48,48,0.15)', border: '1px solid #9a3030', color: '#c05050', fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, padding: '10px', borderRadius: 2, cursor: 'pointer' }}>
                SIM, FINALIZAR
              </button>
              <button onClick={() => setConfirmandoFinalizar(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #2a3050', color: '#6a7090', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1, padding: '10px', borderRadius: 2, cursor: 'pointer' }}>
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmação exclusão */}
      {confirmandoExclusao && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0d0e18', border: '1px solid #9a3030', borderRadius: 2, padding: 32, maxWidth: 420, width: '100%' }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 16, color: '#c05050', letterSpacing: 2, marginBottom: 12 }}>SOLICITAR EXCLUSÃO</div>
            {ficha.solicitandoExclusao ? (
              <>
                <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#8a9ab0', lineHeight: 1.6, marginBottom: 20 }}>
                  Sua solicitação de exclusão foi enviada ao Mestre. Aguarde a aprovação.<br /><br />
                  Deseja cancelar a solicitação?
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={async () => { await cancelarExclusao(); setConfirmandoExclusao(false) }} style={{ flex: 1, background: 'transparent', border: '1px solid #c8a96e55', color: '#c8a96e', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1, padding: '10px', borderRadius: 2, cursor: 'pointer' }}>CANCELAR SOLICITAÇÃO</button>
                  <button onClick={() => setConfirmandoExclusao(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #2a3050', color: '#6a7090', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1, padding: '10px', borderRadius: 2, cursor: 'pointer' }}>FECHAR</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 15, color: '#8a9ab0', lineHeight: 1.6, marginBottom: 20 }}>
                  Isso enviará uma <strong style={{ color: '#c05050' }}>solicitação de exclusão</strong> ao Mestre. Sua ficha só será removida após a aprovação dele.<br /><br />
                  Tem certeza?
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={async () => { await solicitarExclusao(); setConfirmandoExclusao(false) }} style={{ flex: 1, background: 'rgba(154,48,48,0.15)', border: '1px solid #9a3030', color: '#c05050', fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, padding: '10px', borderRadius: 2, cursor: 'pointer' }}>SIM, SOLICITAR</button>
                  <button onClick={() => setConfirmandoExclusao(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #2a3050', color: '#6a7090', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1, padding: '10px', borderRadius: 2, cursor: 'pointer' }}>CANCELAR</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {catalogoAberto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0d0e18', border: '1px solid #1a1d35', borderRadius: 2, width: '100%', maxWidth: 620, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #1a1d35', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: '#c8a96e', letterSpacing: 2 }}>
                CATÁLOGO — {catalogoAberto.tipo.toUpperCase()}
                {catalogoAberto.tipo === 'habilidades' && <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#4a5070', marginLeft: 8 }}>(gastam PE)</span>}
                {catalogoAberto.tipo === 'passivas' && <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#4a5070', marginLeft: 8 }}>(não gastam PE)</span>}
              </div>
              <button onClick={() => setCatalogoAberto(null)} style={{ background: 'transparent', border: 'none', color: '#5a6580', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {/* Habilidades/Passivas da Classe */}
              {(catalogoAberto.tipo === 'habilidades' || catalogoAberto.tipo === 'passivas') && (
                <>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2, marginBottom: 4 }}>CLASSE: {f.classe.toUpperCase()}</div>
                  {(CLASSES[f.classe]?.[catalogoAberto.tipo] || []).map((item, i) => (
                    <div key={i} onClick={() => !bloq(catalogoAberto.tipo) && addCapDoCatalogo(catalogoAberto.tipo, item)}
                      style={{ background: '#09090f', border: '1px solid #1a1d35', padding: '10px 12px', borderRadius: 2, cursor: bloq(catalogoAberto.tipo) ? 'not-allowed' : 'pointer', transition: 'border-color 0.15s' }}
                      onMouseEnter={e => !bloq(catalogoAberto.tipo) && (e.currentTarget.style.borderColor = '#c8a96e44')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a1d35')}>
                      <div style={{ fontFamily: 'Cinzel,serif', fontSize: 12, color: '#c8a96e', marginBottom: 4 }}>{item.nome}</div>
                      <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 13, color: '#6a7090', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{item.desc}</div>
                    </div>
                  ))}
                </>
              )}
              {/* Magias por Elemento */}
              {catalogoAberto.tipo === 'magias' && (
                <>
                  {(f.elementos || []).length === 0 && (
                    <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#3a4560', textAlign: 'center', padding: 20 }}>Nenhum elemento selecionado na aba Identidade.</div>
                  )}
                  {(f.elementos || []).map(elem => {
                    const magiasPorCirculo = CATALOGO_MAGIAS[elem]
                    if (!magiasPorCirculo) return null
                    return (
                      <div key={elem}>
                        <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#4a9aba', letterSpacing: 2, margin: '10px 0 6px' }}>ELEMENTO: {elem.toUpperCase()}</div>
                        {Object.entries(magiasPorCirculo).map(([circulo, lista]) => (
                          <div key={circulo}>
                            <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#2a3050', letterSpacing: 1, margin: '6px 0 4px' }}>{circulo}</div>
                            {lista.map((item, i) => (
                              <div key={i} onClick={() => !bloq('magias') && addCapDoCatalogo('magias', item)}
                                style={{ background: '#09090f', border: '1px solid #1a1d35', padding: '9px 12px', borderRadius: 2, cursor: bloq('magias') ? 'not-allowed' : 'pointer', marginBottom: 5, transition: 'border-color 0.15s' }}
                                onMouseEnter={e => !bloq('magias') && (e.currentTarget.style.borderColor = '#4a9aba44')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a1d35')}>
                                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 12, color: '#4a9aba', marginBottom: 3 }}>{item.nome}</div>
                                <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 13, color: '#6a7090', lineHeight: 1.4 }}>{item.desc}</div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </>
              )}
              {/* Poderes por Elemento */}
              {catalogoAberto.tipo === 'poderes' && (
                <>
                  {(f.elementos || []).length === 0 && (
                    <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#3a4560', textAlign: 'center', padding: 20 }}>Nenhum elemento selecionado na aba Identidade.</div>
                  )}
                  {(f.elementos || []).map(elem => {
                    const poderes = CATALOGO_PODERES[elem]
                    if (!poderes) return null
                    return (
                      <div key={elem}>
                        <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#9a3030', letterSpacing: 2, margin: '10px 0 6px' }}>ELEMENTO: {elem.toUpperCase()}</div>
                        {poderes.map((item, i) => (
                          <div key={i} onClick={() => !bloq('poderes') && addCapDoCatalogo('poderes', item)}
                            style={{ background: '#09090f', border: '1px solid #1a1d35', padding: '9px 12px', borderRadius: 2, cursor: bloq('poderes') ? 'not-allowed' : 'pointer', marginBottom: 5, transition: 'border-color 0.15s' }}
                            onMouseEnter={e => !bloq('poderes') && (e.currentTarget.style.borderColor = '#9a303044')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a1d35')}>
                            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 12, color: '#9a3030', marginBottom: 3 }}>{item.nome}</div>
                            <div style={{ fontFamily: 'Crimson Text,serif', fontSize: 13, color: '#6a7090', lineHeight: 1.4 }}>{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </>
              )}
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
                    <tr key={i} onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,169,110,0.04)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} style={{ borderBottom: '1px solid #0f1020' }}>
                      <td style={{ fontFamily: 'Cinzel,serif', fontSize: 12, color: '#c8cdd8', padding: '8px' }}>{arma.nome}</td>
                      <td style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 11, color: '#9a3030', padding: '8px' }}>{arma.dano}</td>
                      <td style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 11, color: '#c8a96e', padding: '8px' }}>{arma.espaco}</td>
                      <td style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#6a7090', padding: '8px' }}>{arma.alcance}</td>
                      <td style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#6a7090', padding: '8px' }}>{arma.critico}</td>
                      <td style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#4a9aba', padding: '8px' }}>{arma.pericia}</td>
                      <td style={{ padding: '8px' }}>
                        <button onClick={() => addArmaDosCatalogo(arma)} style={{ background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.3)', color: '#c8a96e', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, padding: '4px 10px', borderRadius: 2, cursor: 'pointer' }}>+ ADD</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── HEADER ─── */}
      <div style={{ borderBottom: '1px solid #1a1d35', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: 'rgba(5,5,8,0.97)', backdropFilter: 'blur(8px)', zIndex: 100, gap: 12 }}>
        <div>
          <button onClick={onVoltar} style={{ background: 'transparent', border: 'none', color: '#6a7490', fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1, cursor: 'pointer', marginBottom: 4, padding: 0 }}
            onMouseEnter={e => e.target.style.color = '#c8a96e'} onMouseLeave={e => e.target.style.color = '#6a7490'}>← MESAS</button>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#6a7490', letterSpacing: 3, marginBottom: 3 }}>AKASHIC RECORDS · ENTRE GALÁXIAS</div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 20, fontWeight: 700, color: '#c8a96e', letterSpacing: 2 }}>{f.nome || 'SEM NOME'}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            {f.classe && <Tag>{f.classe}</Tag>}
            {f.trilha && <Tag cor="#4a9aba">{f.trilha}</Tag>}
            {(f.elementos || []).map(el => <Tag key={el} cor="#6a3a8a">{el}</Tag>)}
            <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2, color: corEstagio, background: `${corEstagio}15`, border: `1px solid ${corEstagio}44`, padding: '2px 8px', borderRadius: 2 }}>ESTÁGIO {estagio}</span>
            {f.finalizada && !f.liberada && <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2, color: '#5a8050', background: 'rgba(50,120,60,0.1)', border: '1px solid rgba(50,120,60,0.3)', padding: '2px 8px', borderRadius: 2 }}>✓ FINALIZADA</span>}
            {f.finalizada && f.liberada && <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2, color: '#4a9aba', background: 'rgba(74,154,186,0.1)', border: '1px solid rgba(74,154,186,0.3)', padding: '2px 8px', borderRadius: 2 }}>🔓 LIBERADA PELO MESTRE</span>}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#7a849a', letterSpacing: 2 }}>NÍVEL</div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 30, fontWeight: 900, color: '#4a9aba', lineHeight: 1 }}>{f.nivel}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {!f.finalizada && (
              <button onClick={() => setConfirmandoFinalizar(true)} style={{ background: 'rgba(154,48,48,0.1)', border: '1px solid #9a303055', color: '#c05050', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, padding: '6px 12px', cursor: 'pointer', borderRadius: 2 }}>
                ◉ FINALIZAR
              </button>
            )}
            <button onClick={() => setConfirmandoExclusao(true)} style={{ background: 'transparent', border: '1px solid #5a202055', color: '#6a3030', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 1, padding: '6px 12px', cursor: 'pointer', borderRadius: 2 }}
              title="Solicitar exclusão da ficha ao Mestre">
              {f.solicitandoExclusao ? '⏳ AGUARDANDO' : '🗑 EXCLUIR'}
            </button>
            <button onClick={() => salvar(ficha)} disabled={salvando} style={{ background: 'transparent', border: `1px solid ${salvando ? '#2a3050' : '#c8a96e55'}`, color: salvando ? '#3a4560' : '#c8a96e', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2, padding: '6px 14px', cursor: 'pointer', borderRadius: 2 }}>
              {salvando ? '◌ SALVANDO' : '◈ SALVAR'}
            </button>
          </div>
          {ultimoSalvo && <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#2a3050' }}>{ultimoSalvo.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>}
        </div>
      </div>

      {/* Abas */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1a1d35', overflowX: 'auto', position: 'sticky', top: 90, background: 'rgba(5,5,8,0.97)', backdropFilter: 'blur(8px)', zIndex: 99 }}>
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

        {/* ─── IDENTIDADE ─── */}
        {aba === 'identidade' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="anim">
            <div style={{ display: 'grid', gridTemplateColumns: '155px 1fr', gap: 14 }}>
              <div>
                <div style={{ width: '100%', aspectRatio: '3/4', background: '#09090f', border: '1px solid #1a1d35', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(10px 0%,100% 0%,100% calc(100% - 10px),calc(100% - 10px) 100%,0% 100%,0% 10px)' }}>
                  {f.fotoURL ? <img src={f.fotoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                    : <div style={{ textAlign: 'center', padding: 12 }}><div style={{ fontSize: 24, marginBottom: 4, opacity: 0.2 }}>◎</div><div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#2a3050', letterSpacing: 1 }}>SEM FOTO</div></div>}
                </div>
                <div style={{ marginTop: 8 }}>
                  <input type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} id="foto-input" />
                  <button onClick={() => document.getElementById('foto-input').click()} style={{ width: '100%', background: 'transparent', border: '1px solid #1a1d35', color: '#3a4560', fontFamily: 'Share Tech Mono,monospace', fontSize: 8, letterSpacing: 1, padding: '6px', borderRadius: 2, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
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
                      <Campo label={<>Estágio</>}>
                        <div style={{ background: 'rgba(5,5,12,0.9)', border: `1px solid ${corEstagio}44`, padding: '8px 12px', borderRadius: 2, fontFamily: 'Cinzel,serif', fontSize: 18, color: corEstagio, textAlign: 'center' }}>{estagio}</div>
                      </Campo>
                    </Grid2>
                  </div>
                </Painel>
                <Painel>
                  <Titulo>Classe & Origem</Titulo>
                  <Grid2>
                    <Campo label={<>Classe</>}>
                      <select value={f.classe} onChange={e => selecionarClasse(e.target.value)} disabled={bloq('classe')} style={inputStyle('classe')}>
                        {Object.keys(CLASSES).map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Campo>
                    <Campo label={<>Trilha</>}>
                      <select value={f.trilha} onChange={e => selecionarTrilha(e.target.value)} disabled={bloq('trilha')} style={inputStyle('trilha')}>
                        <option value="">— Sem trilha —</option>
                        {CLASSES[f.classe]?.trilhas.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </Campo>
                    <Campo label={<>Gênese</>}>
                      <select value={f.genese} onChange={e => !bloq('genese') && selecionarGenese(e.target.value)} disabled={bloq('genese')} style={inputStyle('genese')}>
                        {GENESES.map(g => <option key={g}>{g}</option>)}
                      </select>
                      {f.genese && GENESES_DATA[f.genese] && (
                        <div style={{ marginTop: 6, padding: '6px 10px', background: 'rgba(200,169,110,0.05)', border: '1px solid rgba(200,169,110,0.15)', borderRadius: 2 }}>
                          {GENESES_DATA[f.genese].bonusPericias.length > 0 && (
                            <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#c8a96e', letterSpacing: 1 }}>
                              BÔNUS +2: {GENESES_DATA[f.genese].bonusPericias.join(' · ')}
                            </div>
                          )}
                          {f.genese === 'Psicólogo' && (
                            <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#c8a96e', letterSpacing: 1 }}>
                              BÔNUS +2: Duas perícias à escolha
                            </div>
                          )}
                        </div>
                      )}
                    </Campo>
                    <Campo label="Personalidade">
                      <input value={f.personalidade || ''} onChange={e => set('personalidade', e.target.value)} placeholder="Descreva brevemente..." />
                    </Campo>
                  </Grid2>
                </Painel>
              </div>
            </div>

            {/* Elementos */}
            <Painel>
              <Titulo>Elementos</Titulo>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ELEMENTOS.map(el => {
                  const selecionado = (f.elementos || []).includes(el.nome) && el.nome !== 'Nenhum'
                  const travado = el.bloqueado || (f.finalizada && selecionado)
                  return (
                    <button key={el.nome} onClick={() => !travado && toggleElemento(el.nome)} disabled={travado}
                      style={{
                        background: el.bloqueado ? 'rgba(150,30,30,0.08)' : selecionado ? 'rgba(106,58,138,0.2)' : 'transparent',
                        border: `1px solid ${el.bloqueado ? '#5a2020' : selecionado ? '#6a3a8a' : '#2a3050'}`,
                        color: el.bloqueado ? '#5a2020' : selecionado ? '#9a5aba' : '#5a6580',
                        fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1,
                        padding: '6px 12px', borderRadius: 2, cursor: travado ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s', textDecoration: el.bloqueado ? 'line-through' : 'none'
                      }}>
                      {el.nome}{el.bloqueado ? ' 🔒' : ''}
                    </button>
                  )
                })}
              </div>
            </Painel>

            {/* Proficiências */}
            <Painel>
              <Titulo>Proficiências</Titulo>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2, marginBottom: 8 }}>ARMAS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['Armas Leves', 'Armas Médias', 'Armas Táticas', 'Armas Pesadas'].map(p => {
                      const ativo = (f.proficiencias || []).includes(p)
                      return (
                        <button key={p} onClick={() => {
                          const atual = f.proficiencias || []
                          set('proficiencias', ativo ? atual.filter(x => x !== p) : [...atual, p])
                        }} style={{
                          background: ativo ? 'rgba(200,169,110,0.15)' : 'transparent',
                          border: `1px solid ${ativo ? '#c8a96e' : '#2a3050'}`,
                          color: ativo ? '#c8a96e' : '#5a6580',
                          fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1,
                          padding: '6px 14px', borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s'
                        }}>{p}</button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2, marginBottom: 8 }}>ARMADURAS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['Armaduras Leves', 'Armaduras Médias', 'Armaduras Pesadas'].map(p => {
                      const ativo = (f.proficiencias || []).includes(p)
                      return (
                        <button key={p} onClick={() => {
                          const atual = f.proficiencias || []
                          set('proficiencias', ativo ? atual.filter(x => x !== p) : [...atual, p])
                        }} style={{
                          background: ativo ? 'rgba(74,154,186,0.15)' : 'transparent',
                          border: `1px solid ${ativo ? '#4a9aba' : '#2a3050'}`,
                          color: ativo ? '#4a9aba' : '#5a6580',
                          fontFamily: 'Share Tech Mono,monospace', fontSize: 10, letterSpacing: 1,
                          padding: '6px 14px', borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s'
                        }}>{p}</button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Painel>

            <Painel>
              <Titulo>História & Backstory</Titulo>
              <textarea value={f.notas} onChange={e => set('notas', e.target.value)} rows={5} placeholder="Backstory, vínculos, segredos, origem..." />
            </Painel>

            <Painel>
              <Titulo cor="#4a9aba">Anotações de Sessão</Titulo>
              <textarea value={f.anotacoesSessao || ''} onChange={e => set('anotacoesSessao', e.target.value)} rows={5} placeholder="Anotações importantes da sessão, objetivos, NPCs, informações relevantes..." />
            </Painel>
          </div>
        )}

        {/* ─── ATRIBUTOS ─── */}
        {aba === 'atributos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="anim">
            <Painel>
              <Titulo>Focos</Titulo>
              <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#5a6080', letterSpacing: 1, marginBottom: 12, lineHeight: 1.6 }}>
                Estágio 1: 0–5 · Estágio 2: todos em 5 para avançar para 6 · Estágio 3: todos em 10 para avançar para 11
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(f.focos).map(([attr, val]) => {
                  const podeUp = podeAumentar(f.focos, attr)
                  return (
                    <div key={attr} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 92, fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 2, color: '#8a9ab0' }}>{attr.toUpperCase()}</div>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => {
                          const ativo = val >= n
                          const cor = n <= 5 ? '#c8a96e' : n <= 10 ? '#4a9aba' : '#9a3030'
                          const sz = n > 10 ? 20 : n > 5 ? 24 : 28
                          return (
                            <button key={n} onClick={() => setFoco(attr, val === n ? n - 1 : n)} disabled={bloq('focos')} style={{
                              width: sz, height: sz, borderRadius: '50%',
                              border: `1px solid ${ativo ? cor : '#1a2030'}`,
                              background: ativo ? `${cor}20` : 'transparent',
                              color: ativo ? cor : '#1a2030',
                              fontSize: n > 5 ? 9 : 13,
                              boxShadow: ativo ? `0 0 8px ${cor}33` : 'none',
                              cursor: bloq('focos') ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
                              opacity: !ativo && !podeUp && n === val + 1 ? 0.25 : 1
                            }}>{ativo ? '◆' : '◇'}</button>
                          )
                        })}
                      </div>
                      <div style={{ fontFamily: 'Cinzel,serif', fontSize: 20, fontWeight: 700, color: val > 0 ? '#c8a96e' : '#2a3050', minWidth: 26, textAlign: 'center' }}>{val}</div>
                    </div>
                  )
                })}
                <div style={{ paddingTop: 10, borderTop: '1px solid #1a1d35', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a4560', letterSpacing: 2 }}>STATUS TOTAL: <span style={{ color: '#4a9aba', fontSize: 13, fontFamily: 'Cinzel,serif' }}>{statusTotal}</span></span>
                  <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2, color: corEstagio }}>ESTÁGIO {estagio}</span>
                </div>
              </div>
            </Painel>

            <Painel>
              <Titulo>Reservas</Titulo>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[{ key: 'vida', label: 'PONTOS DE VIDA', cor: '#9a3030' }, { key: 'esforco', label: 'PONTOS DE ESFORÇO', cor: '#4a9aba' }, { key: 'sanidade', label: 'SANIDADE', cor: '#6a3a8a' }].map(r => (
                  <div key={r.key}>
                    <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: r.cor, letterSpacing: 2, marginBottom: 8 }}>{r.label}</div>
                    <Grid2>
                      <Campo label="ATUAL"><input type="number" min={0} value={f.reservas[r.key].atual} onChange={e => setReserva(r.key, 'atual', e.target.value)} style={{ fontFamily: 'Cinzel,serif', fontSize: 18, textAlign: 'center', color: r.cor }} /></Campo>
                      <Campo label="MÁXIMO"><input type="number" min={0} value={f.reservas[r.key].max} onChange={e => setReserva(r.key, 'max', e.target.value)} style={{ fontFamily: 'Cinzel,serif', fontSize: 18, textAlign: 'center' }} /></Campo>
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

        {/* ─── PERÍCIAS ─── */}
        {aba === 'pericias' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="anim">
            {f.finalizada && !f.liberada && <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#5a3030', letterSpacing: 1, padding: '8px 12px', background: 'rgba(90,30,30,0.1)', border: '1px solid #5a202055', borderRadius: 2 }}>🔒 Ficha finalizada — peça ao Mestre para liberar a edição.</div>}
            {f.finalizada && f.liberada && <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#3a6050', letterSpacing: 1, padding: '8px 12px', background: 'rgba(50,120,80,0.08)', border: '1px solid rgba(50,120,80,0.3)', borderRadius: 2 }}>🔓 Edição liberada pelo Mestre.</div>}
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
                          <button onClick={() => setPericia(per, val - 1)} disabled={bloq('pericias')} style={{ background: 'transparent', border: '1px solid #1a2030', color: bloq('pericias') ? '#2a2a2a' : '#4a5070', width: 20, height: 20, borderRadius: 2, cursor: bloq('pericias') ? 'not-allowed' : 'pointer', fontSize: 12 }}>−</button>
                          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 13, color: val > 0 ? '#c8a96e' : '#2a3050', minWidth: 28, textAlign: 'center', fontWeight: val > 0 ? 'bold' : 'normal' }}>{val > 0 ? `+${val}` : '—'}</div>
                          <button onClick={() => setPericia(per, val + 1)} disabled={bloq('pericias')} style={{ background: 'transparent', border: '1px solid #1a2030', color: bloq('pericias') ? '#2a2a2a' : '#4a5070', width: 20, height: 20, borderRadius: 2, cursor: bloq('pericias') ? 'not-allowed' : 'pointer', fontSize: 12 }}>+</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Painel>
            ))}
          </div>
        )}

        {/* ─── CAPACIDADES ─── */}
        {aba === 'capacidades' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="anim">
            {[
              { key: 'habilidades', label: 'Habilidades', sub: 'gastam PE', cor: '#c8a96e' },
              { key: 'magias', label: 'Magias', sub: 'rituais elementais', cor: '#4a9aba' },
              { key: 'passivas', label: 'Passivas', sub: 'não gastam PE', cor: '#6a3a8a' },
              { key: 'poderes', label: 'Poderes', sub: 'sobrenaturais', cor: '#9a3030' },
            ].map(({ key, label, sub, cor }) => (
              <Painel key={key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 14, height: 1, background: cor, opacity: 0.6 }} />
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 3, color: cor, textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#3a4560', letterSpacing: 1 }}>· {sub}</div>
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(to right,${cor}55,transparent)` }} />
                 
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                  {(f[key] || []).map(item => (
                    <div key={item.id} style={{ borderLeft: `2px solid ${item.automatica ? cor + '66' : cor + '33'}`, paddingLeft: 12, opacity: item.automatica ? 1 : 0.95 }}>
                      {item.automatica && <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: cor, letterSpacing: 1, marginBottom: 4, opacity: 0.6 }}>● AUTOMÁTICO</div>}
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                        <input value={item.nome} onChange={e => updCap(key, item.id, 'nome', e.target.value)}
                          disabled={item.automatica}
                          placeholder="Nome..." style={{ fontFamily: 'Cinzel,serif', fontSize: 13, color: cor, opacity: item.automatica ? 0.8 : 1, cursor: item.automatica ? 'default' : undefined }} />
                        {!item.automatica && !item.doCatalogo && !bloq(key) && <BtnPerigo onClick={() => remCap(key, item.id)}>✕</BtnPerigo>}
                        {item.doCatalogo && !bloq(key) && <BtnPerigo onClick={() => remCap(key, item.id)}>✕</BtnPerigo>}
                      </div>
                      <textarea value={item.desc} onChange={e => (!item.automatica && !item.doCatalogo) && updCap(key, item.id, 'desc', e.target.value)}
                        disabled={item.automatica || item.doCatalogo}
                        rows={2} placeholder="Descrição, efeito, custo em PE..." style={{ fontSize: 14, whiteSpace: 'pre-line', cursor: (item.automatica || item.doCatalogo) ? 'not-allowed' : undefined, opacity: (item.automatica || item.doCatalogo) ? 0.75 : 1 }} />
                    </div>
                  ))}
                </div>
                {!bloq(key) && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <BtnLink onClick={() => setCatalogoAberto({ tipo: key })} cor={cor}>📖 CATÁLOGO</BtnLink>
                    <BtnLink onClick={() => addCap(key)} cor={cor}>+ MANUAL</BtnLink>
                  </div>
                )}
              </Painel>
            ))}
          </div>
        )}

        {/* ─── COMBATE ─── */}
        {aba === 'combate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="anim">
            <Painel>
              <Titulo>Estatísticas</Titulo>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {[['resistencia','RESISTÊNCIA'],['defesa','DEFESA'],['contraAtaque','CONTRA ATAQUE'],['esquiva','ESQUIVA'],['armaduraBase','ARMADURA BASE'],['movimento','MOVIMENTO']].map(([k,l]) => (
                  <Campo key={k} label={l}><input type="number" min={0} value={f.combate?.[k] || 0} onChange={e => setNested('combate', k, Number(e.target.value))} style={{ fontFamily: 'Cinzel,serif', fontSize: 18, textAlign: 'center' }} /></Campo>
                ))}
              </div>
              <div style={{ marginTop: 12 }}>
                <Campo label="Traumas"><textarea value={f.combate?.traumas || ''} rows={3} onChange={e => setNested('combate', 'traumas', e.target.value)} placeholder="Traumas ativos, sequelas, condições..." /></Campo>
              </div>
            </Painel>

            <Painel>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 14, height: 1, background: '#c8a96e', opacity: 0.6 }} />
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 3, color: '#c8a96e', textTransform: 'uppercase' }}>Arsenal</div>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,rgba(200,169,110,0.25),transparent)', minWidth: 40 }} />
                </div>
                <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: pesoAtual > cargaMax ? '#9a3030' : '#3a4560', letterSpacing: 1 }}>PESO: {pesoAtual}/{cargaMax}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
                {(f.armas || []).map(arma => (
                  <div key={arma.id} style={{ border: '1px solid #1a1d35', padding: 12, borderRadius: 2 }}>
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
                      <Campo label="ESPAÇO (PESO)"><input type="number" min={0} value={arma.espaco || 0} onChange={e => updArma(arma.id,'espaco',Number(e.target.value))} /></Campo>
                      <Campo label="GRAU DE AMEAÇA">
                        <select value={arma.grauAmeaca || 1} onChange={e => updArma(arma.id,'grauAmeaca',Number(e.target.value))}>
                          <option value={1}>Ameaça 1 — Dano cheio</option>
                          <option value={2}>Ameaça 2 — Crítico 2x</option>
                          <option value={3}>Ameaça 3 — Crítico +2x</option>
                        </select>
                      </Campo>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                      <Campo label="TIPO DE MUNIÇÃO">
                        <select value={arma.tipoMunicao || 'Padrão'} onChange={e => updArma(arma.id,'tipoMunicao',e.target.value)}>
                          {TIPOS_MUNICAO.map(m => <option key={m.nome}>{m.nome}</option>)}
                        </select>
                      </Campo>
                      {arma.tipoMunicao === 'Pesada' ? (
                        <Campo label="QTD BALAS PESADAS (peso 1/bala)">
                          <input type="number" min={0} value={arma.qtdMunicaoPesada || 0}
                            onChange={e => updArma(arma.id,'qtdMunicaoPesada',Number(e.target.value))}
                            style={{ fontFamily: 'Cinzel,serif' }} />
                        </Campo>
                      ) : (
                        <Campo label="ACESSÓRIOS">
                          <select onChange={e => {
                            if (!e.target.value) return
                            const atual = arma.acessorios || []
                            if (!atual.includes(e.target.value)) updArma(arma.id,'acessorios',[...atual, e.target.value])
                            e.target.value = ''
                          }}>
                            <option value="">+ Adicionar acessório...</option>
                            {ACESSORIOS_ARMA.map(a => <option key={a.nome} value={a.nome}>{a.nome} (peso {a.peso})</option>)}
                          </select>
                        </Campo>
                      )}
                    </div>
                    {arma.tipoMunicao === 'Pesada' && (
                      <div style={{ marginBottom: 8 }}>
                        <Campo label="ACESSÓRIOS">
                          <select onChange={e => {
                            if (!e.target.value) return
                            const atual = arma.acessorios || []
                            if (!atual.includes(e.target.value)) updArma(arma.id,'acessorios',[...atual, e.target.value])
                            e.target.value = ''
                          }}>
                            <option value="">+ Adicionar acessório...</option>
                            {ACESSORIOS_ARMA.map(a => <option key={a.nome} value={a.nome}>{a.nome} (peso {a.peso})</option>)}
                          </select>
                        </Campo>
                      </div>
                    )}
                    {(arma.acessorios || []).length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
                        {(arma.acessorios || []).map(ac => (
                          <span key={ac} onClick={() => updArma(arma.id,'acessorios',(arma.acessorios||[]).filter(x=>x!==ac))} style={{ background: 'rgba(74,154,186,0.1)', border: '1px solid rgba(74,154,186,0.3)', color: '#4a9aba', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, padding: '2px 8px', borderRadius: 2, cursor: 'pointer', letterSpacing: 1 }}>{ac} ✕</span>
                        ))}
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

        {/* ─── INVENTÁRIO ─── */}
        {aba === 'inventario' && (
          <div className="anim">
            <Painel>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 14, height: 1, background: '#c8a96e', opacity: 0.6 }} />
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: 11, letterSpacing: 3, color: '#c8a96e', textTransform: 'uppercase' }}>Inventário</div>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,rgba(200,169,110,0.25),transparent)', minWidth: 40 }} />
                </div>
                <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: pesoAtual > cargaMax ? '#9a3030' : '#3a4560', letterSpacing: 1 }}>
                  PESO TOTAL: {pesoAtual}/{cargaMax} (armas: {pesoArmas} · itens: {pesoInventario})
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 45px 55px 2fr 32px', gap: 6, marginBottom: 6 }}>
                {['ITEM','QTD','PESO','DESCRIÇÃO',''].map((h,i) => <div key={i} style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 8, color: '#2a3050', letterSpacing: 1 }}>{h}</div>)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {(f.inventario || []).map(item => (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 45px 55px 2fr 32px', gap: 6, alignItems: 'center' }}>
                    <input value={item.item} onChange={e => updItem(item.id,'item',e.target.value)} placeholder="Item..." />
                    <input type="number" min={0} value={item.qtd} onChange={e => updItem(item.id,'qtd',Number(e.target.value))} style={{ textAlign: 'center' }} />
                    <input type="number" min={0} value={item.peso || 0} onChange={e => updItem(item.id,'peso',Number(e.target.value))} style={{ textAlign: 'center' }} placeholder="0" />
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
