import type { CrewMember } from '../types'

export function calculateStreak(member: CrewMember): number {
  if (member.entries.length === 0) return 0

  const uniqueDates = [...new Set(member.entries.map((entry) => entry.date.slice(0, 10)))].sort().reverse()
  let streak = 0

  for (const date of uniqueDates) {
    const current = new Date(date)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - current.getTime()) / 86400000)

    if (diffDays <= streak || streak === 0) {
      streak += 1
    } else {
      break
    }
  }

  return streak
}

export function getXpForCheckIn(entryCount: number) {
  return 20 + entryCount * 5
}

export function getBadges(member: CrewMember): string[] {
  const badges: string[] = []
  if (member.entries.length >= 7) badges.push('Iron Heart')
  if (member.entries.some((entry) => entry.sleepHours >= 8)) badges.push('Deep Sleeper')
  if (member.entries.some((entry) => entry.exerciseMinutes >= 30)) badges.push('Mission Steady')
  if (member.entries.some((entry) => entry.mood >= 4 && entry.stress <= 5)) badges.push('Calm Core')
  return badges
}
