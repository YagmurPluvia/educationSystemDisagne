import { useState } from 'react'

function TestForm({ title, intro, items, onFinish }) {
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)

  const q = items[i]
  const last = i === items.length - 1

  function go() {
    const updated = [...answers, selected]
    if (last) {
      onFinish(updated)
      return
    }
    setAnswers(updated)
    setSelected(null)
    setI(i + 1)
  }

  return (
    <div className="card">
      <span className="tag">{title}</span>
      <h2>
        Soru {i + 1} / {items.length}
      </h2>
      <p className="intro">{intro}</p>
      <p className="prompt">{q.prompt}</p>
      {q.options.map((option, k) => (
        <button
          key={k}
          className={selected === k ? 'option selected' : 'option'}
          onClick={() => setSelected(k)}
        >
          {option}
        </button>
      ))}
      <button className="next" disabled={selected === null} onClick={go}>
        {last ? 'Testi bitir' : 'Sonraki soru'}
      </button>
    </div>
  )
}

export default TestForm