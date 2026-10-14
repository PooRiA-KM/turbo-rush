import React, { useRef, useEffect, useCallback, useState } from 'react'

// Polyfill for roundRect
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x: number, y: number, w: number, h: number, radii: number | number[]) {
    const r = Array.isArray(radii) ? radii : [radii, radii, radii, radii]
    this.moveTo(x + r[0], y)
    this.lineTo(x + w - r[1], y)
    this.quadraticCurveTo(x + w, y, x + w, y + r[1])
    this.lineTo(x + w, y + h - r[2])
    this.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h)
    this.lineTo(x + r[3], y + h)
    this.quadraticCurveTo(x, y + h, x, y + h - r[3])
    this.lineTo(x, y + r[0])
    this.quadraticCurveTo(x, y, x + r[0], y)
    this.closePath()
    return this
  }
}

interface GameProps {
  onGameOver: (score: number) => void
}

interface Car {
  x: number
  y: number
  width: number
  height: number
  speed: number
  color: string
  lane: number
}

interface RoadMark {
  y: number
}

const LANE_COUNT = 4
const CAR_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#e67e22']

const Game: React.FC<GameProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const gameStateRef = useRef({
    playerX: 0,
    playerY: 0,
    playerWidth: 40,
    playerHeight: 70,
    speed: 5,
    maxSpeed: 15,
    minSpeed: 3,
    score: 0,
    enemies: [] as Car[],
    roadMarks: [] as RoadMark[],
    roadOffset: 0,
    keys: {} as Record<string, boolean>,
    touchLeft: false,
    touchRight: false,
    touchUp: false,
    touchDown: false,
    canvasWidth: 0,
    canvasHeight: 0,
    roadWidth: 0,
    roadLeft: 0,
    laneWidth: 0,
    lastEnemySpawn: 0,
    enemySpawnInterval: 1500,
    difficulty: 1,
    isRunning: true,
    frameCount: 0,
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
  })

  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [level, setLevel] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const isPausedRef = useRef(false)

  const initGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = containerRef.current
    if (!container) return

    // Use window dimensions for reliable sizing in standalone mode
    const width = window.innerWidth
    const height = window.innerHeight
    
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    const state = gameStateRef.current
    state.canvasWidth = width
    state.canvasHeight = height
    state.roadWidth = Math.min(width * 0.75, 350)
    state.roadLeft = (width - state.roadWidth) / 2
    state.laneWidth = state.roadWidth / LANE_COUNT
    state.playerWidth = Math.max(30, state.laneWidth * 0.55)
    state.playerHeight = state.playerWidth * 1.7
    state.playerX = state.roadLeft + state.roadWidth / 2 - state.playerWidth / 2
    state.playerY = height - state.playerHeight - 80
    state.speed = 5
    state.score = 0
    state.enemies = []
    state.difficulty = 1
    state.frameCount = 0
    state.particles = []
    state.lastEnemySpawn = 0
    state.isRunning = true

    // Initialize road marks
    state.roadMarks = []
    const markSpacing = 60
    for (let y = -markSpacing; y < height + markSpacing; y += markSpacing) {
      state.roadMarks.push({ y })
    }
  }, [])

  const spawnEnemy = useCallback(() => {
    const state = gameStateRef.current
    const lane = Math.floor(Math.random() * LANE_COUNT)
    const carWidth = Math.max(30, state.laneWidth * 0.55)
    const carHeight = carWidth * 1.7

    // Check if there's already a car in this lane near the top
    const tooClose = state.enemies.some(
      e => e.lane === lane && e.y < carHeight * 2
    )
    if (tooClose) return

    const enemy: Car = {
      x: state.roadLeft + lane * state.laneWidth + (state.laneWidth - carWidth) / 2,
      y: -carHeight,
      width: carWidth,
      height: carHeight,
      speed: 2 + Math.random() * 3,
      color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)],
      lane,
    }
    state.enemies.push(enemy)
  }, [])

  const checkCollision = useCallback((a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) => {
    const padding = 5
    return (
      a.x + padding < b.x + b.width - padding &&
      a.x + a.width - padding > b.x + padding &&
      a.y + padding < b.y + b.height - padding &&
      a.y + a.height - padding > b.y + padding
    )
  }, [])

  const createExplosion = useCallback((x: number, y: number) => {
    const state = gameStateRef.current
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20
      const speed = 2 + Math.random() * 4
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30 + Math.random() * 20,
        color: ['#ff4444', '#ff8800', '#ffff00', '#ffffff'][Math.floor(Math.random() * 4)],
      })
    }
  }, [])

  const drawCar = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string, isPlayer: boolean) => {
    const w = width
    const h = height

    // Car body
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(x + w * 0.1, y + h * 0.1, w * 0.8, h * 0.8, [w * 0.15, w * 0.15, w * 0.05, w * 0.05])
    ctx.fill()

    // Car roof/cabin
    ctx.fillStyle = isPlayer ? '#1a1a2e' : '#2c3e50'
    ctx.beginPath()
    ctx.roundRect(x + w * 0.2, y + h * 0.3, w * 0.6, h * 0.35, w * 0.08)
    ctx.fill()

    // Windshield
    ctx.fillStyle = isPlayer ? '#4a90d9' : '#5dade2'
    ctx.globalAlpha = 0.7
    ctx.beginPath()
    ctx.roundRect(x + w * 0.22, y + h * 0.32, w * 0.56, h * 0.15, w * 0.05)
    ctx.fill()
    ctx.globalAlpha = 1

    // Headlights/taillights
    if (isPlayer) {
      // Front headlights (top of car since car faces up)
      ctx.fillStyle = '#ffff00'
      ctx.beginPath()
      ctx.ellipse(x + w * 0.25, y + h * 0.12, w * 0.08, w * 0.06, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(x + w * 0.75, y + h * 0.12, w * 0.08, w * 0.06, 0, 0, Math.PI * 2)
      ctx.fill()

      // Rear lights
      ctx.fillStyle = '#ff0000'
      ctx.beginPath()
      ctx.ellipse(x + w * 0.25, y + h * 0.88, w * 0.08, w * 0.05, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(x + w * 0.75, y + h * 0.88, w * 0.08, w * 0.05, 0, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Enemy cars face down, so lights at bottom
      ctx.fillStyle = '#ff0000'
      ctx.beginPath()
      ctx.ellipse(x + w * 0.25, y + h * 0.12, w * 0.08, w * 0.06, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(x + w * 0.75, y + h * 0.12, w * 0.08, w * 0.06, 0, 0, Math.PI * 2)
      ctx.fill()

      // Headlights at bottom
      ctx.fillStyle = '#ffff00'
      ctx.beginPath()
      ctx.ellipse(x + w * 0.25, y + h * 0.88, w * 0.08, w * 0.05, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(x + w * 0.75, y + h * 0.88, w * 0.08, w * 0.05, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    // Side mirrors
    ctx.fillStyle = '#333'
    ctx.fillRect(x, y + h * 0.35, w * 0.08, h * 0.08)
    ctx.fillRect(x + w * 0.92, y + h * 0.35, w * 0.08, h * 0.08)

    // Racing stripe for player
    if (isPlayer) {
      ctx.fillStyle = '#ffffff'
      ctx.globalAlpha = 0.3
      ctx.fillRect(x + w * 0.45, y + h * 0.1, w * 0.1, h * 0.8)
      ctx.globalAlpha = 1
    }
  }, [])

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = gameStateRef.current

    // If paused, just redraw without updating
    if (isPausedRef.current) {
      animationRef.current = requestAnimationFrame(gameLoop)
      return
    }

    state.frameCount++

    // Update particles even after game over
    state.particles = state.particles.filter(p => {
      p.x += p.vx
      p.y += p.vy
      p.life -= 1
      p.vy += 0.1
      return p.life > 0
    })

    if (!state.isRunning) {
      // Still render the scene with particles
      const w = state.canvasWidth
      const h = state.canvasHeight

      ctx.fillStyle = '#2d5a27'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#333333'
      ctx.fillRect(state.roadLeft, 0, state.roadWidth, h)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(state.roadLeft - 3, 0, 3, h)
      ctx.fillRect(state.roadLeft + state.roadWidth, 0, 3, h)

      state.enemies.forEach(enemy => {
        drawCar(ctx, enemy.x, enemy.y, enemy.width, enemy.height, enemy.color, false)
      })

      // Draw particles
      state.particles.forEach(p => {
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life / 50
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3 + Math.random() * 3, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      animationRef.current = requestAnimationFrame(gameLoop)
      return
    }

    // Handle input
    const moveSpeed = 5
    if (state.keys['ArrowLeft'] || state.keys['a'] || state.touchLeft) {
      state.playerX -= moveSpeed
    }
    if (state.keys['ArrowRight'] || state.keys['d'] || state.touchRight) {
      state.playerX += moveSpeed
    }
    if (state.keys['ArrowUp'] || state.keys['w'] || state.touchUp) {
      state.speed = Math.min(state.speed + 0.1, state.maxSpeed)
    }
    if (state.keys['ArrowDown'] || state.keys['s'] || state.touchDown) {
      state.speed = Math.max(state.speed - 0.15, state.minSpeed)
    }

    // Keep player on road
    state.playerX = Math.max(state.roadLeft + 5, Math.min(state.roadLeft + state.roadWidth - state.playerWidth - 5, state.playerX))

    // Update road marks
    state.roadOffset += state.speed
    state.roadMarks.forEach(mark => {
      mark.y += state.speed
      if (mark.y > state.canvasHeight + 60) {
        mark.y -= (state.roadMarks.length) * 60
      }
    })

    // Spawn enemies
    state.lastEnemySpawn += 16
    const spawnInterval = Math.max(600, state.enemySpawnInterval - state.difficulty * 50)
    if (state.lastEnemySpawn > spawnInterval) {
      spawnEnemy()
      state.lastEnemySpawn = 0
    }

    // Update enemies
    state.enemies = state.enemies.filter(enemy => {
      enemy.y += state.speed - enemy.speed + 2
      return enemy.y < state.canvasHeight + 100
    })

    // Check collisions
    const player = {
      x: state.playerX,
      y: state.playerY,
      width: state.playerWidth,
      height: state.playerHeight,
    }

    for (const enemy of state.enemies) {
      if (checkCollision(player, enemy)) {
        createExplosion(
          state.playerX + state.playerWidth / 2,
          state.playerY + state.playerHeight / 2
        )
        state.isRunning = false
        setTimeout(() => {
          onGameOver(state.score)
        }, 800)
        break
      }
    }

    // Update score
    state.score += Math.floor(state.speed)
    state.difficulty = 1 + Math.floor(state.score / 500)

    // Update UI state
    if (state.frameCount % 10 === 0) {
      setScore(state.score)
      setSpeed(Math.floor(state.speed * 15))
      setLevel(state.difficulty)
    }

    // === RENDER ===
    const w = state.canvasWidth
    const h = state.canvasHeight

    // Clear
    ctx.fillStyle = '#2d5a27'
    ctx.fillRect(0, 0, w, h)

    // Grass texture
    ctx.fillStyle = '#245020'
    for (let i = 0; i < 30; i++) {
      const gx = (i * 137 + state.frameCount * 0.5) % w
      const gy = (i * 89 + state.roadOffset * 0.3) % h
      ctx.fillRect(gx, gy, 3, 8)
    }

    // Road
    ctx.fillStyle = '#333333'
    ctx.fillRect(state.roadLeft, 0, state.roadWidth, h)

    // Road edges
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(state.roadLeft - 3, 0, 3, h)
    ctx.fillRect(state.roadLeft + state.roadWidth, 0, 3, h)

    // Road edge rumble strips
    const rumbleSize = 15
    for (let y = -rumbleSize; y < h + rumbleSize; y += rumbleSize * 2) {
      const ry = (y + state.roadOffset % (rumbleSize * 2))
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(state.roadLeft - 8, ry, 5, rumbleSize)
      ctx.fillRect(state.roadLeft + state.roadWidth + 3, ry, 5, rumbleSize)
    }

    // Lane markings
    ctx.fillStyle = '#ffffff'
    state.roadMarks.forEach(mark => {
      for (let i = 1; i < LANE_COUNT; i++) {
        const lx = state.roadLeft + i * state.laneWidth - 2
        ctx.fillRect(lx, mark.y, 4, 30)
      }
    })

    // Draw enemies
    state.enemies.forEach(enemy => {
      drawCar(ctx, enemy.x, enemy.y, enemy.width, enemy.height, enemy.color, false)
    })

    // Draw player
    if (state.isRunning || state.frameCount % 4 < 2) {
      drawCar(ctx, state.playerX, state.playerY, state.playerWidth, state.playerHeight, '#00d4ff', true)
    }

    // Speed lines effect
    if (state.speed > 8) {
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        const lx = state.roadLeft + Math.random() * state.roadWidth
        const ly = Math.random() * h
        ctx.beginPath()
        ctx.moveTo(lx, ly)
        ctx.lineTo(lx, ly + 20 + state.speed * 2)
        ctx.stroke()
      }
    }

    // Draw particles
    state.particles.forEach(p => {
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.life / 50
      ctx.beginPath()
      ctx.arc(p.x, p.y, 3 + Math.random() * 3, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.globalAlpha = 1

    animationRef.current = requestAnimationFrame(gameLoop)
  }, [onGameOver, spawnEnemy, checkCollision, createExplosion, drawCar])

  useEffect(() => {
    initGame()

    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key] = true
      if (e.key === 'Escape') {
        setIsPaused(p => {
          const newPaused = !p
          isPausedRef.current = newPaused
          return newPaused
        })
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    animationRef.current = requestAnimationFrame(gameLoop)

    const handleResize = () => {
      initGame()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initGame, gameLoop])

  // Touch handlers
  const handleTouchStart = (direction: string) => {
    const state = gameStateRef.current
    if (direction === 'left') state.touchLeft = true
    if (direction === 'right') state.touchRight = true
    if (direction === 'up') state.touchUp = true
    if (direction === 'down') state.touchDown = true
  }

  const handleTouchEnd = (direction: string) => {
    const state = gameStateRef.current
    if (direction === 'left') state.touchLeft = false
    if (direction === 'right') state.touchRight = false
    if (direction === 'up') state.touchUp = false
    if (direction === 'down') state.touchDown = false
  }

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col" style={{ height: '100dvh' }}>
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start p-2 md:p-4 pointer-events-none" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Score</p>
          <p className="text-white text-lg md:text-2xl font-bold">{score.toLocaleString()}</p>
        </div>
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Level</p>
          <p className="text-purple-400 text-lg md:text-2xl font-bold">{level}</p>
        </div>
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Speed</p>
          <p className="text-green-400 text-lg md:text-2xl font-bold">{speed} <span className="text-xs">km/h</span></p>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />

      {/* Touch Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-20 p-3 md:p-4 pointer-events-none" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <div className="flex justify-between items-end max-w-lg mx-auto">
          {/* Left/Right controls */}
          <div className="flex gap-2 pointer-events-auto">
            <button
              onTouchStart={(e) => { e.preventDefault(); handleTouchStart('left') }}
              onTouchEnd={() => handleTouchEnd('left')}
              onMouseDown={() => handleTouchStart('left')}
              onMouseUp={() => handleTouchEnd('left')}
              onMouseLeave={() => handleTouchEnd('left')}
              className="w-14 h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white text-2xl active:bg-white/30 transition-colors select-none"
            >
              ◀
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); handleTouchStart('right') }}
              onTouchEnd={() => handleTouchEnd('right')}
              onMouseDown={() => handleTouchStart('right')}
              onMouseUp={() => handleTouchEnd('right')}
              onMouseLeave={() => handleTouchEnd('right')}
              className="w-14 h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white text-2xl active:bg-white/30 transition-colors select-none"
            >
              ▶
            </button>
          </div>

          {/* Up/Down controls */}
          <div className="flex flex-col gap-2 pointer-events-auto">
            <button
              onTouchStart={(e) => { e.preventDefault(); handleTouchStart('up') }}
              onTouchEnd={() => handleTouchEnd('up')}
              onMouseDown={() => handleTouchStart('up')}
              onMouseUp={() => handleTouchEnd('up')}
              onMouseLeave={() => handleTouchEnd('up')}
              className="w-14 h-14 md:w-16 md:h-16 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl flex items-center justify-center text-white text-2xl active:bg-green-500/40 transition-colors select-none"
            >
              ▲
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); handleTouchStart('down') }}
              onTouchEnd={() => handleTouchEnd('down')}
              onMouseDown={() => handleTouchStart('down')}
              onMouseUp={() => handleTouchEnd('down')}
              onMouseLeave={() => handleTouchEnd('down')}
              className="w-14 h-14 md:w-16 md:h-16 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl flex items-center justify-center text-white text-2xl active:bg-red-500/40 transition-colors select-none"
            >
              ▼
            </button>
          </div>
        </div>
      </div>

      {/* Pause overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-30 bg-black/70 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-3xl font-bold mb-4">PAUSED</p>
            <p className="text-gray-400">Press ESC to resume</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Game
