import React from 'react'

export default function SignUpPage({ onBack }) {
  return (
    <div className="landing">
      <div className="auth-wrap" role="region" aria-label="Sign up form">
        <div className="gb-shell">
          <div className="gb-screen gb-screen--tall">
            <label className="gb-label">PLAYER NAME</label>
            <input className="gb-input" type="text" placeholder="Enter Player Name" />
            <label className="gb-label">PASSCODE</label>
            <input className="gb-input" type="password" placeholder="Enter Passcode" />
            <label className="gb-label">VERIFY PASSCODE</label>
            <input className="gb-input" type="password" placeholder="Verify Passcode" />
            <label className="gb-label">EMAIL ADDRESS</label>
            <input className="gb-input" type="email" placeholder="Enter Email" />
            <label className="gb-label">COMPANY NAME</label>
            <input className="gb-input" type="text" placeholder="Enter Company Name" />
          </div>
        </div>
        <div className="auth-actions">
          <button className="btn btn-signup">Continue</button>
        </div>
      </div>
      <footer className="site-footer">©️2025 Black Maige. Game the simulation.</footer>
    </div>
  )
}
