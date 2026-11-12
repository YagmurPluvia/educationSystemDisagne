const KEY = 'microlearn-progress-v1'

export const DEFAULT_STATE = {
  index: 0,
  points: 0,
  streak: 0,
  bestStreak: 0,
  correct: 0,
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT_STATE }
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveProgress(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Depolama kapalıysa uygulama yine çalışır, sadece kayıt tutulmaz
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Yoksay
  }
}