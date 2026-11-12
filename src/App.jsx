import { useState, useRef } from 'react'
import lessons from './content/lessons.json'
import LessonCard from './components/LessonCard'
import BadgeList from './components/BadgeList'
import Summary from './components/Summary'
import { getEarnedIds } from './gamification/badges'
import { createQueue, answerCurrent } from './adaptive/scheduler'
import { loadLog, appendEvent, clearLog } from './analytics/log'
import {
  loadProgress,
  saveProgress,
  clearProgress,
  DEFAULT_STATE,
} from './storage/progress'
import './App.css'

const POINTS_NEW = 10
const POINTS_REPEAT = 5
const POINTS_PER_LEVEL = 30
const MAX_MS = 120000

const STAGE_LABELS = {
  new: 'Yeni kart',
  retry: 'Tekrar',
  confirm: 'Pekiştirme',
}

const allIds = lessons.map((l) => l.id)

function isValidQueue(q) {
  return (
    Array.isArray(q) &&
    q.every((e) => e && allIds.includes(e.id) && STAGE_LABELS[e.stage])
  )
}

const saved = loadProgress()
const initial = {
  ...saved,
  queue: isValidQueue(saved.queue) ? saved.queue : createQueue(allIds),
}

function App() {
  const [queue, setQueue] = useState(initial.queue)
  const [pending, setPending] = useState(null)
  const [step, setStep] = useState(0)
  const [points, setPoints] = useState(initial.points)
  const [streak, setStreak] = useState(initial.streak)
  const [bestStreak, setBestStreak] = useState(initial.bestStreak)
  const [correct, setCorrect] = useState(initial.correct)
  const [firstTry, setFirstTry] = useState(initial.firstTry)
  const [events, setEvents] = useState(() => loadLog())
  const startRef = useRef(Date.now())

  const total = lessons.length
  const finished = queue.length === 0
  const answered = pending !== null
  const completedCount = total - queue.length
  const progress = Math.round((completedCount / total) * 100)
  const level = Math.floor(points / POINTS_PER_LEVEL) + 1

  const current = finished ? null : queue[0]
  const lesson = current ? lessons.find((l) => l.id === current.id) : null

  const earnedIds = getEarnedIds({
    correct,
    bestStreak,
    finished,
    firstTry,
    total,
  })

  function handleAnswer(isCorrect) {
    const ms = Math.min(Date.now() - startRef.current, MAX_MS)
    const result = answerCurrent(queue, isCorrect)
    const event = {
      t: Date.now(),
      id: current.id,
      stage: result.stage,
      correct: isCorrect,
      ms,
    }
    setPending({ ...result, event })
    if (isCorrect) {
      const newStreak = streak + 1
      if (result.completed) {
        setPoints(points + (result.firstTry ? POINTS_NEW : POINTS_REPEAT))
      }
      setStreak(newStreak)
      setBestStreak(Math.max(bestStreak, newStreak))
      setCorrect(correct + 1)
      if (result.firstTry) setFirstTry(firstTry + 1)
    } else {
      setStreak(0)
    }
  }

  function next() {
    const newQueue = pending.queue
    setEvents(appendEvent(pending.event))
    setQueue(newQueue)
    setPending(null)
    setStep(step + 1)
    startRef.current = Date.now()
    saveProgress({
      queue: newQueue,
      points,
      streak,
      bestStreak,
      correct,
      firstTry,
    })
  }

  function reset() {
    clearProgress()
    clearLog()
    setEvents([])
    setQueue(createQueue(allIds))
    setPending(null)
    setStep(0)
    startRef.current = Date.now()
    setPoints(DEFAULT_STATE.points)
    setStreak(DEFAULT_STATE.streak)
    setBestStreak(DEFAULT_STATE.bestStreak)
    setCorrect(DEFAULT_STATE.correct)
    setFirstTry(DEFAULT_STATE.firstTry)
  }

  return (
    <div className="layout">
      <aside className="side">
        <h1>Python Mikro Öğrenme</h1>

        <div className="stats">
          <div className="stat">
            <b>{points}</b>
            <small>Puan</small>
          </div>
          <div className="stat">
            <b>{level}</b>
            <small>Seviye</small>
          </div>
          <div className="stat">
            <b>{streak}</b>
            <small>Seri</small>
          </div>
        </div>

        <BadgeList earnedIds={earnedIds} />

        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-text">
          Tamamlanan: {completedCount} / {total} · Kuyrukta: {queue.length}{' '}
          kart
        </p>

        <button className="reset" onClick={reset}>
          Baştan başla
        </button>
      </aside>

      <main className="main">
        {finished ? (
          <Summary
            events={events}
            lessons={lessons}
            points={points}
            level={level}
            firstTry={firstTry}
            total={total}
          />
        ) : (
          <>
            <LessonCard
              key={step}
              lesson={lesson}
              stage={current.stage}
              stageLabel={STAGE_LABELS[current.stage]}
              onAnswer={handleAnswer}
            />
            {answered && (
              <button className="next" onClick={next}>
                {pending.queue.length === 0 ? 'Bitir' : 'Sonraki kart'}
              </button>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App