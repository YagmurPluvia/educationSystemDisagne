import Quiz from './Quiz'

function LessonCard({ lesson, stage, stageLabel, onAnswer }) {
  return (
    <div className="card">
      <span className={`tag ${stage}`}>{stageLabel}</span>
      <h2>{lesson.title}</h2>
      <div className="card-body">
        <div className="info">
          <p>{lesson.text}</p>
          <pre className="code">{lesson.code}</pre>
        </div>
        <Quiz question={lesson.question} onAnswer={onAnswer} />
      </div>
    </div>
  )
}

export default LessonCard