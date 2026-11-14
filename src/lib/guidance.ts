import type { AlertLevel, MetricKey } from '../types'

export type AlertGuide = {
  title: string
  meaning: string
  why: string
  doNow: string[]
  escalate: string
  checklist: string[]
  level: AlertLevel
}

export const metricLabels: Record<MetricKey, string> = {
  heartRate: 'Resting heart rate',
  bloodPressureSystolic: 'Systolic blood pressure',
  bloodPressureDiastolic: 'Diastolic blood pressure',
  bodyTemperature: 'Body temperature',
  bloodGlucose: 'Blood glucose',
  spo2: 'Blood oxygen',
  sleepHours: 'Sleep duration',
  sleepQuality: 'Sleep quality',
  mood: 'Mood',
  stress: 'Stress',
  fatigue: 'Fatigue',
  appetite: 'Appetite / nutrition',
  exerciseMinutes: 'Exercise minutes',
  radiationDose: 'Radiation dose',
}

export const alertsGuide: Record<string, AlertGuide> = {
  default: {
    title: 'Monitor the trend',
    meaning: 'This value is outside your recent baseline but may still be within a broad normal range.',
    why: 'Spaceflight stresses the body in ways that can shift sleep, mood, and recovery when adaptation is incomplete.',
    doNow: ['Recheck the reading using the same method and time of day.', 'Hydrate, rest, and log symptoms.', 'Review the last 3-7 days for drift or repeated alerts.'],
    escalate: 'Escalate if the pattern persists, symptoms worsen, or the reading remains outside the expected range.',
    checklist: ['I rechecked the metric.', 'I noted the time and conditions.', 'I tracked symptoms and sleep.', 'I updated my crew notes.'],
    level: 'YELLOW',
  },
  infection: {
    title: 'Possible infection',
    meaning: 'A rising heart rate, temperature, or fatigue pattern may indicate a developing infection or inflammatory response.',
    why: 'Closed habitats and stress can increase infection risk, while an astronaut may not notice early signs during isolation.',
    doNow: ['Avoid adding heavy exertion and rest more than usual.', 'Hydrate and monitor your temperature and symptoms every 2-4 hours.', 'Review any recent illness exposure and log all symptoms.'],
    escalate: 'Escalate urgently if your temperature is elevated, you feel weak, or you have worsening chills or breathing symptoms.',
    checklist: ['I checked my temperature twice.', 'I tracked my heart rate and fatigue.', 'I noted any fever, cough, or chills.', 'I have a plan to contact flight surgery.'],
    level: 'RED',
  },
  stress: {
    title: 'Behavioral health risk',
    meaning: 'Poor sleep, high stress, and low mood together can predict a mental health risk during isolation and confinement.',
    why: 'Long-duration missions combine confinement, communication delay, and workload stress, which can amplify mood and sleep changes.',
    doNow: ['Stop and normalize your routine: sleep window, hydration, and meal timing.', 'Schedule a short check-in with a crewmate or mission support.', 'Use a calm-down routine and reduce nonessential tasks.'],
    escalate: 'Escalate if you feel hopeless, unsafe, detached, or unable to function; this is not a diagnosis and support is available.',
    checklist: ['I reviewed my sleep and stress trends.', 'I checked in with a crewmate.', 'I planned a rest period and reduced demands.', 'I noted warning signs to share with the team.'],
    level: 'YELLOW',
  },
}

export function getAlertGuide(metric: MetricKey | 'summary', level: AlertLevel) {
  const base = metric === 'summary' ? alertsGuide.default : alertsGuide.default
  return {
    ...base,
    level,
  }
}
