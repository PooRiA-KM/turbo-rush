import { useState } from 'react'
import Game from './components/Game'
import MainMenu from './components/MainMenu'
import GameOver from './components/GameOver'

export type GameState = 'menu' | 'playing' | 'gameover'

function App() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('turboRushHighScore')
    return saved ? parseInt(saved) : 0
  })

  const handleStart = () => {
    setScore(0)
    setGameState('playing')
  }

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore)
    if (finalScore > highScore) {
      setHighScore(finalScore)
      localStorage.setItem('turboRushHighScore', finalScore.toString())
    }
    setGameState('gameover')
  }

  const handleRestart = () => {
    setScore(0)
    setGameState('playing')
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-900 flex items-center justify-center">
      {/* Landscape warning for mobile */}
      <div className="landscape-warning">
        <div className="text-6xl mb-4">📱</div>
        <p className="text-xl font-bold mb-2">Please rotate your device</p>
        <p className="text-gray-400">This game is designed for portrait mode</p>
      </div>

      {gameState === 'menu' && (
        <MainMenu onStart={handleStart} highScore={highScore} />
      )}
      {gameState === 'playing' && (
        <Game onGameOver={handleGameOver} />
      )}
      {gameState === 'gameover' && (
        <GameOver
          score={score}
          highScore={highScore}
          onRestart={handleRestart}
          onMenu={() => setGameState('menu')}
        />
      )}
    </div>
  )
}

export default App
