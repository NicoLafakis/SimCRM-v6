import React, { useMemo, useState, useCallback, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import AuthPage from './components/AuthPage'
import SignUpPage from './components/SignUpPage'
import pluckUrl from '../assets/gameboy-pluck.mp3'
import CornerLogo from './components/CornerLogo'

export default function App() {
  const [view, setView] = useState('landing')
  const [user, setUser] = useState(null)
  const audio = useMemo(() => new Audio(pluckUrl), [])
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 120)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch { window.scrollTo(0,0) }
  }

  const handleContinue = useCallback(() => {
    try {
      audio.currentTime = 0
      audio.play().catch(() => {})
    } catch {}
    setView('auth')
  }, [audio])

  if (user) return (
    <div className="landing">
      <CornerLogo onClick={() => setView('landing')} />
      {scrolled && <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">↑</button>}
      <div style={{ zIndex: 2, textAlign: 'center' }}>
        <h2 style={{ color: '#1e3a5f' }}>Welcome, {user.playerName}!</h2>
        <p style={{ color: '#21313a' }}>You are logged in (dev mode).</p>
        <button className="btn btn-login" onClick={() => setUser(null)}>Sign out</button>
      </div>
      <footer className="site-footer">©️2025 Black Maige. Game the simulation.</footer>
    </div>
  )

  if (view === 'auth') return <>
    <CornerLogo onClick={() => setView('landing')} />
    {scrolled && <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">↑</button>}
    <AuthPage onSignup={() => { try { audio.currentTime = 0; audio.play().catch(() => {}) } catch {}; setView('signup') }} onLogin={u => setUser(u)} />
  </>

  if (view === 'signup') return <>
    <CornerLogo onClick={() => setView('landing')} />
    {scrolled && <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">↑</button>}
    <SignUpPage onBack={() => setView('auth')} />
  </>

  return <LandingPage onContinue={handleContinue} />
}
