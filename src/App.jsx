import { useState } from 'react'
import lessons from './content/lessons.json'
import LessonCard from './components/LessonCard'
import './App.css'

const POINTS_PER_CORRECT = 10
const POINTS_PER_LEVEL = 30

function App() {
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [points, setPoints] = useState(0)
  const [streak, setStreak] = useState(0)

  const finished = index >= lessons.length
  const progress = Math.round((index / lessons.length) * 100)
  const position = finished ? lessons.length : index + 1
  const level = Math.floor(points / POINTS_PER_LEVEL) + 1

  function handleAnswer(isCorrect) {
    setAnswered(true)
    if (isCorrect) {
      setPoints(points + POINTS_PER_CORRECT)
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }
  }

  function next() {
    setIndex(index + 1)
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
            Toplam puan: {points}, Seviye: {level}
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
    </main>
  )
}

export default App