// src/hooks/useFicha.js
import { useState, useEffect, useCallback } from 'react'
import { doc, setDoc, deleteDoc, onSnapshot, collection, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { fichaInicial } from '../data/sistema'

export function useFicha(userId, mesaId) {
  const [ficha, setFicha] = useState(fichaInicial())
  const [salvando, setSalvando] = useState(false)
  const [ultimoSalvo, setUltimoSalvo] = useState(null)

  useEffect(() => {
    if (!userId || !mesaId) return
    const ref_ = doc(db, 'mesas', mesaId, 'fichas', userId)
    return onSnapshot(ref_, snap => {
      if (snap.exists()) {
        setFicha({ ...fichaInicial(), ...snap.data() })
      } else {
        setFicha(fichaInicial())
      }
    })
  }, [userId, mesaId])

  const salvar = useCallback(async (dados) => {
    if (!userId || !mesaId) return
    setSalvando(true)
    try {
      const ref_ = doc(db, 'mesas', mesaId, 'fichas', userId)
      // Busca campos do Mestre antes de salvar para não perder
      const snap = await getDoc(ref_)
      const existente = snap.exists() ? snap.data() : {}

      // Detecta o que mudou para registrar no histórico
      const mudancas = []

      // Dados básicos
      if (existente.nivel !== dados.nivel) mudancas.push(`Nível: ${existente.nivel || 1} → ${dados.nivel}`)
      if (existente.classe !== dados.classe) mudancas.push(`Classe: ${existente.classe || '—'} → ${dados.classe}`)
      if (existente.trilha !== dados.trilha) mudancas.push(`Trilha: ${existente.trilha || '—'} → ${dados.trilha || '—'}`)
      if (existente.genese !== dados.genese) mudancas.push(`Gênese: ${existente.genese || '—'} → ${dados.genese}`)
      if (existente.raca !== dados.raca) mudancas.push(`Raça: ${existente.raca || '—'} → ${dados.raca || '—'}`)
      if (existente.nome !== dados.nome) mudancas.push(`Nome: ${existente.nome || '—'} → ${dados.nome || '—'}`)

      // Elementos
      const elemAntes = [...(existente.elementos || [])].sort().join(', ')
      const elemDepois = [...(dados.elementos || [])].sort().join(', ')
      if (elemAntes !== elemDepois) mudancas.push(`Elementos: [${elemAntes || '—'}] → [${elemDepois || '—'}]`)

      // Focos (atributos)
      const focosAntes = existente.focos || {}
      const focosDepois = dados.focos || {}
      for (const attr of ['Força', 'Agilidade', 'Intelecto', 'Vigor', 'Domínio']) {
        const antes = focosAntes[attr] ?? 0
        const depois = focosDepois[attr] ?? 0
        if (antes !== depois) mudancas.push(`${attr}: ${antes} → ${depois}`)
      }

      // Reservas
      const res = ['vida', 'esforco', 'sanidade']
      const resNomes = { vida: 'Vida', esforco: 'Esforço', sanidade: 'Sanidade' }
      for (const r of res) {
        const maxAntes = existente.reservas?.[r]?.max ?? 0
        const maxDepois = dados.reservas?.[r]?.max ?? 0
        const atualAntes = existente.reservas?.[r]?.atual ?? 0
        const atualDepois = dados.reservas?.[r]?.atual ?? 0
        if (maxAntes !== maxDepois) mudancas.push(`${resNomes[r]} máx: ${maxAntes} → ${maxDepois}`)
        if (atualAntes !== atualDepois) mudancas.push(`${resNomes[r]} atual: ${atualAntes} → ${atualDepois}`)
      }

      // Combate
      const combAntes = existente.combate || {}
      const combDepois = dados.combate || {}
      const combCampos = { resistencia: 'Resistência', defesa: 'Defesa', contraAtaque: 'Contra Ataque', esquiva: 'Esquiva', armaduraBase: 'Armadura Base', movimento: 'Movimento' }
      for (const [k, label] of Object.entries(combCampos)) {
        if ((combAntes[k] ?? 0) !== (combDepois[k] ?? 0)) mudancas.push(`${label}: ${combAntes[k] ?? 0} → ${combDepois[k] ?? 0}`)
      }

      // Perícias — detecta as que mudaram
      const perAntes = existente.pericias || {}
      const perDepois = dados.pericias || {}
      const perMudadas = []
      for (const per of Object.keys(perDepois)) {
        const a = perAntes[per] ?? 0
        const d = perDepois[per] ?? 0
        if (a !== d) perMudadas.push(`${per}: ${a} → ${d}`)
      }
      if (perMudadas.length > 0) mudancas.push(`Perícias — ${perMudadas.join(', ')}`)

      // Arsenal
      const armasAntes = existente.armas || []
      const armasDepois = dados.armas || []
      if (armasAntes.length !== armasDepois.length) {
        mudancas.push(`Arsenal: ${armasAntes.length} → ${armasDepois.length} armas`)
      } else {
        // Verifica armas modificadas
        for (const armaD of armasDepois) {
          const armaA = armasAntes.find(a => a.id === armaD.id)
          if (armaA && armaA.nome !== armaD.nome) mudancas.push(`Arma renomeada: ${armaA.nome || '—'} → ${armaD.nome}`)
        }
      }

      // Inventário
      const invAntes = existente.inventario || []
      const invDepois = dados.inventario || []
      if (invAntes.length !== invDepois.length) {
        mudancas.push(`Inventário: ${invAntes.length} → ${invDepois.length} itens`)
      } else {
        for (const itemD of invDepois) {
          const itemA = invAntes.find(i => i.id === itemD.id)
          if (itemA) {
            if (itemA.qtd !== itemD.qtd) mudancas.push(`${itemD.item || 'Item'}: qtd ${itemA.qtd} → ${itemD.qtd}`)
            if ((itemA.peso || 0) !== (itemD.peso || 0)) mudancas.push(`${itemD.item || 'Item'}: peso ${itemA.peso || 0} → ${itemD.peso || 0}`)
          }
        }
      }

      // Capacidades
      const habAntes = (existente.habilidades || []).filter(h => !h.automatica).length
      const habDepois = (dados.habilidades || []).filter(h => !h.automatica).length
      if (habAntes !== habDepois) mudancas.push(`Habilidades: ${habAntes} → ${habDepois}`)

      const passAntes = (existente.passivas || []).filter(h => !h.automatica).length
      const passDepois = (dados.passivas || []).filter(h => !h.automatica).length
      if (passAntes !== passDepois) mudancas.push(`Passivas: ${passAntes} → ${passDepois}`)

      const magAntes = (existente.magias || []).length
      const magDepois = (dados.magias || []).length
      if (magAntes !== magDepois) mudancas.push(`Magias: ${magAntes} → ${magDepois}`)

      const podAntes = (existente.poderes || []).length
      const podDepois = (dados.poderes || []).length
      if (podAntes !== podDepois) mudancas.push(`Poderes: ${podAntes} → ${podDepois}`)

      // Finalização
      if (!existente.finalizada && dados.finalizada) mudancas.push(`Ficha finalizada`)
      if (existente.finalizada && !dados.finalizada) mudancas.push(`Ficha reaberta`)

      // Monta entrada do histórico
      const novaEntrada = {
        timestamp: new Date().toISOString(),
        resumo: mudancas.length > 0 ? mudancas.join(' · ') : 'Ficha salva'
      }
      const historicoAnterior = existente.historico || []
      const historicoAtualizado = [novaEntrada, ...historicoAnterior].slice(0, 30) // máx 30 entradas

      await setDoc(ref_, {
        ...dados,
        liberada: existente.liberada ?? false,
        solicitandoExclusao: existente.solicitandoExclusao ?? false,
        // Preserva manifestacao mas mantém os bônus que o jogador preencheu
        manifestacao: {
          ...(existente.manifestacao || {}),
          focos: dados.manifestacao?.focos || existente.manifestacao?.focos || {},
          pericias: dados.manifestacao?.pericias || existente.manifestacao?.pericias || {},
        },
        historico: historicoAtualizado,
      })
      await setDoc(doc(db, 'mesas', mesaId, 'resumos', userId), criarResumoFicha({ ...dados, uid: userId }, 'jogador'))
      setUltimoSalvo(new Date())
    } finally { setSalvando(false) }
  }, [userId, mesaId])

  const solicitarExclusao = useCallback(async () => {
    if (!userId || !mesaId) return
    const ref_ = doc(db, 'mesas', mesaId, 'fichas', userId)
    const snap = await getDoc(ref_)
    if (snap.exists()) {
      await updateDoc(ref_, { solicitandoExclusao: true })
    }
  }, [userId, mesaId])

  const cancelarExclusao = useCallback(async () => {
    if (!userId || !mesaId) return
    const ref_ = doc(db, 'mesas', mesaId, 'fichas', userId)
    const snap = await getDoc(ref_)
    if (snap.exists()) {
      await updateDoc(ref_, { solicitandoExclusao: false })
    }
  }, [userId, mesaId])

  return { ficha, setFicha, salvar, salvando, ultimoSalvo, solicitarExclusao, cancelarExclusao }
}

export function useFichasMesa(mesaId) {
  const [fichas, setFichas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mesaId) return
    return onSnapshot(collection(db, 'mesas', mesaId, 'fichas'), snap => {
      const dados = snap.docs.map(d => ({ uid: d.id, ...d.data() }))
      setFichas(dados)
      dados.forEach(f => {
        setDoc(doc(db, 'mesas', mesaId, 'resumos', f.uid), criarResumoFicha(f, 'jogador')).catch(() => {})
      })
      setLoading(false)
    })
  }, [mesaId])

  // Mestre libera TODA a ficha — usa setDoc merge como fallback se updateDoc falhar
  const liberarFicha = useCallback(async (uid) => {
    if (!mesaId || !uid) return
    const ref_ = doc(db, 'mesas', mesaId, 'fichas', uid)
    try {
      await updateDoc(ref_, { liberada: true })
    } catch {
      await setDoc(ref_, { liberada: true }, { merge: true })
    }
  }, [mesaId])

  // Mestre trava a ficha novamente
  const travarFicha = useCallback(async (uid) => {
    if (!mesaId || !uid) return
    const ref_ = doc(db, 'mesas', mesaId, 'fichas', uid)
    try {
      await updateDoc(ref_, { liberada: false })
    } catch {
      await setDoc(ref_, { liberada: false }, { merge: true })
    }
  }, [mesaId])

  // Mestre exclui ficha
  const excluirFicha = useCallback(async (uid) => {
    if (!mesaId || !uid) return
    await deleteDoc(doc(db, 'mesas', mesaId, 'fichas', uid))
  }, [mesaId])

  // Mestre rejeita exclusão
  const rejeitarExclusao = useCallback(async (uid) => {
    if (!mesaId || !uid) return
    const ref_ = doc(db, 'mesas', mesaId, 'fichas', uid)
    try {
      await updateDoc(ref_, { solicitandoExclusao: false })
    } catch {
      await setDoc(ref_, { solicitandoExclusao: false }, { merge: true })
    }
  }, [mesaId])

  // Mestre salva toda a configuração de manifestação
  const salvarManifestacao = useCallback(async (uid, manifestacao) => {
    if (!mesaId || !uid) return
    const ref_ = doc(db, 'mesas', mesaId, 'fichas', uid)
    try {
      await updateDoc(ref_, { manifestacao })
    } catch {
      await setDoc(ref_, { manifestacao }, { merge: true })
    }
  }, [mesaId])

  return { fichas, loading, liberarFicha, travarFicha, excluirFicha, rejeitarExclusao, salvarManifestacao }
}

