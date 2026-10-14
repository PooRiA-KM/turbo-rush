import React from 'react'

interface MainMenuProps {
  onStart: () => void
  highScore: number
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, highScore }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 text-center">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute top-0 left-1/2 w-1 h-full bg-yellow-400 opacity-20 animate-pulse"></div>
        <div className="absolute top-0 left-1/3 w-1 h-full bg-white opacity-10 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-0 right-1/3 w-1 h-full bg-white opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="mb-4">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 tracking-tight">
            TURBO RUSH
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-2 tracking-widest uppercase">
            Motor Racing
          </p>
        </div>

        {/* Car icon */}
        <div className="text-6xl md:text-8xl mb-4 animate-bounce">
          🏎️
        </div>

        {/* High Score */}
        {highScore > 0 && (
          <div className="bg-gray-800/80 backdrop-blur-sm border border-yellow-500/30 rounded-lg px-6 py-3">
            <p className="text-yellow-400 text-sm uppercase tracking-wider">High Score</p>
            <p className="text-white text-2xl font-bold">{highScore.toLocaleString()}</p>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={onStart}
          className="group relative px-12 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white font-bold text-xl uppercase tracking-wider shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 transition-all duration-200 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            <span>🏁</span>
            <span>Start Race</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </button>

        {/* Controls info */}
        <div className="mt-8 bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 md:p-6 max-w-md border border-gray-700">
          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Controls</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">←</kbd>
              <span>Move Left</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">→</kbd>
              <span>Move Right</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">↑</kbd>
              <span>Accelerate</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">↓</kbd>
              <span>Brake</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-3">Touch controls available on mobile</p>
        </div>
      </div>
    </div>
  )
}

export default MainMenu
