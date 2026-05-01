// src/App.jsx
import { useState, lazy, Suspense } from 'react'
import { useAuth } from './hooks/useAuth'
import { useMesas } from './hooks/useMesas'
import { useFicha } from './hooks/useFicha'
import Login from './components/Login'
import Lobby from './components/Lobby'
const Ficha = lazy(() => import('./components/Ficha'))
const PainelMestre = lazy(() => import('./components/PainelMestre'))
const FichasPublicas = lazy(() => import('./components/FichasPublicas'))

export default function App() {
  const { user, loading, error, login, register, resetPassword, logout } = useAuth()
  const { mesas, criarMesa, entrarMesa, excluirMesa, salvarCapaMesa } = useMesas(user)
  const [mesaSelecionada, setMesaSelecionada] = useState(null)
  const [visualizandoFichas, setVisualizandoFichas] = useState(false)
  const [origemVisualizacao, setOrigemVisualizacao] = useState('ficha')

  const ehMestre = mesaSelecionada && mesaSelecionada.mestreId === user?.uid

  // Hook da ficha — só ativo quando o jogador entra em mesa
  const { ficha, setFicha, salvar, salvando, ultimoSalvo, solicitarExclusao, cancelarExclusao } =
    useFicha(!ehMestre ? user?.uid : null, !ehMestre ? mesaSelecionada?.id : null)

  if (loading) return <Splash texto="CARREGANDO..." />
  if (!user) return <Login login={login} register={register} resetPassword={resetPassword} error={error} />

  if (!mesaSelecionada) {
    return (
      <Lobby
        user={user}
        mesas={mesas}
        criarMesa={criarMesa}
        entrarMesa={entrarMesa}
        salvarCapaMesa={salvarCapaMesa}
        onSelecionarMesa={(mesa) => { setMesaSelecionada(mesa); setVisualizandoFichas(false); setOrigemVisualizacao('ficha') }}
        onVisualizarFichas={(mesa) => { setMesaSelecionada(mesa); setVisualizandoFichas(true); setOrigemVisualizacao('lobby') }}
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

  if (visualizandoFichas) {
    return (
      <Suspense fallback={<Splash texto="CARREGANDO FICHAS..." />}>
        <FichasPublicas
          mesa={mesaSelecionada}
          voltarLabel={origemVisualizacao === 'lobby' ? 'VOLTAR AS MESAS' : 'VOLTAR A FICHA'}
          onVoltar={() => {
            setVisualizandoFichas(false)
            if (origemVisualizacao === 'lobby') setMesaSelecionada(null)
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
        onAbrirVisaoMesa={() => { setOrigemVisualizacao('ficha'); setVisualizandoFichas(true) }}
        onVoltar={() => { setVisualizandoFichas(false); setMesaSelecionada(null) }}
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
