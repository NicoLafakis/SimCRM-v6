import React, { useMemo, useState, useCallback } from 'react'
import LandingPage from './components/LandingPage'
import AuthPage from './components/AuthPage'
import pluckUrl from '../assets/gameboy-pluck.mp3'

export default function App() {
  const [view, setView] = useState('landing')
  const audio = useMemo(() => new Audio(pluckUrl), [])

  const handleContinue = useCallback(() => {
    try {
      audio.currentTime = 0
      audio.play().catch(() => {})
    } catch {}
    setView('auth')
  }, [audio])

  if (view === 'auth') return <AuthPage />
  return <LandingPage onContinue={handleContinue} />
}
