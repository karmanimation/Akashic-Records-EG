// src/hooks/useFicha.js
import { useState, useEffect, useCallback } from 'react'
import { doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore'
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
      if (snap.exists()) setFicha(f => ({ ...fichaInicial(), ...snap.data() }))
      else setFicha(fichaInicial())
    })
  }, [userId, mesaId])

  const salvar = useCallback(async (dados) => {
    if (!userId || !mesaId) return
    setSalvando(true)
    try {
      await setDoc(doc(db, 'mesas', mesaId, 'fichas', userId), dados, { merge: true })
      setUltimoSalvo(new Date())
    } finally { setSalvando(false) }
  }, [userId, mesaId])

  // Jogador solicita exclusão da ficha
  const solicitarExclusao = useCallback(async () => {
    if (!userId || !mesaId) return
    await setDoc(doc(db, 'mesas', mesaId, 'fichas', userId), { solicitandoExclusao: true }, { merge: true })
  }, [userId, mesaId])

  // Cancela solicitação de exclusão
  const cancelarExclusao = useCallback(async () => {
    if (!userId || !mesaId) return
    await setDoc(doc(db, 'mesas', mesaId, 'fichas', userId), { solicitandoExclusao: false }, { merge: true })
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

  // Mestre confirma exclusão
  const excluirFicha = useCallback(async (uid) => {
    if (!mesaId || !uid) return
    await deleteDoc(doc(db, 'mesas', mesaId, 'fichas', uid))
  }, [mesaId])

  return { fichas, loading, excluirFicha }
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
    await setDoc(doc(db, 'mesas', mesaId, 'npcs', id), { ...npc, id }, { merge: true })
    return id
  }, [mesaId])

  const excluirNPC = useCallback(async (id) => {
    if (!mesaId || !id) return
    await deleteDoc(doc(db, 'mesas', mesaId, 'npcs', id))
  }, [mesaId])

  return { npcs, loading, salvarNPC, excluirNPC }
}
