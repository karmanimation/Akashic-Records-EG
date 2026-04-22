// src/hooks/useFicha.js
import { useState, useEffect, useCallback } from 'react'
import { doc, setDoc, onSnapshot, collection } from 'firebase/firestore'
import { db } from '../firebase/config'
import { fichaInicial } from '../data/sistema'

// Ficha de um jogador numa mesa específica
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

  return { ficha, setFicha, salvar, salvando, ultimoSalvo }
}

// Todas as fichas de uma mesa (para o Mestre)
export function useFichasMesa(mesaId) {
  const [fichas, setFichas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mesaId) return
    const carregar = async () => {
      const snap = await getDocs(collection(db, 'mesas', mesaId, 'fichas'))
      setFichas(snap.docs.map(d => ({ uid: d.id, ...d.data() })))
      setLoading(false)
    }
    carregar()
    // Listener em tempo real
    return onSnapshot(collection(db, 'mesas', mesaId, 'fichas'), snap => {
      setFichas(snap.docs.map(d => ({ uid: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [mesaId])

  return { fichas, loading }
}
