// src/App.jsx
import { useState, lazy, Suspense } from 'react'
import { useAuth } from './hooks/useAuth'
import { useMesas } from './hooks/useMesas'
import { useFicha } from './hooks/useFicha'
import Login from './components/Login'
import Lobby from './components/Lobby'
const Ficha = lazy(() => import('./components/Ficha'))
const PainelMestre = lazy(() => import('./components/PainelMestre'))

export default function App() {
  const { user, loading, error, login, register, logout } = useAuth()
  const { mesas, criarMesa, entrarMesa, excluirMesa } = useMesas(user)
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
  return (
    <Suspense fallback={<Splash texto="CARREGANDO PAINEL..." />}>
      <PainelMestre
        mesa={mesaSelecionada}
        onVoltar={() => setMesaSelecionada(null)}
        excluirMesa={async () => {
          await excluirMesa(mesaSelecionada.id)
          setMesaSelecionada(null)
        }}
      />
    </Suspense>
  )
}
   return (
    <Suspense fallback={<Splash texto="CARREGANDO FICHA..." />}>
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
    </Suspense>
  )
}

function Splash({ texto }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Share Tech Mono,monospace', fontSize: 11, letterSpacing: 3, color: '#3a4560' }}>
      {texto}
    </div>
  )
}
