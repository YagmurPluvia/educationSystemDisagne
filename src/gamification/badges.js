export const BADGES = [
  {
    id: 'first',
    name: 'İlk adım',
    description: 'İlk doğru cevabı ver',
    earned: (s) => s.correct >= 1,
  },
  {
    id: 'streak3',
    name: '3\'lü seri',
    description: 'Üst üste 3 doğru cevap',
    earned: (s) => s.bestStreak >= 3,
  },
  {
    id: 'finish',
    name: 'Tamamlayıcı',
    description: 'Tüm kartları bitir',
    earned: (s) => s.finished,
  },
  {
    id: 'perfect',
    name: 'Kusursuz',
    description: 'Tüm kartları bitir ve hepsini doğru yap',
    earned: (s) => s.finished && s.correct === s.total,
  },
]

export function getEarnedIds(stats) {
  return BADGES.filter((b) => b.earned(stats)).map((b) => b.id)
}