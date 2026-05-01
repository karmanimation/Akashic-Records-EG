// src/hooks/useMesas.js
import { useState, useEffect } from 'react'
import {
  collection, doc, setDoc, getDoc, onSnapshot, deleteDoc,
  query, where, arrayUnion, serverTimestamp, getDocs, writeBatch
} from 'firebase/firestore'
import { db } from '../firebase/config'

// Gera código de 6 chars
function gerarCodigo() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function useMesas(user) {
  const [mesas, setMesas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    // Mesas onde o user é mestre OU jogador
    const qMestre = query(collection(db, 'mesas'), where('mestreId', '==', user.uid))
    const qJogador = query(collection(db, 'mesas'), where('jogadoresIds', 'array-contains', user.uid))

    const set1 = new Map()
    const set2 = new Map()

    const merge = () => {
      const todas = new Map([...set1, ...set2])
      setMesas(Array.from(todas.values()))
      setLoading(false)
    }

    const u1 = onSnapshot(qMestre, snap => {
      snap.docs.forEach(d => set1.set(d.id, { id: d.id, ...d.data() }))
      snap.docChanges().forEach(ch => { if (ch.type === 'removed') set1.delete(ch.doc.id) })
      merge()
    })

    const u2 = onSnapshot(qJogador, snap => {
      snap.docs.forEach(d => set2.set(d.id, { id: d.id, ...d.data() }))
      snap.docChanges().forEach(ch => { if (ch.type === 'removed') set2.delete(ch.doc.id) })
      merge()
    })

    return () => { u1(); u2() }
  }, [user])

  // Criar mesa (usuário vira Mestre)
  const criarMesa = async (nome, user, capaURL = '') => {
    const codigo = gerarCodigo()
    const id = `mesa_${codigo}`
    await setDoc(doc(db, 'mesas', id), {
      nome,
      capaURL,
      codigo,
      mestreId: user.uid,
      mestreNome: user.displayName || user.email,
      jogadoresIds: [],
      jogadores: [],
      criadaEm: serverTimestamp()
    })
    return codigo
  }

  const salvarCapaMesa = async (mesaId, capaURL) => {
    if (!mesaId) return
    await setDoc(doc(db, 'mesas', mesaId), { capaURL }, { merge: true })
  }

  // Entrar em mesa pelo código
  const entrarMesa = async (codigo, user) => {
    const id = `mesa_${codigo.toUpperCase()}`
    const ref = doc(db, 'mesas', id)
    const snap = await getDoc(ref)
    if (!snap.exists()) throw new Error('Mesa não encontrada.')
    const data = snap.data()
    if (data.mestreId === user.uid) throw new Error('Você é o Mestre desta mesa.')
    if (data.jogadoresIds?.includes(user.uid)) throw new Error('Você já está nesta mesa.')
    await setDoc(ref, {
      jogadoresIds: arrayUnion(user.uid),
      jogadores: arrayUnion({ uid: user.uid, nome: user.displayName || user.email })
    }, { merge: true })
    return data.nome
  }

  const excluirMesa = async (mesaId) => {
    try {
      const mesaRef = doc(db, 'mesas', mesaId)
      const fichasSnap = await getDocs(collection(db, 'mesas', mesaId, 'fichas'))
      const npcsSnap = await getDocs(collection(db, 'mesas', mesaId, 'npcs'))
      const resumosSnap = await getDocs(collection(db, 'mesas', mesaId, 'resumos'))
      const docsParaExcluir = [...fichasSnap.docs, ...npcsSnap.docs, ...resumosSnap.docs]

      for (let i = 0; i < docsParaExcluir.length; i += 499) {
        const batch = writeBatch(db)
        docsParaExcluir.slice(i, i + 499).forEach(d => batch.delete(d.ref))
        await batch.commit()
      }

      await deleteDoc(mesaRef)
    } catch (e) {
      alert('Erro ao excluir mesa: ' + e.message)
    }
  }

  return { mesas, loading, criarMesa, entrarMesa, excluirMesa, salvarCapaMesa }
}
