import { useState } from 'react'

function Quiz({ question }) {
  const [selected, setSelected] = useState(null)
  const answered = selected !== null

  return (
    <div className="quiz">
      <p className="prompt">{question.prompt}</p>
      {question.options.map((option, i) => {
        let cls = 'option'
        if (answered && i === question.answer) cls += ' correct'
        else if (answered && i === selected) cls += ' wrong'
        return (
          <button
            key={i}
            className={cls}
            disabled={answered}
            onClick={() => setSelected(i)}
          >
            {option}
          </button>
        )
      })}
      {answered && (
        <p className="feedback">
          {selected === question.answer ? 'Doğru! ' : 'Yanlış. '}
          {question.explanation}
        </p>
      )}
    </div>
  )
}

export default Quiz