const KEY = 'microlearn-progress-v2'

export const DEFAULT_STATE = {
  queue: null,
  points: 0,
  streak: 0,
  bestStreak: 0,
  correct: 0,
  firstTry: 0,
  phase: 'pre',
  preAnswers: null,
  postAnswers: null,
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