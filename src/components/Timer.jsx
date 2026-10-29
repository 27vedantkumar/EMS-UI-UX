import { useState, useEffect, useRef } from 'react'

export default function Timer({ initialMinutes = 10, onTimeUp, label = 'Presentation Timer' }) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isAlert, setIsAlert] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            setIsAlert(true)
            onTimeUp?.()
            return 0
          }
          if (prev <= 61) setIsAlert(true)
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, onTimeUp])

  const start = () => { setIsRunning(true) }
  const pause = () => { setIsRunning(false); clearInterval(intervalRef.current) }
  const reset = () => {
    setIsRunning(false)
    setIsAlert(false)
    clearInterval(intervalRef.current)
    setTimeLeft(initialMinutes * 60)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const total = initialMinutes * 60
  const progress = ((total - timeLeft) / total) * 100
  const circumference = 2 * Math.PI * 54

  return (
    <div className={`timer-widget ${isAlert ? 'timer-alert' : ''}`}>
      <h3 className="timer-label">{label}</h3>

      <div className="timer-circle-wrapper">
        <svg className="timer-svg" viewBox="0 0 120 120">
          <circle className="timer-track" cx="60" cy="60" r="54" />
          <circle
            className="timer-fill"
            cx="60" cy="60" r="54"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            style={{
              stroke: isAlert
                ? 'var(--danger)'
                : progress > 70
                  ? 'var(--warning)'
                  : 'var(--primary)',
            }}
          />
        </svg>
        <div className="timer-digits">
          <span className="timer-min">{String(minutes).padStart(2, '0')}</span>
          <span className="timer-sep">:</span>
          <span className="timer-sec">{String(seconds).padStart(2, '0')}</span>
        </div>
      </div>

      {isAlert && timeLeft === 0 && (
        <div className="timer-alert-msg">⚠️ Time is up!</div>
      )}
      {isAlert && timeLeft > 0 && (
        <div className="timer-alert-msg warning">⚠️ Less than 1 minute remaining!</div>
      )}

      <div className="timer-controls">
        {!isRunning ? (
          <button onClick={start} className="btn btn-success" disabled={timeLeft === 0}>
            ▶ Start
          </button>
        ) : (
          <button onClick={pause} className="btn btn-warning">
            ⏸ Pause
          </button>
        )}
        <button onClick={reset} className="btn btn-outline">
          ↺ Reset
        </button>
      </div>
    </div>
  )
}

