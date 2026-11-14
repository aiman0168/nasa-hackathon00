export type MissionEnvironment =
  | 'Spacecraft'
  | 'Space Station'
  | 'Rover'
  | 'Lunar Base'
  | 'Mars Habitat'

export type AlertLevel = 'GREEN' | 'YELLOW' | 'RED'

export type SymptomKey =
  | 'headache'
  | 'nausea'
  | 'dizziness'
  | 'visionChange'
  | 'rash'
  | 'jointPain'
  | 'congestion'
  | 'fatigue'
  | 'chills'
  | 'cough'
  | 'anxiety'
  | 'insomnia'

export type MetricKey =
  | 'heartRate'
  | 'bloodPressureSystolic'
  | 'bloodPressureDiastolic'
  | 'bodyTemperature'
  | 'bloodGlucose'
  | 'spo2'
  | 'sleepHours'
  | 'sleepQuality'
  | 'mood'
  | 'stress'
  | 'fatigue'
  | 'appetite'
  | 'exerciseMinutes'
  | 'radiationDose'

export interface HealthEntry {
  id: string
  date: string
  heartRate: number
  bloodPressureSystolic: number
  bloodPressureDiastolic: number
  bodyTemperature: number
  bloodGlucose: number
  spo2: number
  sleepHours: number
  sleepQuality: number
  mood: number
  stress: number
  fatigue: number
  appetite: number
  exerciseMinutes: number
  hydration: number
  symptoms: SymptomKey[]
  note: string
  radiationDose: number | null
}

export interface CrewMember {
  id: string
  name: string
  age: number
  sex: 'Female' | 'Male' | 'Other'
  missionEnvironment: MissionEnvironment
  missionDay: number
  createdAt: string
  streak: number
  xp: number
  badges: string[]
  entries: HealthEntry[]
}

export interface MetricStatus {
  metric: MetricKey
  label: string
  value: number | null
  baseline: number | null
  level: AlertLevel
  statusText: string
  delta: number
  reason: string
}

export interface AlertSummary {
  id: string
  title: string
  message: string
  metric: MetricKey | 'summary'
  level: AlertLevel
  date: string
  guidance: string
  why: string
  actions: string[]
}

export interface ReadinessSummary {
  score: number
  overall: AlertLevel
  narrative: string
  alerts: AlertSummary[]
  metricStatuses: MetricStatus[]
}

export interface CrewContext {
  crew: CrewMember
  readiness: ReadinessSummary
}
