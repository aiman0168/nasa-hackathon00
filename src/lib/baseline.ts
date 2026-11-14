import type { HealthEntry, MetricKey } from '../types'

export const BASELINE_WINDOW = 7

const matchMetric: Record<MetricKey, (entry: HealthEntry) => number> = {
  heartRate: (entry) => entry.heartRate,
  bloodPressureSystolic: (entry) => entry.bloodPressureSystolic,
  bloodPressureDiastolic: (entry) => entry.bloodPressureDiastolic,
  bodyTemperature: (entry) => entry.bodyTemperature,
  bloodGlucose: (entry) => entry.bloodGlucose,
  spo2: (entry) => entry.spo2,
  sleepHours: (entry) => entry.sleepHours,
  sleepQuality: (entry) => entry.sleepQuality,
  mood: (entry) => entry.mood,
  stress: (entry) => entry.stress,
  fatigue: (entry) => entry.fatigue,
  appetite: (entry) => entry.appetite,
  exerciseMinutes: (entry) => entry.exerciseMinutes,
  radiationDose: (entry) => entry.radiationDose ?? 0,
}

export function computeMetricBaseline(entries: HealthEntry[], metric: MetricKey, windowSize = BASELINE_WINDOW) {
  const values = [...entries].slice(-windowSize).map(matchMetric[metric]).filter((value) => Number.isFinite(value))

  if (values.length === 0) {
    return { average: 0, min: 0, max: 0 }
  }

  const avg = values.reduce((sum, value) => sum + value, 0) / values.length
  const min = Math.min(...values)
  const max = Math.max(...values)

  return { average: avg, min, max }
}

export function computeRollingBaseline(entries: HealthEntry[], metric: MetricKey, windowSize = BASELINE_WINDOW) {
  const values = [...entries].slice(-windowSize).map(matchMetric[metric]).filter((value) => Number.isFinite(value))
  if (values.length === 0) return 0

  return values.reduce((running, value) => running + value, 0) / values.length
}

export function getLatestEntry(entries: HealthEntry[]) {
  return [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? null
}
