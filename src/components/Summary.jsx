import { summarize } from '../analytics/summary'

const pct = (v) => (v === null ? '–' : `%${v}`)

const CONCEPT_NAMES = {
  variable: 'Değişkenler',
  operators: 'Operatörler',
  conditions: 'Koşullar',
  lists: 'Listeler',
  loops: 'Döngüler',
}

function Summary({ events, lessons, points, level, firstTry, total, comparison }) {
  const s = summarize(events)
  const title = (id) => lessons.find((l) => l.id === id)?.title ?? id
  const c = comparison

  return (
    <div className="card">
      <h2>Tebrikler!</h2>
      <p>
        Tüm kartları tamamladın. Toplam puan: {points}, Seviye: {level},
        ilk denemede doğru: {firstTry} / {total}
      </p>

      {c && (
        <>
          <h3>Ön test ve son test</h3>
          <div className="summary">
            <div className="tile">
              <b>
                {c.pre.correct} / {c.pre.total}
              </b>
              <small>Ön test</small>
            </div>
            <div className="tile">
              <b>
                {c.post.correct} / {c.post.total}
              </b>
              <small>Son test</small>
            </div>
            <div className="tile">
              <b>
                {c.gain > 0 ? '+' : ''}
                {c.gain}
              </b>
              <small>Fark (doğru sayısı)</small>
            </div>
            <div className="tile">
              <b>{c.normalizedGain === null ? '–' : c.normalizedGain}</b>
              <small>Normalize kazanç</small>
            </div>
          </div>
          <table className="concepts">
            <thead>
              <tr>
                <th>Kavram</th>
                <th>Ön test</th>
                <th>Son test</th>
              </tr>
            </thead>
            <tbody>
              {c.byConcept.map((row) => (
                <tr key={row.concept}>
                  <td>{CONCEPT_NAMES[row.concept] ?? row.concept}</td>
                  <td>{row.pre ? '✓' : '✗'}</td>
                  <td>{row.post ? '✓' : '✗'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h3>Öğrenme özeti</h3>
      <div className="summary">
        <div className="tile">
          <b>{s.total}</b>
          <small>Toplam cevap</small>
        </div>
        <div className="tile">
          <b>{pct(s.accuracy)}</b>
          <small>Genel doğruluk</small>
        </div>
        <div className="tile">
          <b>{pct(s.firstTryRate)}</b>
          <small>Yeni kartlarda doğruluk</small>
        </div>
        <div className="tile">
          <b>{pct(s.retryRate)}</b>
          <small>Tekrarda doğruluk</small>
        </div>
        <div className="tile">
          <b>{pct(s.confirmRate)}</b>
          <small>Pekiştirmede doğruluk</small>
        </div>
        <div className="tile">
          <b>{s.avgSeconds} sn</b>
          <small>Ortalama cevap süresi</small>
        </div>
      </div>

      <h3>En çok zorlanılan kartlar</h3>
      {s.hardest.length === 0 ? (
        <p>Hiç yanlış yapmadın.</p>
      ) : (
        <ul className="hard">
          {s.hardest.slice(0, 3).map((h) => (
            <li key={h.id}>
              {title(h.id)} ({h.wrong} yanlış)
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Summary