export function useResumosMesa(mesaId) {
  const [resumos, setResumos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!mesaId) {
      setResumos([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    return onSnapshot(collection(db, 'mesas', mesaId, 'resumos'), snap => {
      setResumos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }, e => {
      setError(e)
      setResumos([])
      setLoading(false)
    })
  }, [mesaId])

  return { resumos, loading, error }
}

export function useNPCs(mesaId) {
  const [npcs, setNPCs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mesaId) return
    return onSnapshot(collection(db, 'mesas', mesaId, 'npcs'), snap => {
      const dados = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setNPCs(dados)
      dados.forEach(npc => {
        setDoc(doc(db, 'mesas', mesaId, 'resumos', npc.id), criarResumoFicha(npc, 'npc')).catch(() => {})
      })
      setLoading(false)
    })
  }, [mesaId])

  const salvarNPC = useCallback(async (npc) => {
    if (!mesaId) return
    const id = npc.id || `npc_${Date.now()}`
    await setDoc(doc(db, 'mesas', mesaId, 'npcs', id), { ...npc, id })
    await setDoc(doc(db, 'mesas', mesaId, 'resumos', id), criarResumoFicha({ ...npc, id }, 'npc'))
    return id
  }, [mesaId])

  const excluirNPC = useCallback(async (id) => {
    if (!mesaId || !id) return
    await deleteDoc(doc(db, 'mesas', mesaId, 'npcs', id))
    await deleteDoc(doc(db, 'mesas', mesaId, 'resumos', id))
  }, [mesaId])

  return { npcs, loading, salvarNPC, excluirNPC }
}

function criarResumoFicha(ficha, tipo) {
  return {
    tipo,
    origemId: tipo === 'npc' ? ficha.id : ficha.uid,
    nome: ficha.nome || '',
    fotoURL: ficha.fotoURL || '',
    classe: ficha.classe || '',
    trilha: ficha.trilha || '',
    genese: ficha.genese || '',
    elementos: ficha.elementos || [],
    nivel: ficha.nivel || 1,
    categoriaNPC: ficha.categoriaNPC || '',
    focos: ficha.focos || {},
    pericias: ficha.pericias || {},
    reservas: ficha.reservas || {},
    combate: ficha.combate || {},
    armas: ficha.armas || [],
    inventario: ficha.inventario || [],
    habilidades: ficha.habilidades || [],
    magias: ficha.magias || [],
    passivas: ficha.passivas || [],
    poderes: ficha.poderes || [],
    manifestacao: ficha.manifestacao || { ativo: false, tipo: 'vazio', nome: '', liberado: false, focos: {}, pericias: {} },
    atualizadoEm: new Date().toISOString(),
  }
}
