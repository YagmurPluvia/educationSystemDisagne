function rate(list) {
  if (list.length === 0) return null
  const ok = list.filter((e) => e.correct).length
  return Math.round((100 * ok) / list.length)
}

export function summarize(events) {
  const total = events.length
  const correct = events.filter((e) => e.correct).length
  const stage = (s) => events.filter((e) => e.stage === s)
  const totalMs = events.reduce((sum, e) => sum + e.ms, 0)

  const wrongById = {}
  events.forEach((e) => {
    if (!e.correct) wrongById[e.id] = (wrongById[e.id] || 0) + 1
  })
  const hardest = Object.entries(wrongById)
    .map(([id, wrong]) => ({ id, wrong }))
    .sort((a, b) => b.wrong - a.wrong)

  return {
    total,
    correct,
    accuracy: rate(events),
    firstTryRate: rate(stage('new')),
    retryRate: rate(stage('retry')),
    confirmRate: rate(stage('confirm')),
    avgSeconds: total ? Math.round(totalMs / total / 100) / 10 : 0,
    hardest,
  }
}