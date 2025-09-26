import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'

// Lightweight audio context to be extended later with playlist logic.
const AudioCtx = createContext(null)

export function AudioProvider({ children }) {
  const audioRef = useRef(new Audio())
  const [expanded, setExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  // Build a static playlist from imported assets (manual list for explicit control)
  // Only include mp3 tracks with SimCRM- prefix (others intentionally excluded)
  // Static manual list (Vite cannot dynamically read dir at build time without import.meta.glob)
  // If more SimCRM-*.mp3 files are added, append them here or refactor using import.meta.glob.
  const playlist = useRef([
    // Example: { id: 'simcrm-example', title: 'SimCRM Example', src: '/assets/SimCRM-example.mp3' },
  ].filter(Boolean))
  const [index, setIndex] = useState(0)
  const [track, setTrack] = useState(null) // { src, title }
  const [volume, setVolume] = useState(0.4)

  const toggleExpanded = useCallback(() => setExpanded(e => !e), [])

  const setAndPlay = useCallback((t) => {
    setTrack(t)
    const el = audioRef.current
    if (!el) return
    el.src = t.src
    el.volume = volume
    el.currentTime = 0
    el.play().then(() => setIsPlaying(true)).catch(() => {})
  }, [volume])

  const togglePlay = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      el.play().then(() => setIsPlaying(true)).catch(()=>{})
    } else {
      el.pause(); setIsPlaying(false)
    }
  }, [])

  const changeVolume = useCallback((v) => {
    const clamped = Math.min(1, Math.max(0, v))
    setVolume(clamped)
    if (audioRef.current) audioRef.current.volume = clamped
  }, [])

  // Navigation helpers
  const next = useCallback(() => {
    setIndex(i => {
      const ni = (i + 1) % playlist.current.length
      setAndPlay(playlist.current[ni])
      return ni
    })
  }, [setAndPlay])

  const prev = useCallback(() => {
    setIndex(i => {
      const ni = (i - 1 + playlist.current.length) % playlist.current.length
      setAndPlay(playlist.current[ni])
      return ni
    })
  }, [setAndPlay])

  // Auto-load first track on mount
  // Restore persisted state on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('simcrm_audio_state')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (typeof parsed.volume === 'number') {
          setVolume(parsed.volume)
          if (audioRef.current) audioRef.current.volume = parsed.volume
        }
        if (typeof parsed.index === 'number' && playlist.current[parsed.index]) {
          setIndex(parsed.index)
          setTrack(playlist.current[parsed.index])
          if (audioRef.current) {
            audioRef.current.src = playlist.current[parsed.index].src
            if (typeof parsed.time === 'number') {
              audioRef.current.currentTime = parsed.time
            }
          }
        }
        if (typeof parsed.expanded === 'boolean') setExpanded(parsed.expanded)
      } else if (!track && playlist.current.length) {
        // default initialization
        const first = playlist.current[0]
        setTrack(first)
        const el = audioRef.current
        el.src = first.src
        el.volume = volume
      }
    } catch {
      // ignore corrupt state
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist state on changes (throttle via requestAnimationFrame for time updates)
  useEffect(() => {
    let frame
    const el = audioRef.current
    const persist = () => {
      try {
        const payload = {
          index,
            // store time only if playing for continuity
          time: el && !el.paused ? el.currentTime : (el ? el.currentTime : 0),
          volume,
          expanded,
        }
        localStorage.setItem('simcrm_audio_state', JSON.stringify(payload))
      } catch {}
      if (el && !el.paused) frame = requestAnimationFrame(persist)
    }
    // kick off if playing
    if (el && !el.paused) frame = requestAnimationFrame(persist)
    return () => { if (frame) cancelAnimationFrame(frame) }
  }, [index, volume, expanded, isPlaying])

  // Auto-advance when a track ends
  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onEnd = () => next()
    el.addEventListener('ended', onEnd)
    return () => el.removeEventListener('ended', onEnd)
  }, [next])

  const value = {
    audio: audioRef.current,
    track,
    isPlaying,
    volume,
    expanded,
    toggleExpanded,
    togglePlay,
    setAndPlay,
    changeVolume,
    playlist: playlist.current,
    index,
    next,
    prev,
    setTrack,
    setIsPlaying,
  }

  // Avoid JSX so this file can stay .js without requiring JSX transform in build.
  return React.createElement(AudioCtx.Provider, { value }, children)
}

export function useAudio() {
  return useContext(AudioCtx)
}
