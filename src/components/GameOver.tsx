import React from 'react'

interface GameOverProps {
  score: number
  highScore: number
  onRestart: () => void
  onMenu: () => void
}

const GameOver: React.FC<GameOverProps> = ({ score, highScore, onRestart, onMenu }) => {
  const isNewRecord = score >= highScore && score > 0

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 text-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/40 via-gray-900 to-gray-900"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Crash icon */}
        <div className="text-7xl md:text-8xl mb-2">💥</div>

        {/* Game Over text */}
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
          GAME OVER
        </h1>

        {/* New record */}
        {isNewRecord && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg px-4 py-2 animate-pulse">
            <p className="text-yellow-400 font-bold text-sm uppercase tracking-wider">
              🏆 New High Score! 🏆
            </p>
          </div>
        )}

        {/* Score */}
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 min-w-[200px]">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Score</p>
          <p className="text-white text-4xl font-bold">{score.toLocaleString()}</p>
        </div>

        {/* High Score */}
        <div className="text-gray-400 text-sm">
          Best: <span className="text-yellow-400 font-bold">{highScore.toLocaleString()}</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 rounded-xl text-white font-bold text-lg uppercase tracking-wider shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 transition-all duration-200 active:scale-95"
          >
            🔄 Race Again
          </button>
          <button
            onClick={onMenu}
            className="px-8 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white font-bold text-lg uppercase tracking-wider hover:bg-gray-600 hover:scale-105 transition-all duration-200 active:scale-95"
          >
            🏠 Menu
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameOver
