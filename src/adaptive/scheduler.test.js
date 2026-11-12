import assert from 'node:assert/strict'
import { createQueue, answerCurrent } from './scheduler.js'

const ids = (q) => q.map((e) => e.id).join('')

// 1) Yanlış cevap: kart 2 kart sonra geri gelir
let q = createQueue(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])
let r = answerCurrent(q, false)
assert.equal(ids(r.queue), 'bcadefgh')
assert.equal(r.queue[2].stage, 'retry')
assert.equal(r.completed, false)

// 2) b ve c doğru, sonra a tekrarda doğru: 4 kart sonra pekiştirme
q = r.queue
q = answerCurrent(q, true).queue
q = answerCurrent(q, true).queue
assert.equal(ids(q), 'adefgh')
r = answerCurrent(q, true)
assert.equal(r.stage, 'retry')
assert.equal(ids(r.queue), 'defgah')
assert.equal(r.queue[4].stage, 'confirm')
assert.equal(r.completed, false)

// 3) Pekiştirmede doğru: kart tamamlanır, ilk deneme sayılmaz
r = answerCurrent([{ id: 'a', stage: 'confirm' }], true)
assert.equal(r.completed, true)
assert.equal(r.firstTry, false)
assert.equal(r.queue.length, 0)

// 4) Yeni kartta doğru: tamamlanır ve ilk deneme sayılır
r = answerCurrent([{ id: 'a', stage: 'new' }, { id: 'b', stage: 'new' }], true)
assert.equal(r.completed, true)
assert.equal(r.firstTry, true)
assert.equal(ids(r.queue), 'b')

// 5) Pekiştirmede yanlış: tekrar aşamasına döner
r = answerCurrent(
  [{ id: 'a', stage: 'confirm' }, { id: 'b', stage: 'new' }, { id: 'c', stage: 'new' }],
  false
)
assert.equal(ids(r.queue), 'bca')
assert.equal(r.queue[2].stage, 'retry')

// 6) Kuyrukta tek kart varken yanlış: aynı kart yeniden gelir
r = answerCurrent([{ id: 'a', stage: 'new' }], false)
assert.equal(ids(r.queue), 'a')
assert.equal(r.queue[0].stage, 'retry')

console.log('Tüm testler geçti')