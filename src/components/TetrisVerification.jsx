import React, { useEffect, useMemo } from 'react'
import { useTetrisEngine } from './tetris/useTetrisEngine'
import { TETROMINOES } from './tetris/tetrominoes'
import GamepadControls from './tetris/GamepadControls'

export default function TetrisVerification({ onSuccess, onExit }) {
  const {
    board,
    activeCells,
    ghostCells,
    currentPiece,
    nextPiece,
    linesCleared,
    controls,
    isRunning,
    reset,
  } = useTetrisEngine({ onWin: onSuccess, onFail: () => {} })

  const activeSet = useMemo(() => new Set(activeCells.map(({ x, y }) => `${x}:${y}`)), [activeCells])
  const ghostSet = useMemo(() => new Set(ghostCells.map(({ x, y }) => `${x}:${y}`)), [ghostCells])

  useEffect(() => {
    const handler = (e) => {
      if (!isRunning) return
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          controls.moveLeft()
          break
        case 'ArrowRight':
          e.preventDefault()
          controls.moveRight()
          break
        case 'ArrowUp':
          e.preventDefault()
          controls.rotate()
          break
        case 'ArrowDown':
          e.preventDefault()
          controls.softDropStart()
          break
        default:
      }
    }

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowDown') controls.softDropStop()
    }

    window.addEventListener('keydown', handler)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handler)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [controls, isRunning])

  const previewShape = useMemo(() => TETROMINOES[nextPiece.type].rotations[0], [nextPiece])

  return (
    <div className="tetris-shell">
      <header className="tetris-header">
        <div>
          <h1>Tetris Verification</h1>
          <p>Clear one line to verify your humanity.</p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={onExit}>Exit</button>
      </header>

      <div className="tetris-content">
        <div className="tetris-board" role="grid" aria-label="Tetris board">
          {board.map((row, y) => (
            <div className="tetris-row" key={`row-${y}`}>
              {row.map((cell, x) => {
                const key = `${x}:${y}`
                const isActive = activeSet.has(key)
                const isGhost = ghostSet.has(key) && !isActive
                const color = isActive
                  ? TETROMINOES[currentPiece.type].color
                  : cell?.color || undefined
                return (
                  <div
                    key={key}
                    className={`tetris-cell${isActive ? ' active' : ''}${isGhost ? ' ghost' : ''}`}
                    style={color ? { backgroundColor: color } : undefined}
                  />
                )
              })}
            </div>
          ))}
        </div>

        <aside className="tetris-sidebar">
          <section className="next-piece" aria-label="Next piece preview">
            <h2>Next</h2>
            <div className="preview-grid">
              {previewShape.map((row, y) => (
                <div className="preview-row" key={`preview-${y}`}>
                  {row.map((value, x) => (
                    <div
                      key={`preview-${x}-${y}`}
                      className={`preview-cell${value ? ' filled' : ''}`}
                      style={value ? { backgroundColor: TETROMINOES[nextPiece.type].color } : undefined}
                    />
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="status-panel">
            <p>Lines cleared: {linesCleared}/1</p>
            {!isRunning && linesCleared < 1 && (
              <>
                <p className="status-warning">Stacked out! Tap retry to try again.</p>
                <button className="btn btn-primary" type="button" onClick={reset}>
                  Try again
                </button>
              </>
            )}
          </section>
        </aside>
      </div>

      <GamepadControls
        onLeft={controls.moveLeft}
        onRight={controls.moveRight}
        onRotate={controls.rotate}
        onDropStart={controls.softDropStart}
        onDropEnd={controls.softDropStop}
      />
    </div>
  )
}
