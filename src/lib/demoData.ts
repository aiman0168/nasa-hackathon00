import type { CrewMember, HealthEntry, SymptomKey } from '../types'

function makeDate(daysAgo: number) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().slice(0, 10)
}

function makeEntry(dayOffset: number, pattern: Partial<HealthEntry> = {}): HealthEntry {
  const date = makeDate(dayOffset)
  const base: HealthEntry = {
    id: `entry-${dayOffset}`,
    date,
    heartRate: 62,
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 76,
    bodyTemperature: 36.8,
    bloodGlucose: 94,
    spo2: 99,
    sleepHours: 8,
    sleepQuality: 4,
    mood: 4,
    stress: 4,
    fatigue: 3,
    appetite: 4,
    exerciseMinutes: 32,
    hydration: 2,
    symptoms: [],
    note: '',
    radiationDose: 0.4,
  }

  return { ...base, ...pattern }
}

export function generateDemoCrew(): CrewMember[] {
  const crew: CrewMember[] = [
    {
      id: 'astro-1',
      name: 'Ava Chen',
      age: 32,
      sex: 'Female',
      missionEnvironment: 'Mars Habitat',
      missionDay: 118,
      createdAt: new Date().toISOString(),
      streak: 9,
      xp: 740,
      badges: ['Iron Heart', 'Deep Sleeper'],
      entries: [],
    },
    {
      id: 'astro-2',
      name: 'Mateo Ruiz',
      age: 28,
      sex: 'Male',
      missionEnvironment: 'Space Station',
      missionDay: 86,
      createdAt: new Date().toISOString(),
      streak: 6,
      xp: 610,
      badges: ['Mission Steady'],
      entries: [],
    },
    {
      id: 'astro-3',
      name: 'Lina Okafor',
      age: 35,
      sex: 'Other',
      missionEnvironment: 'Lunar Base',
      missionDay: 144,
      createdAt: new Date().toISOString(),
      streak: 11,
      xp: 890,
      badges: ['Calm Core', 'Deep Sleeper'],
      entries: [],
    },
  ]

  const entrySeeds = [
    { day: 30, heartRate: 60, sleepHours: 8.5, sleepQuality: 4, mood: 4, stress: 3, fatigue: 3, appetite: 4, exerciseMinutes: 35, bodyTemperature: 36.7, bloodPressureSystolic: 115, bloodPressureDiastolic: 74 },
    { day: 29, heartRate: 62, sleepHours: 7.8, sleepQuality: 4, mood: 4, stress: 4, fatigue: 3, appetite: 4, exerciseMinutes: 38 },
    { day: 28, heartRate: 63, sleepHours: 7.2, sleepQuality: 3, mood: 3, stress: 5, fatigue: 4, appetite: 3, exerciseMinutes: 25 },
    { day: 27, heartRate: 64, sleepHours: 6.8, sleepQuality: 3, mood: 2, stress: 7, fatigue: 5, appetite: 3, exerciseMinutes: 20 },
    { day: 26, heartRate: 68, sleepHours: 6.1, sleepQuality: 2, mood: 2, stress: 8, fatigue: 6, appetite: 2, exerciseMinutes: 18, symptoms: ['headache', 'dizziness'] as SymptomKey[] },
    { day: 25, heartRate: 70, sleepHours: 5.8, sleepQuality: 2, mood: 2, stress: 8, fatigue: 7, appetite: 2, exerciseMinutes: 12, symptoms: ['headache', 'congestion'] as SymptomKey[] },
    { day: 24, heartRate: 74, sleepHours: 5.6, sleepQuality: 2, mood: 2, stress: 9, fatigue: 7, appetite: 2, exerciseMinutes: 15, symptoms: ['headache', 'nausea'] as SymptomKey[] },
    { day: 20, heartRate: 72, sleepHours: 7.5, sleepQuality: 4, mood: 4, stress: 4, fatigue: 3, appetite: 4, exerciseMinutes: 30 },
    { day: 18, heartRate: 61, sleepHours: 8.3, sleepQuality: 5, mood: 4, stress: 3, fatigue: 2, appetite: 4, exerciseMinutes: 42 },
    { day: 15, heartRate: 63, sleepHours: 7.6, sleepQuality: 4, mood: 4, stress: 4, fatigue: 3, appetite: 4, exerciseMinutes: 33 },
    { day: 10, heartRate: 64, sleepHours: 7.2, sleepQuality: 3, mood: 3, stress: 5, fatigue: 4, appetite: 3, exerciseMinutes: 24 },
    { day: 9, heartRate: 66, sleepHours: 5.8, sleepQuality: 2, mood: 2, stress: 7, fatigue: 6, appetite: 3, exerciseMinutes: 20 },
    { day: 7, heartRate: 62, sleepHours: 8.1, sleepQuality: 4, mood: 4, stress: 3, fatigue: 2, appetite: 4, exerciseMinutes: 28 },
    { day: 5, heartRate: 61, sleepHours: 8.2, sleepQuality: 4, mood: 5, stress: 3, fatigue: 2, appetite: 4, exerciseMinutes: 30 },
  ]

  const crewEntries = crew.map((member, memberIndex) => {
    const baseEntries = [] as HealthEntry[]
    for (let i = 0; i <= 30; i += 1) {
      const isRecentStress = i <= 6 && memberIndex === 0
      const isInfection = i <= 8 && memberIndex === 1
      const isStable = memberIndex === 2

      const offset = i
      const pattern: Partial<HealthEntry> = {
        heartRate: isStable ? 59 + (offset % 3) : isInfection ? 82 + (offset % 4) : 60 + (offset % 4),
        bloodPressureSystolic: isStable ? 116 : 120 + (offset % 5),
        bloodPressureDiastolic: isStable ? 74 : 76 + (offset % 3),
        bodyTemperature: isInfection ? 37.8 + (offset % 2) * 0.2 : 36.8,
        bloodGlucose: 92 + (offset % 5),
        spo2: 98 + (offset % 2),
        sleepHours: isRecentStress ? 5.8 - (offset % 2) * 0.8 : 7.5 - (offset % 3) * 0.5,
        sleepQuality: isRecentStress ? 2 + (offset % 2) : 4,
        mood: isRecentStress ? 2 : 4,
        stress: isRecentStress ? 8 + (offset % 3) : 4,
        fatigue: isRecentStress ? 7 : 3,
        appetite: isRecentStress ? 2 : 4,
        exerciseMinutes: 25 + (offset % 15),
        hydration: 3,
        symptoms: isInfection ? ['fatigue', 'congestion', 'headache'] as SymptomKey[] : isRecentStress ? ['headache'] as SymptomKey[] : [],
        note: isInfection ? 'Feeling run down after exercise' : isRecentStress ? 'Stress is increasing after long task cycle' : 'Feeling good and stable',
        radiationDose: 0.3 + (offset % 4) * 0.2,
      }

      baseEntries.push(makeEntry(offset, pattern))
    }

    const custom = entrySeeds.map((seed) =>
      makeEntry(seed.day, {
        heartRate: seed.heartRate ?? 62,
        sleepHours: seed.sleepHours ?? 8,
        sleepQuality: seed.sleepQuality ?? 4,
        mood: seed.mood ?? 4,
        stress: seed.stress ?? 4,
        fatigue: seed.fatigue ?? 3,
        appetite: seed.appetite ?? 4,
        exerciseMinutes: seed.exerciseMinutes ?? 30,
        symptoms: (seed.symptoms ?? []) as SymptomKey[],
      }),
    )

    return { ...member, entries: [...baseEntries, ...custom].slice(0, 30) }
  })

  return crewEntries
}

export function getDemoSeed() {
  return generateDemoCrew()
}
