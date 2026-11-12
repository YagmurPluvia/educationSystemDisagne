import { BADGES } from '../gamification/badges'

function BadgeList({ earnedIds }) {
  return (
    <div className="badges">
      {BADGES.map((b) => {
        const earned = earnedIds.includes(b.id)
        return (
          <div
            key={b.id}
            className={earned ? 'badge earned' : 'badge'}
            title={b.description}
          >
            {earned ? '🏅 ' : '🔒 '}
            {b.name}
          </div>
        )
      })}
    </div>
  )
}

export default BadgeList