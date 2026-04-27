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
        // NÃO usa fichaInicial() no spread — preserva tudo que vem do Firebase
        const dados = snap.data()
        setFicha(prev => {
          // Só atualiza campos que vieram do Firebase, sem sobrescrever nada
          return { ...fichaInicial(), ...dados }
        })
      } else {
        setFicha(fichaInicial())
      }
    })
  }, [userId, mesaId])

  // Salva a ficha — preserva campos controlados pelo Mestre
  const salvar = useCallback(async (dados) => {
    if (!userId || !mesaId) return
    setSalvando(true)
    try {
      const ref_ = doc(db, 'mesas', mesaId, 'fichas', userId)
      // Busca os campos do Mestre no Firebase para não sobrescrever
      const snap = await getDoc(ref_)
      const dadosFirebase = snap.exists() ? snap.data() : {}
      // Monta o objeto a salvar: dados do jogador + campos controlados pelo Mestre preservados
      const { camposBloqueados: _cb, solicitandoExclusao: _se, ...dadosJogador } = dados
      const dadosFinal = {
        ...dadosJogador,
        camposBloqueados: dadosFirebase.camposBloqueados || {},
        solicitandoExclusao: dadosFirebase.solicitandoExclusao || false,
      }
      await setDoc(ref_, dadosFinal)
      setUltimoSalvo(new Date())
    } finally { setSalvando(false) }
  }, [userId, mesaId])

  // Jogador solicita exclusão
  const solicitarExclusao = useCallback(async () => {
    if (!userId || !mesaId) return
    await updateDoc(doc(db, 'mesas', mesaId, 'fichas', userId), { solicitandoExclusao: true })
  }, [userId, mesaId])

  // Jogador cancela solicitação
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

  // Mestre libera um campo — dot notation garante que só aquele campo é tocado
  const liberarCampo = useCallback(async (uid, campo, liberar) => {
    if (!mesaId || !uid) return
    try {
      const ref_ = doc(db, 'mesas', mesaId, 'fichas', uid)
      if (liberar) {
        // Libera o campo: seta false no Firebase
        await updateDoc(ref_, { [`camposBloqueados.${campo}`]: false })
      } else {
        // Volta a bloquear: seta true
        await updateDoc(ref_, { [`camposBloqueados.${campo}`]: true })
      }
    } catch (e) {
      console.error('Erro ao liberar campo:', e)
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
