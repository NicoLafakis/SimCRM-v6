import React, { useEffect, useState, useRef } from 'react'
import SimulationEngine from './simulation/SimulationEngine'

export default function App() {
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState([])
  const engineRef = useRef(null)

  useEffect(() => {
    engineRef.current = new SimulationEngine({ onEvent: e => setLogs(l => [e, ...l]) })
    return () => engineRef.current?.stop()
  }, [])

  function start() {
    setRunning(true)
    engineRef.current.start()
  }
  function stop() {
    setRunning(false)
    engineRef.current.stop()
  }

  return (
    <div className="app">
      <header>
        <h1>SimCRM - HubSpot Simulation</h1>
        <div className="controls">
          {running ? (
            <button onClick={stop}>Stop</button>
          ) : (
            <button onClick={start}>Start Simulation</button>
          )}
        </div>
      </header>

      <section className="logs">
        <h2>Event Log</h2>
        <ul>
          {logs.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
