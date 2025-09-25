import React, { useEffect, useMemo } from 'react'
import '../tetrisGame.css'
import { useTetrisEngine } from './tetris/useTetrisEngine'
import { TETROMINOES } from './tetris/tetrominoes'
import GamepadControls from './tetris/GamepadControls'

const BLOCK_FILL = 'rgba(42, 64, 42, 0.85)'

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
    gameOver,
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
          controls.hardDrop()
          break
        default:
      }
    }

    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [controls, isRunning])

  const previewShape = useMemo(() => TETROMINOES[nextPiece.type].rotations[0], [nextPiece])

  return (
  <div className="landing verification-game tetris-verify">
      <header className="verification-header">
        <div>
          <h1>Tetris Verification</h1>
          <p>Clear one line to verify your humanity.</p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={onExit}>Exit</button>
      </header>

      <div className="gb-shell gb-shell--xl">
        <div className="gb-screen gb-screen--tetris">
          <div className="gb-layout">
            <div className="gb-playfield" role="grid" aria-label="Tetris board">
              {board.map((row, y) => (
                <div className="gb-row" key={`row-${y}`}>
                  {row.map((cell, x) => {
                    const key = `${x}:${y}`
                    const isActive = activeSet.has(key)
                    const isGhost = ghostSet.has(key) && !isActive
                    const color = (isActive || cell) ? BLOCK_FILL : undefined
                    return (
                      <div
                        key={key}
                        className={`gb-cell${isActive ? ' active' : ''}${isGhost ? ' ghost' : ''}`}
                        style={color ? { backgroundColor: color } : undefined}
                      />
                    )
                  })}
                </div>
              ))}
            </div>

            <aside className="gb-scorecol">
              <div className="gb-box gb-lines">
                <div className="gb-box-title">LINES</div>
                <div className="gb-box-value">{linesCleared}</div>
              </div>
              <div className="gb-box gb-next" aria-label="Next piece preview">
                <div className="gb-box-title">NEXT</div>
                <div className="gb-next-grid">
                  {previewShape.map((row, y) => (
                    <div className="gb-next-row" key={`preview-${y}`}>
                      {row.map((value, x) => (
                        <div
                          key={`preview-${x}-${y}`}
                          className={`gb-next-cell${value ? ' filled' : ''}`}
                          style={value ? { backgroundColor: BLOCK_FILL } : undefined}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {gameOver && (
                <div className="gb-box gb-retry">
                  <div className="gb-box-title">GAME OVER</div>
                  <p className="gb-msg">Top out</p>
                  <button className="btn btn-primary" type="button" onClick={reset}>RESTART</button>
                </div>
              )}
            </aside>
          </div>

          <div className="gb-controls">
            <GamepadControls
              onLeft={controls.moveLeft}
              onRight={controls.moveRight}
              onRotate={controls.rotate}
              onHardDrop={controls.hardDrop}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
