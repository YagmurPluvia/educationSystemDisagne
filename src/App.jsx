import { useState } from 'react'
import lessons from './content/lessons.json'
import LessonCard from './components/LessonCard'
import BadgeList from './components/BadgeList'
import { getEarnedIds } from './gamification/badges'
import {
  loadProgress,
  saveProgress,
  clearProgress,
  DEFAULT_STATE,
} from './storage/progress'
import './App.css'

const POINTS_PER_CORRECT = 10
const POINTS_PER_LEVEL = 30

const initial = loadProgress()
initial.index = Math.min(Math.max(initial.index, 0), lessons.length)

function App() {
  const [index, setIndex] = useState(initial.index)
  const [answered, setAnswered] = useState(false)
  const [points, setPoints] = useState(initial.points)
  const [streak, setStreak] = useState(initial.streak)
  const [bestStreak, setBestStreak] = useState(initial.bestStreak)
  const [correct, setCorrect] = useState(initial.correct)

  const finished = index >= lessons.length
  const progress = Math.round((index / lessons.length) * 100)
  const position = finished ? lessons.length : index + 1
  const level = Math.floor(points / POINTS_PER_LEVEL) + 1

  const earnedIds = getEarnedIds({
    correct,
    bestStreak,
    finished,
    total: lessons.length,
  })

  function handleAnswer(isCorrect) {
    setAnswered(true)
    if (isCorrect) {
      const newStreak = streak + 1
      setPoints(points + POINTS_PER_CORRECT)
      setStreak(newStreak)
      setBestStreak(Math.max(bestStreak, newStreak))
      setCorrect(correct + 1)
    } else {
      setStreak(0)
    }
  }

  function next() {
    const newIndex = index + 1
    setIndex(newIndex)
    setAnswered(false)
    saveProgress({ index: newIndex, points, streak, bestStreak, correct })
  }

  function reset() {
    clearProgress()
    setIndex(DEFAULT_STATE.index)
    setPoints(DEFAULT_STATE.points)
    setStreak(DEFAULT_STATE.streak)
    setBestStreak(DEFAULT_STATE.bestStreak)
    setCorrect(DEFAULT_STATE.correct)
    setAnswered(false)
  }

  return (
    <main className="app">
      <h1>Python Mikro Öğrenme</h1>

      <div className="stats">
        <span>Puan: {points}</span>
        <span>Seviye: {level}</span>
        <span>Seri: {streak}</span>
      </div>

      <BadgeList earnedIds={earnedIds} />

      <div className="progress">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-text">
        {position} / {lessons.length}
      </p>

      {finished ? (
        <div className="card">
          <h2>Tebrikler!</h2>
          <p>Tüm kartları tamamladın.</p>
          <p>
            Toplam puan: {points}, Seviye: {level}, Doğru: {correct} /{' '}
            {lessons.length}
          </p>
        </div>
      ) : (
        <>
          <LessonCard
            key={lessons[index].id}
            lesson={lessons[index]}
            onAnswer={handleAnswer}
          />
          {answered && (
            <button className="next" onClick={next}>
              {index === lessons.length - 1 ? 'Bitir' : 'Sonraki kart'}
            </button>
          )}
        </>
      )}

      <button className="reset" onClick={reset}>
        Baştan başla
      </button>
    </main>
  )
}

export default App