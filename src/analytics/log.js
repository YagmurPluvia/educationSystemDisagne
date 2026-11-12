const KEY = 'microlearn-log-v1'

export function loadLog() {
  try {
    const raw = localStorage.getItem(KEY)
    const data = raw ? JSON.parse(raw) : []
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

// event: { t, id, stage, correct, ms }
export function appendEvent(event) {
  const log = loadLog()
  log.push(event)
  try {
    localStorage.setItem(KEY, JSON.stringify(log))
  } catch {
    // Depolama kapalıysa uygulama yine çalışır, sadece kayıt tutulmaz
  }
  return log
}

export function clearLog() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Yoksay
  }
}