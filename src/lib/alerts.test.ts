import { describe, expect, it } from 'vitest'
import { computeReadiness, generateAlerts } from './alerts'
import { getDemoSeed } from './demoData'

describe('alert engine', () => {
  it('flags a stress and sleep pattern as a behavioral risk', () => {
    const crew = getDemoSeed()[0]
    crew.entries = [
      ...crew.entries,
      {
        id: 'stress-test',
        date: new Date().toISOString(),
        heartRate: 72,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 78,
        bodyTemperature: 36.9,
        bloodGlucose: 98,
        spo2: 99,
        sleepHours: 5.5,
        sleepQuality: 2,
        mood: 1,
        stress: 9,
        fatigue: 8,
        appetite: 2,
        exerciseMinutes: 20,
        hydration: 2,
        symptoms: ['headache', 'dizziness'],
        note: 'Feeling isolated and under pressure.',
        radiationDose: 0.5,
      },
    ]

    const alerts = generateAlerts(crew)
    expect(alerts.some((alert) => alert.title === 'Behavioral health risk')).toBe(true)
  })

  it('computes a readiness score between 0 and 100', () => {
    const crew = getDemoSeed()[0]
    const readiness = computeReadiness(crew)
    expect(readiness.score).toBeGreaterThanOrEqual(0)
    expect(readiness.score).toBeLessThanOrEqual(100)
  })
})
