import assert from 'node:assert/strict'
import { summarize } from './summary.js'

// 1) Boş kayıt
let s = summarize([])
assert.equal(s.total, 0)
assert.equal(s.accuracy, null)
assert.equal(s.firstTryRate, null)
assert.equal(s.avgSeconds, 0)
assert.deepEqual(s.hardest, [])

// 2) Örnek kayıt
const events = [
  { id: 'a', stage: 'new', correct: false, ms: 4000 },
  { id: 'b', stage: 'new', correct: true, ms: 2000 },
  { id: 'c', stage: 'new', correct: true, ms: 3000 },
  { id: 'a', stage: 'retry', correct: true, ms: 2000 },
  { id: 'a', stage: 'confirm', correct: true, ms: 1000 },
]
s = summarize(events)
assert.equal(s.total, 5)
assert.equal(s.correct, 4)
assert.equal(s.accuracy, 80)
assert.equal(s.firstTryRate, 67)
assert.equal(s.retryRate, 100)
assert.equal(s.confirmRate, 100)
assert.equal(s.avgSeconds, 2.4)
assert.deepEqual(s.hardest, [{ id: 'a', wrong: 1 }])

// 3) En zor kartlar çok yanlıştan aza doğru sıralanır
s = summarize([
  { id: 'x', stage: 'new', correct: false, ms: 1000 },
  { id: 'y', stage: 'new', correct: false, ms: 1000 },
  { id: 'y', stage: 'retry', correct: false, ms: 1000 },
])
assert.equal(s.hardest[0].id, 'y')
assert.equal(s.hardest[0].wrong, 2)
assert.equal(s.hardest[1].id, 'x')

console.log('Tüm testler geçti')