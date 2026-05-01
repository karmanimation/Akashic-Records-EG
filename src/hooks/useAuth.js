// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase/config'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    return onAuthStateChanged(auth, u => { setUser(u); setLoading(false) })
  }, [])

  const register = async (email, password, nome) => {
    setError(null)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: nome })
      setUser({ ...cred.user, displayName: nome })
    } catch (e) { setError(erro(e.code)) }
  }

  const login = async (email, password) => {
    setError(null)
    try { await signInWithEmailAndPassword(auth, email, password) }
    catch (e) { setError(erro(e.code)) }
  }

  const resetPassword = async (email) => {
    setError(null)
    try {
      await sendPasswordResetEmail(auth, email)
      return true
    } catch (e) {
      setError(erro(e.code))
      return false
    }
  }

  const logout = () => signOut(auth)

  return { user, loading, error, register, login, resetPassword, logout }
}

function erro(code) {
  if (code === 'auth/missing-email') return 'Informe o e-mail da conta.'
  if (code === 'auth/too-many-requests') return 'Muitas tentativas. Aguarde um pouco e tente novamente.'
  return {
    'auth/email-already-in-use': 'E-mail já em uso.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/weak-password': 'Senha fraca — mínimo 6 caracteres.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'Credenciais inválidas.'
  }[code] || 'Erro desconhecido.'
}
