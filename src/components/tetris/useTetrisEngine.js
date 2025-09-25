import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BOARD_HEIGHT, BOARD_WIDTH, getRandomPiece, TETROMINOES } from './tetrominoes'

const DROP_INTERVAL = 800
const SOFT_DROP_INTERVAL = 80
const SPAWN_POSITION = { x: 3, y: -2 }

function createEmptyBoard() {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null))
}

function getCellsForPiece(piece, position) {
  const shape = TETROMINOES[piece.type].rotations[piece.rotation]
  const cells = []
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) cells.push({ x: position.x + x, y: position.y + y })
    }
  }
  return cells
}

function isValidPosition(board, piece, position) {
  const cells = getCellsForPiece(piece, position)
  return cells.every(({ x, y }) => {
    if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) return false
    if (y < 0) return true
    return !board[y][x]
  })
}

function mergePiece(board, piece, position) {
  const next = board.map(row => row.slice())
  const cells = getCellsForPiece(piece, position)
  const color = TETROMINOES[piece.type].color
  cells.forEach(({ x, y }) => {
    if (y >= 0) next[y][x] = { type: piece.type, color }
  })
  return next
}

function clearFullLines(board) {
  const remaining = board.filter(row => row.some(cell => !cell))
  const cleared = BOARD_HEIGHT - remaining.length
  const newBoard = Array.from({ length: cleared }, () => Array(BOARD_WIDTH).fill(null)).concat(remaining)
  return { cleared, board: newBoard }
}

export function useTetrisEngine({ onWin, linesTarget = 1, onFail }) {
  const [board, setBoard] = useState(() => createEmptyBoard())
  const [current, setCurrent] = useState(() => ({ piece: getRandomPiece(), position: SPAWN_POSITION }))
  const [nextPiece, setNextPiece] = useState(() => getRandomPiece())
  const [linesCleared, setLinesCleared] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const dropTimer = useRef(null)
  const softDropping = useRef(false)

  const reset = useCallback(() => {
    setBoard(createEmptyBoard())
  setCurrent({ piece: getRandomPiece(), position: { ...SPAWN_POSITION } })
    setNextPiece(getRandomPiece())
    setLinesCleared(0)
    setIsRunning(true)
  }, [])

  const lockPiece = useCallback(() => {
    const merged = mergePiece(board, current.piece, current.position)
    const { cleared, board: clearedBoard } = clearFullLines(merged)

    if (cleared > 0) {
      const projected = linesCleared + cleared
      setLinesCleared(projected)
      if (projected >= linesTarget) {
        setBoard(clearedBoard)
        setIsRunning(false)
        onWin?.()
        return
      }
    }

  const incoming = nextPiece
  const upcoming = { piece: incoming, position: { ...SPAWN_POSITION } }
    const nextQueue = getRandomPiece()

    if (!isValidPosition(clearedBoard, upcoming.piece, upcoming.position)) {
      setBoard(clearedBoard)
      setIsRunning(false)
      onFail?.()
      return
    }

    setBoard(clearedBoard)
  setCurrent(upcoming)
    setNextPiece(nextQueue)
  }, [board, current, linesCleared, linesTarget, nextPiece, onFail, onWin])

  const tryMove = useCallback((dx, dy, rotate = 0) => {
    if (!isRunning) return
    setCurrent(prev => {
      const nextRotationCount = TETROMINOES[prev.piece.type].rotations.length
      const nextPiece = {
        ...prev.piece,
        rotation:
          rotate === 0
            ? prev.piece.rotation
            : (prev.piece.rotation + rotate + nextRotationCount) % nextRotationCount,
      }
      const nextPos = { x: prev.position.x + dx, y: prev.position.y + dy }
      if (isValidPosition(board, nextPiece, nextPos)) {
        return { piece: nextPiece, position: nextPos }
      }
      if (dy === 1 && rotate === 0) {
        lockPiece()
      }
      return prev
    })
  }, [board, isRunning, lockPiece])

  useEffect(() => {
    if (!isRunning) return
    const interval = softDropping.current ? SOFT_DROP_INTERVAL : DROP_INTERVAL
    dropTimer.current = setInterval(() => {
      tryMove(0, 1)
    }, interval)
    return () => clearInterval(dropTimer.current)
  }, [isRunning, tryMove])

  const controls = useMemo(() => ({
    moveLeft: () => tryMove(-1, 0),
    moveRight: () => tryMove(1, 0),
    rotate: () => tryMove(0, 0, 1),
    softDropStart: () => {
      if (!isRunning) return
      softDropping.current = true
      clearInterval(dropTimer.current)
      dropTimer.current = setInterval(() => tryMove(0, 1), SOFT_DROP_INTERVAL)
    },
    softDropStop: () => {
      if (!isRunning) return
      softDropping.current = false
      clearInterval(dropTimer.current)
      dropTimer.current = setInterval(() => tryMove(0, 1), DROP_INTERVAL)
    },
    reset,
  }), [isRunning, reset, tryMove])

  const ghostCells = useMemo(() => {
  let ghostPos = current.position
    while (isValidPosition(board, current.piece, { x: ghostPos.x, y: ghostPos.y + 1 })) {
      ghostPos = { x: ghostPos.x, y: ghostPos.y + 1 }
    }
    return getCellsForPiece(current.piece, ghostPos)
  }, [board, current])

  const activeCells = useMemo(() => getCellsForPiece(current.piece, current.position), [current])

  return {
    board,
    activeCells,
    ghostCells,
    currentPiece: current.piece,
    nextPiece,
    linesCleared,
    controls,
    isRunning,
    reset,
  }
}
