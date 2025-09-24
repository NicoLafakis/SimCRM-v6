import React, { useMemo, useState, useCallback } from 'react'
import LandingPage from './components/LandingPage'
import AuthPage from './components/AuthPage'
import SignUpPage from './components/SignUpPage'
import pluckUrl from '../assets/gameboy-pluck.mp3'
import CornerLogo from './components/CornerLogo'

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

  if (view === 'auth') return <>
    <CornerLogo onClick={() => setView('landing')} />
    <AuthPage onSignup={() => { try { audio.currentTime = 0; audio.play().catch(() => {}) } catch {}; setView('signup') }} />
  </>

  if (view === 'signup') return <>
    <CornerLogo onClick={() => setView('landing')} />
    <SignUpPage onBack={() => setView('auth')} />
  </>

  return <LandingPage onContinue={handleContinue} />
}
