// src/hooks/useFicha.js
import { useState, useEffect, useCallback } from 'react'
import { doc, setDoc, deleteDoc, onSnapshot, collection, updateDoc } from 'firebase/firestore'
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
        // Merge cuidadoso: mantém fichaInicial como base mas prioriza todos os dados do Firebase
        const dados = snap.data()
        setFicha(prev => ({ ...fichaInicial(), ...dados }))
      } else {
        setFicha(fichaInicial())
      }
    })
  }, [userId, mesaId])

  const salvar = useCallback(async (dados) => {
    if (!userId || !mesaId) return
    setSalvando(true)
    try {
      await setDoc(doc(db, 'mesas', mesaId, 'fichas', userId), dados)
      setUltimoSalvo(new Date())
    } finally { setSalvando(false) }
  }, [userId, mesaId])

  const solicitarExclusao = useCallback(async () => {
    if (!userId || !mesaId) return
    await updateDoc(doc(db, 'mesas', mesaId, 'fichas', userId), { solicitandoExclusao: true })
  }, [userId, mesaId])

  const cancelarExclusao = useCallback(async () => {
    if (!userId || !mesaId) return
    await updateDoc(doc(db, 'mesas', mesaId, 'fichas', userId), { solicitandoExclusao: false })
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

  // Mestre libera um campo específico — usa updateDoc com dot notation para não sobrescrever outros campos
  const liberarCampo = useCallback(async (uid, campo, liberar) => {
    if (!mesaId || !uid) return
    const ref_ = doc(db, 'mesas', mesaId, 'fichas', uid)
    // Dot notation no Firestore faz update apenas do campo específico sem sobrescrever o objeto inteiro
    await updateDoc(ref_, { [`camposBloqueados.${campo}`]: liberar ? false : null })
  }, [mesaId])

  const excluirFicha = useCallback(async (uid) => {
    if (!mesaId || !uid) return
    await deleteDoc(doc(db, 'mesas', mesaId, 'fichas', uid))
  }, [mesaId])

  const rejeitarExclusao = useCallback(async (uid) => {
    if (!mesaId || !uid) return
    await updateDoc(doc(db, 'mesas', mesaId, 'fichas', uid), { solicitandoExclusao: false })
  }, [mesaId])

  return { fichas, loading, liberarCampo, excluirFicha, rejeitarExclusao }
}

// Hook para NPCs do Mestre
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
