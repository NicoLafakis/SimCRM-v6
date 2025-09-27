import HubSpotSetup from './components/HubSpotSetup'
import React, { useMemo, useState, useCallback, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import AuthPage from './components/AuthPage'
import SignUpPage from './components/SignUpPage'
import VerificationIntro from './components/VerificationIntro'
import TetrisVerification from './components/TetrisVerification'
import pluckUrl from '../assets/gameboy-pluck.mp3'
import CornerLogo from './components/CornerLogo'
import SaaSSelection from './components/SaaS/SaaSSelection'
import ThemeSelection from './components/Themes/ThemeSelection'
import DistributionSelection from './components/Distribution/DistributionSelection'
import ScenarioSelection from './components/Scenario/ScenarioSelection'
import SimulationProgress from './components/Simulation/SimulationProgress'
import UserMenu from './components/UserMenu'
import BoomboxPlayer from './components/BoomboxPlayer'
import { AudioProvider } from './audio/AudioContext'
import KonamiEasterEgg from './components/KonamiEasterEgg'

const VIEWS = {
  LANDING: 'landing',
  AUTH: 'auth',
  SIGNUP: 'signup',
  VERIFY_INTRO: 'verify-intro',
  VERIFY_GAME: 'verify-game',
  DASHBOARD: 'dashboard',
  SAAS_SELECT: 'saas-select',
  HUBSPOT_SETUP: 'hubspot-setup',
  THEME_SELECT: 'theme-select',
  DISTRIBUTION_SELECT: 'distribution-select',
  SCENARIO_SELECT: 'scenario-select',
  SIM_PROGRESS: 'sim-progress',
}

export default function App() {
  const [view, setView] = useState(VIEWS.LANDING)
  const [user, setUser] = useState(null)
  const [pendingUser, setPendingUser] = useState(null)
  const audio = useMemo(() => new Audio(pluckUrl), [])
  const [scrolled, setScrolled] = useState(false)
  const [pendingSelections, setPendingSelections] = useState({ theme:null, distribution:null, scenario:null })
  const [activeSimulationId, setActiveSimulationId] = useState(null)

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
    setView(VIEWS.SAAS_SELECT)
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
              // Redirect directly to SaaS selection after login
              setView(VIEWS.SAAS_SELECT)
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
    case VIEWS.SAAS_SELECT:
      return (
        <AudioProvider>
          <KonamiEasterEgg />
          <CornerLogo onClick={() => setView(VIEWS.LANDING)} />
          {renderBackToTop}
          <UserMenu
            user={user}
            onSignOut={handleSignOut}
            playPlunk={playPlunk}
            onNav={(target) => {
              if (target === 'setup') return;
              console.log('Navigate to section:', target)
            }}
          />
          <SaaSSelection
            playPlunk={playPlunk}
            onSelect={(app) => {
              console.log('Selected app', app)
              playPlunk()
              if (app.id === 'hubspot') {
                setView(VIEWS.HUBSPOT_SETUP)
              } else {
                // For now, after any non-HubSpot SaaS selection proceed directly to theme selection.
                setView(VIEWS.THEME_SELECT)
              }
            }}
          />
          <BoomboxPlayer />
        </AudioProvider>
      )
    case VIEWS.HUBSPOT_SETUP:
      return (
        <AudioProvider>
          <CornerLogo onClick={() => setView(VIEWS.LANDING)} />
          {renderBackToTop}
          <UserMenu
            user={user}
            onSignOut={handleSignOut}
            playPlunk={playPlunk}
            onNav={(target) => {
              if (target === 'setup') return;
              console.log('Navigate to section:', target)
            }}
          />
          <HubSpotSetup
            user={user}
            playPlunk={playPlunk}
            onBack={() => setView(VIEWS.SAAS_SELECT)}
            onSkip={() => setView(VIEWS.THEME_SELECT)}
            onValidated={() => setView(VIEWS.THEME_SELECT)}
          />
          <BoomboxPlayer />
        </AudioProvider>
      )
    case VIEWS.THEME_SELECT:
      return (
        <AudioProvider>
          <CornerLogo onClick={() => setView(VIEWS.LANDING)} />
          {renderBackToTop}
          <UserMenu
            user={user}
            onSignOut={handleSignOut}
            playPlunk={playPlunk}
            onNav={(target) => {
              if (target === 'setup') return;
              console.log('Navigate to section:', target)
            }}
          />
          <ThemeSelection
            playPlunk={playPlunk}
            onSelect={(theme) => {
              console.log('Selected theme', theme)
              playPlunk()
              setPendingSelections(s => ({ ...s, theme }))
              setView(VIEWS.DISTRIBUTION_SELECT)
            }}
            onBack={() => setView(VIEWS.SAAS_SELECT)}
          />
          <BoomboxPlayer />
        </AudioProvider>
      )
    case VIEWS.DISTRIBUTION_SELECT:
      return (
        <AudioProvider>
          <CornerLogo onClick={() => setView(VIEWS.LANDING)} />
          {renderBackToTop}
          <UserMenu
            user={user}
            onSignOut={handleSignOut}
            playPlunk={playPlunk}
            onNav={(target) => {
              if (target === 'setup') return;
              console.log('Navigate to section:', target)
            }}
          />
          <DistributionSelection
            playPlunk={playPlunk}
            onBack={() => setView(VIEWS.THEME_SELECT)}
            onSelect={(method) => {
              playPlunk()
              console.log('Selected distribution method', method)
              // Future: persist distribution method
              setPendingSelections(s => ({ ...s, distribution: method.id }))
              setView(VIEWS.SCENARIO_SELECT)
            }}
          />
          <BoomboxPlayer />
        </AudioProvider>
      )
    case VIEWS.SCENARIO_SELECT:
      return (
        <AudioProvider>
          <CornerLogo onClick={() => setView(VIEWS.LANDING)} />
          {renderBackToTop}
          <UserMenu
            user={user}
            onSignOut={handleSignOut}
            playPlunk={playPlunk}
            onNav={(target) => {
              if (target === 'setup') return;
              console.log('Navigate to section:', target)
            }}
          />
          <ScenarioSelection
            playPlunk={playPlunk}
            onBack={() => setView(VIEWS.DISTRIBUTION_SELECT)}
            onSelect={async (scenario) => {
              playPlunk()
              console.log('Selected scenario', scenario)
              setPendingSelections(s => ({ ...s, scenario: scenario.id }))
              try {
                const createResp = await fetch('/api/simulations', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId: user?.id,
                    scenario: scenario.id,
                    distributionMethod: pendingSelections.distribution || 'linear',
                    totalRecords: 200,
                  })
                }).then(r => r.json())
                if (!createResp.ok) throw new Error(createResp.error || 'create failed')
                const simId = createResp.simulation.id
                setActiveSimulationId(simId)
                const startResp = await fetch(`/api/simulations/${simId}/start`, { method:'POST' }).then(r => r.json())
                if (!startResp.ok) throw new Error(startResp.error || 'start failed')
                setView(VIEWS.SIM_PROGRESS)
              } catch (e) {
                console.warn('Simulation start error:', e.message)
              }
            }}
          />
          <BoomboxPlayer />
        </AudioProvider>
      )
    case VIEWS.SIM_PROGRESS:
      return (
        <AudioProvider>
          <CornerLogo onClick={() => setView(VIEWS.LANDING)} />
          {renderBackToTop}
          <UserMenu
            user={user}
            onSignOut={handleSignOut}
            playPlunk={playPlunk}
            onNav={(target) => {
              if (target === 'setup') return;
              console.log('Navigate to section:', target)
            }}
          />
          <SimulationProgress
            playPlunk={playPlunk}
            simulationId={activeSimulationId}
            onBack={() => { playPlunk(); setView(VIEWS.SCENARIO_SELECT) }}
          />
          <BoomboxPlayer />
        </AudioProvider>
      )
    default:
      return <LandingPage onContinue={handleLandingContinue} />
  }
}
