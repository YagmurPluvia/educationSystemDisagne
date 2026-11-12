import { summarize } from '../analytics/summary'

const pct = (v) => (v === null ? '–' : `%${v}`)

function Summary({ events, lessons, points, level, firstTry, total }) {
  const s = summarize(events)
  const title = (id) => lessons.find((l) => l.id === id)?.title ?? id

  return (
    <div className="card">
      <h2>Tebrikler!</h2>
      <p>
        Tüm kartları tamamladın. Toplam puan: {points}, Seviye: {level},
        ilk denemede doğru: {firstTry} / {total}
      </p>

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