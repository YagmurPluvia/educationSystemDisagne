import { useState } from 'react'
import lessons from './content/lessons.json'
import LessonCard from './components/LessonCard'
import './App.css'

function App() {
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)

  const finished = index >= lessons.length
  const progress = Math.round((index / lessons.length) * 100)
  const position = finished ? lessons.length : index + 1

  function next() {
    setIndex(index + 1)
    setAnswered(false)
  }

  return (
    <main className="app">
      <h1>Python Mikro Öğrenme</h1>
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
        </div>
      ) : (
        <>
          <LessonCard
            key={lessons[index].id}
            lesson={lessons[index]}
            onAnswer={() => setAnswered(true)}
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