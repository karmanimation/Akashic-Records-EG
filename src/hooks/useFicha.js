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
      if (existente.nivel !== dados.nivel) mudancas.push(`Nível ${existente.nivel || 1} → ${dados.nivel}`)
      if (existente.classe !== dados.classe) mudancas.push(`Classe: ${dados.classe}`)
      if (existente.trilha !== dados.trilha && dados.trilha) mudancas.push(`Trilha: ${dados.trilha}`)
      if (existente.genese !== dados.genese) mudancas.push(`Gênese: ${dados.genese}`)
      const elemAntes = (existente.elementos || []).join(',')
      const elemDepois = (dados.elementos || []).join(',')
      if (elemAntes !== elemDepois) mudancas.push(`Elementos atualizados`)
      const focosAntes = JSON.stringify(existente.focos || {})
      const focosDepois = JSON.stringify(dados.focos || {})
      if (focosAntes !== focosDepois) mudancas.push(`Atributos atualizados`)
      const habAntes = (existente.habilidades || []).length
      const habDepois = (dados.habilidades || []).length
      if (habAntes !== habDepois) mudancas.push(`Habilidades: ${habDepois} capacidades`)
      const passAntes = (existente.passivas || []).length
      const passDepois = (dados.passivas || []).length
      if (passAntes !== passDepois) mudancas.push(`Passivas: ${passDepois} capacidades`)
      const armasAntes = (existente.armas || []).length
      const armasDepois = (dados.armas || []).length
      if (armasAntes !== armasDepois) mudancas.push(`Arsenal: ${armasDepois} armas`)
      if (existente.finalizada !== dados.finalizada && dados.finalizada) mudancas.push(`Ficha finalizada`)

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
        historico: historicoAtualizado,
      })
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
      setFichas(snap.docs.map(d => ({ uid: d.id, ...d.data() })))
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

  return { fichas, loading, liberarFicha, travarFicha, excluirFicha, rejeitarExclusao }
}

export function useNPCs(mesaId) {
  const [npcs, setNPCs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mesaId) return
    return onSnapshot(collection(db, 'mesas', mesaId, 'npcs'), snap => {
      setNPCs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [mesaId])

  const salvarNPC = useCallback(async (npc) => {
    if (!mesaId) return
    const id = npc.id || `npc_${Date.now()}`
    await setDoc(doc(db, 'mesas', mesaId, 'npcs', id), { ...npc, id })
    return id
  }, [mesaId])

  const excluirNPC = useCallback(async (id) => {
    if (!mesaId || !id) return
    await deleteDoc(doc(db, 'mesas', mesaId, 'npcs', id))
  }, [mesaId])

  return { npcs, loading, salvarNPC, excluirNPC }
}
