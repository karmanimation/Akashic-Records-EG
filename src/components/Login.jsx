// src/components/Login.jsx
import { useState } from 'react'
import { Sigil } from './UI'

export default function Login({ login, register, resetPassword, error }) {
  const [modo, setModo] = useState('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [mensagem, setMensagem] = useState('')

  const submit = async e => {
    e.preventDefault()
    setMensagem('')
    if (modo === 'login') await login(email, senha)
    else if (modo === 'reset') {
      const ok = await resetPassword(email)
      if (ok) setMensagem('Enviamos um portal de redefinicao para o seu e-mail.')
    } else await register(email, senha, nome)
  }

  const alternarLoginRegistro = () => {
    setModo(m => m === 'login' ? 'registro' : 'login')
    setMensagem('')
  }

  const inp = { marginBottom: 16 }
  const lbl = { display: 'block', fontFamily: 'Share Tech Mono,monospace', fontSize: 9, letterSpacing: 2, color: '#3a4560', textTransform: 'uppercase', marginBottom: 5 }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'linear-gradient(160deg,#0d0e18,#09090f)',
        border: '1px solid #1a1d35',
        boxShadow: '0 0 80px rgba(200,169,110,0.05)',
        padding: '44px 36px', position: 'relative'
      }}>
        {[
          { top: 0, left: 0, borderWidth: '1px 0 0 1px' },
          { top: 0, right: 0, borderWidth: '1px 1px 0 0' },
          { bottom: 0, left: 0, borderWidth: '0 0 1px 1px' },
          { bottom: 0, right: 0, borderWidth: '0 1px 1px 0' },
        ].map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: 48, height: 48, borderColor: '#c8a96e', borderStyle: 'solid', opacity: 0.3, ...s }} />
        ))}

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><Sigil size={52} /></div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 20, fontWeight: 700, color: '#c8a96e', letterSpacing: 4 }}>AKASHIC RECORDS</div>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 10, color: '#3a4560', letterSpacing: 2, marginTop: 2 }}>ENTRE GALAXIAS</div>
          <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: 9, color: '#2a3050', letterSpacing: 2, marginTop: 4 }}>
            {modo === 'login' ? 'ACESSO AO SISTEMA' : modo === 'reset' ? 'RECUPERACAO DE ACESSO' : 'REGISTRO DE AGENTE'}
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(150,30,30,0.12)', border: '1px solid #5a2020', color: '#c06060', fontFamily: 'Share Tech Mono,monospace', fontSize: 11, padding: '9px 12px', borderRadius: 2, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {mensagem && (
          <div style={{ background: 'rgba(74,154,186,0.1)', border: '1px solid #4a9aba55', color: '#4a9aba', fontFamily: 'Share Tech Mono,monospace', fontSize: 11, padding: '9px 12px', borderRadius: 2, marginBottom: 16 }}>
            {mensagem}
          </div>
        )}

        <form onSubmit={submit}>
          {modo === 'registro' && (
            <div style={inp}>
              <label style={lbl}>Seu nome</label>
              <input value={nome} onChange={e => setNome(e.target.value)} required placeholder="Como quer ser chamado..." />
            </div>
          )}
          <div style={inp}>
            <label style={lbl}>E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seu@email.com" />
          </div>
          {modo !== 'reset' && (
            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>Senha</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required placeholder="********" />
            </div>
          )}
          <button type="submit" style={{
            width: '100%', padding: '11px',
            background: 'rgba(200,169,110,0.08)', border: '1px solid #c8a96e55',
            color: '#c8a96e', fontFamily: 'Cinzel,serif', fontSize: 12,
            letterSpacing: 3, cursor: 'pointer', borderRadius: 2, transition: 'all 0.2s'
          }}
            onMouseEnter={e => e.target.style.background = 'rgba(200,169,110,0.15)'}
            onMouseLeave={e => e.target.style.background = 'rgba(200,169,110,0.08)'}
          >{modo === 'login' ? 'ACESSAR' : modo === 'reset' ? 'RECUPERAR SENHA' : 'REGISTRAR'}</button>
        </form>

        {modo === 'login' && (
          <button onClick={() => { setModo('reset'); setMensagem('') }} style={{
            display: 'block', margin: '14px auto 0', background: 'transparent', border: 'none',
            color: '#4a6080', fontFamily: 'Share Tech Mono,monospace', fontSize: 9,
            letterSpacing: 1, cursor: 'pointer', textDecoration: 'underline'
          }}>
            Esqueci minha senha
          </button>
        )}

        <button onClick={alternarLoginRegistro} style={{
          display: 'block', margin: '16px auto 0', background: 'transparent', border: 'none',
          color: '#3a4560', fontFamily: 'Crimson Text,serif', fontSize: 14,
          cursor: 'pointer', textDecoration: 'underline'
        }}>
          {modo === 'login' ? 'Criar nova conta' : 'Ja tenho uma conta'}
        </button>
      </div>
    </div>
  )
}
