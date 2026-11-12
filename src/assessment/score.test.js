import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { scoreTest, compare } from './score.js'

// 1) Puanlama
const preItems = [
  { concept: 'a', answer: 1 },
  { concept: 'b', answer: 0 },
]
const postItems = [
  { concept: 'a', answer: 2 },
  { concept: 'b', answer: 3 },
]
let s = scoreTest(preItems, [1, 1])
assert.equal(s.correct, 1)
assert.equal(s.percent, 50)

// 2) Karşılaştırma: ön testte 1, son testte 2 doğru
let r = compare(preItems, [1, 1], postItems, [2, 3])
assert.equal(r.gain, 1)
assert.equal(r.normalizedGain, 1)
assert.deepEqual(r.byConcept, [
  { concept: 'a', pre: true, post: true },
  { concept: 'b', pre: false, post: true },
])

// 3) Ön testte 0, son testte 1 doğru: kazanılabilecek 2 puanın yarısı
r = compare(preItems, [9, 9], postItems, [2, 9])
assert.equal(r.gain, 1)
assert.equal(r.normalizedGain, 0.5)

// 4) Ön testte hepsi doğruysa normalize kazanç hesaplanamaz
r = compare(preItems, [1, 0], postItems, [2, 3])
assert.equal(r.normalizedGain, null)

// 5) Kayıp: son test ön testten kötü
r = compare(preItems, [1, 0], postItems, [2, 9])
assert.equal(r.gain, -1)

// 6) tests.json yapısı
const tests = JSON.parse(readFileSync('src/content/tests.json', 'utf8'))
for (const form of ['A', 'B']) {
  assert.equal(tests[form].length, 5, `${form} formunda 5 soru olmalı`)
  tests[form].forEach((q, i) => {
    assert.ok(q.options.length >= 2, `${form}${i + 1}: seçenek eksik`)
    assert.ok(
      Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length,
      `${form}${i + 1}: cevap indeksi geçersiz`
    )
  })
}
const concepts = (f) => tests[f].map((q) => q.concept).sort().join(',')
assert.equal(concepts('A'), concepts('B'), 'A ve B aynı kavramları ölçmeli')

console.log('Tüm testler geçti')