import React, { useMemo, useState, useCallback, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import AuthPage from './components/AuthPage'
import SignUpPage from './components/SignUpPage'
import VerificationIntro from './components/VerificationIntro'
import TetrisVerification from './components/TetrisVerification'
import pluckUrl from '../assets/gameboy-pluck.mp3'
import CornerLogo from './components/CornerLogo'

const VIEWS = {
  LANDING: 'landing',
  AUTH: 'auth',
  SIGNUP: 'signup',
  VERIFY_INTRO: 'verify-intro',
  VERIFY_GAME: 'verify-game',
  DASHBOARD: 'dashboard',
}

export default function App() {
  const [view, setView] = useState(VIEWS.LANDING)
  const [user, setUser] = useState(null)
  const [pendingUser, setPendingUser] = useState(null)
  const audio = useMemo(() => new Audio(pluckUrl), [])
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      window.scrollTo(0, 0)
    }
  }, [])

  const playPlunk = useCallback(() => {
    try {
      audio.currentTime = 0
      audio.play().catch(() => {})
    } catch {}
  }, [audio])

  const handleLandingContinue = useCallback(() => {
    playPlunk()
    setView(VIEWS.AUTH)
  }, [playPlunk])

  const handleSignupSuccess = useCallback((newUser) => {
    playPlunk()
    setPendingUser(newUser)
    setView(VIEWS.VERIFY_INTRO)
  }, [playPlunk])

  const handleVerificationSuccess = useCallback(() => {
    if (!pendingUser) return
    setUser(pendingUser)
    setPendingUser(null)
    setView(VIEWS.DASHBOARD)
  }, [pendingUser])

  const handleSignOut = useCallback(() => {
    playPlunk()
    setUser(null)
    setPendingUser(null)
    setView(VIEWS.LANDING)
  }, [playPlunk])

  const renderBackToTop = scrolled ? (
    <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">↑</button>
  ) : null

  if (user && view === VIEWS.DASHBOARD) {
    return (
      <div className="landing dashboard-view">
        <CornerLogo onClick={() => setView(VIEWS.LANDING)} />
        {renderBackToTop}
        <div className="dashboard-card">
          <h2>Welcome, {user.playerName}!</h2>
          <p>You are verified and ready to run the SimCRM console.</p>
          <button className="btn btn-primary" onClick={handleSignOut}>Sign out</button>
        </div>
        <footer className="site-footer">©️2025 Black Maige. Game the simulation.</footer>
      </div>
    )
  }

  switch (view) {
    case VIEWS.AUTH:
      return (
        <>
          <CornerLogo onClick={() => setView(VIEWS.LANDING)} />
          {renderBackToTop}
          <AuthPage
            onSignup={() => {
              playPlunk()
              setView(VIEWS.SIGNUP)
            }}
            onLogin={(u) => {
              playPlunk()
              setUser(u)
              setView(VIEWS.DASHBOARD)
            }}
          />
        </>
      )
    case VIEWS.SIGNUP:
      return (
        <>
          <CornerLogo onClick={() => setView(VIEWS.LANDING)} />
          {renderBackToTop}
          <SignUpPage onBack={() => setView(VIEWS.AUTH)} onSuccess={handleSignupSuccess} />
        </>
      )
    case VIEWS.VERIFY_INTRO:
      return (
        <>
          <CornerLogo onClick={() => setView(VIEWS.LANDING)} />
          {renderBackToTop}
          <VerificationIntro
            onStart={() => {
              playPlunk()
              setView(VIEWS.VERIFY_GAME)
            }}
            onBack={() => setView(VIEWS.AUTH)}
          />
        </>
      )
    case VIEWS.VERIFY_GAME:
      return (
        <>
          <CornerLogo onClick={() => setView(VIEWS.LANDING)} />
          {renderBackToTop}
          <TetrisVerification
            onSuccess={handleVerificationSuccess}
            onExit={() => {
              playPlunk()
              setView(VIEWS.VERIFY_INTRO)
            }}
          />
        </>
      )
    default:
      return <LandingPage onContinue={handleLandingContinue} />
  }
}
