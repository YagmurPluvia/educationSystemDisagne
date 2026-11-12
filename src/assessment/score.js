export function scoreTest(items, answers) {
  const correct = items.filter((it, i) => answers[i] === it.answer).length
  return {
    correct,
    total: items.length,
    percent: items.length ? Math.round((100 * correct) / items.length) : 0,
  }
}

// Ön test ve son test aynı kavramları farklı sorularla ölçer.
// normalizedGain: kazanılan puanın, kazanılabilecek puana oranı (0 ile 1 arası).
export function compare(preItems, preAnswers, postItems, postAnswers) {
  const pre = scoreTest(preItems, preAnswers)
  const post = scoreTest(postItems, postAnswers)
  const gain = post.correct - pre.correct
  const room = pre.total - pre.correct
  const normalizedGain = room > 0 ? Math.round((100 * gain) / room) / 100 : null

  const byConcept = preItems.map((it, i) => {
    const j = postItems.findIndex((p) => p.concept === it.concept)
    return {
      concept: it.concept,
      pre: preAnswers[i] === it.answer,
      post: j >= 0 && postAnswers[j] === postItems[j].answer,
    }
  })

  return { pre, post, gain, normalizedGain, byConcept }
}