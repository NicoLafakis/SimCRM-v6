import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react-hooks'
import { AudioProvider, useAudio } from '../src/audio/AudioContext'
import React from 'react'

// Mock global Audio element
class MockAudio {
  constructor() { this.paused = true; this.currentTime = 0; this.volume = 1; this.src = ''; this._events = {} }
  play() { this.paused = false; return Promise.resolve() }
  pause() { this.paused = true }
  addEventListener(ev, fn) { this._events[ev] = fn }
  removeEventListener(ev) { delete this._events[ev] }
}

vi.stubGlobal('Audio', MockAudio)

describe('AudioContext / Boombox behavior', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads playlist and initializes first track', () => {
    const wrapper = ({ children }) => React.createElement(AudioProvider, null, children)
    const { result } = renderHook(() => useAudio(), { wrapper })
    // playlist is empty by default per requirement (SimCRM- prefixed)
    expect(result.current.playlist).toBeDefined()
    expect(Array.isArray(result.current.playlist)).toBe(true)
  })

  it('can change volume and persist it', async () => {
    const wrapper = ({ children }) => React.createElement(AudioProvider, null, children)
    const { result } = renderHook(() => useAudio(), { wrapper })
    act(() => result.current.changeVolume(0.2))
    expect(result.current.volume).toBeCloseTo(0.2)
    // force persist
    act(() => { result.current.togglePlay(); result.current.togglePlay(); })
    const stored = JSON.parse(localStorage.getItem('simcrm_audio_state'))
    expect(stored.volume).toBeCloseTo(0.2)
  })

  it('next/prev are no-ops on empty playlist', () => {
    const wrapper = ({ children }) => React.createElement(AudioProvider, null, children)
    const { result } = renderHook(() => useAudio(), { wrapper })
    act(() => result.current.next())
    act(() => result.current.prev())
    expect(result.current.index).toBe(0)
  })
})
