// src/App.jsx
import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useMesas } from './hooks/useMesas'
import { useFicha } from './hooks/useFicha'
import Login from './components/Login'
import Lobby from './components/Lobby'
import Ficha from './components/Ficha'
import PainelMestre from './components/PainelMestre'

export default function App() {
  const { user, loading, error, login, register, logout } = useAuth()
  const { mesas, criarMesa, entrarMesa } = useMesas(user)
  const [mesaSelecionada, setMesaSelecionada] = useState(null)

  const ehMestre = mesaSelecionada && mesaSelecionada.mestreId === user?.uid

  // Hook da ficha — só ativo quando o jogador entra em mesa
  const { ficha, setFicha, salvar, salvando, ultimoSalvo, solicitarExclusao, cancelarExclusao } =
    useFicha(!ehMestre ? user?.uid : null, !ehMestre ? mesaSelecionada?.id : null)

  if (loading) return <Splash texto="CARREGANDO..." />
  if (!user) return <Login login={login} register={register} error={error} />

  if (!mesaSelecionada) {
    return (
      <Lobby
        user={user}
        mesas={mesas}
        criarMesa={criarMesa}
        entrarMesa={entrarMesa}
        onSelecionarMesa={setMesaSelecionada}
        logout={logout}
      />
    )
  }

  if (ehMestre) {
    return <PainelMestre mesa={mesaSelecionada} onVoltar={() => setMesaSelecionada(null)} />
  }

  return (
    <Ficha
      ficha={ficha}
      setFicha={setFicha}
      salvar={salvar}
      salvando={salvando}
      ultimoSalvo={ultimoSalvo}
      solicitarExclusao={solicitarExclusao}
      cancelarExclusao={cancelarExclusao}
      onVoltar={() => setMesaSelecionada(null)}
    />
  )
}

function Splash({ texto }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Share Tech Mono,monospace', fontSize: 11, letterSpacing: 3, color: '#3a4560' }}>
      {texto}
    </div>
  )
}
