import React from 'react'

export default function AuthPage({ onSignup }) {
  return (
    <div className="landing">
      <div className="auth-wrap" role="region" aria-label="Login form">
        <div className="gb-shell">
          <div className="gb-screen">
            <label className="gb-label">PLAYER NAME</label>
            <input className="gb-input" type="text" placeholder="Enter Player Name" />
            <label className="gb-label">PASSCODE</label>
            <input className="gb-input" type="password" placeholder="Enter Passcode" />
          </div>
        </div>
        <div className="auth-under">
          <a className="auth-forgot" href="#">Forgot your password?</a>
        </div>
        <div className="auth-actions">
          <button className="btn btn-login">Login</button>
          <div className="auth-or">OR</div>
          <button className="btn btn-signup" onClick={onSignup}>Sign Up</button>
        </div>
      </div>
      <footer className="site-footer">©️2025 Black Maige. Game the simulation.</footer>
    </div>
  )
}
