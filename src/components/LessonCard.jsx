import Quiz from './Quiz'

function LessonCard({ lesson, onAnswer }) {
  return (
    <div className="card">
      <h2>{lesson.title}</h2>
      <p>{lesson.text}</p>
      <pre className="code">{lesson.code}</pre>
      <Quiz question={lesson.question} onAnswer={onAnswer} />
    </div>
  )
}

export default LessonCard