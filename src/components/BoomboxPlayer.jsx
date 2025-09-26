import React, { useEffect } from 'react'
import { useAudio } from '../audio/AudioContext'

// Collapsible 8-bit styled audio player (initial shell only)
export default function BoomboxPlayer() {
  const audio = useAudio()
  if (!audio) return null
  const { expanded, toggleExpanded, isPlaying, togglePlay, track, volume, changeVolume, next, prev, playlist, index } = audio

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return
      const key = e.key.toLowerCase()
      if (key === 'p') { e.preventDefault(); togglePlay() }
      else if (key === 'f') { e.preventDefault(); next() }
      else if (key === 'r') { e.preventDefault(); prev() }
      else if (e.key === 'ArrowUp') { e.preventDefault(); changeVolume(Math.min(1, volume + 0.05)) }
      else if (e.key === 'ArrowDown') { e.preventDefault(); changeVolume(Math.max(0, volume - 0.05)) }
      else if (e.key === 'Escape' && expanded) { e.preventDefault(); toggleExpanded() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [togglePlay, next, prev, changeVolume, volume, expanded, toggleExpanded])

  return (
    <div className={`boombox ${expanded ? ' is-open' : ''}`}> 
      <button className="boombox-toggle" onClick={toggleExpanded} aria-expanded={expanded} aria-label={expanded ? 'Collapse player' : 'Expand player'}>
        ♫{expanded ? '▾' : '▸'}
      </button>
      {expanded && (
        <div className="boombox-body">
          <div className="boombox-screen">
            <span className="boombox-track" aria-live="polite">{track?.title || 'NO TRACK LOADED'}</span>
          </div>
          <div className="boombox-controls">
            <button className="bb-btn" onClick={prev} aria-label="Previous track">«</button>
            <button className="bb-btn" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? '❚❚' : '▶'}</button>
            <button className="bb-btn" onClick={next} aria-label="Next track">»</button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              aria-label="Volume"
              className="bb-vol"
            />
          </div>
          <div className="boombox-meta" aria-live="polite">{playlist && playlist.length ? `${index+1}/${playlist.length}` : '0/0'}</div>
        </div>
      )}
    </div>
  )
}
