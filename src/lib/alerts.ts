import { computeMetricBaseline, getLatestEntry } from './baseline'
import type { AlertLevel, AlertSummary, CrewMember, HealthEntry, MetricKey, ReadinessSummary } from '../types'

const metricLimits: Record<MetricKey, { min?: number; max?: number }> = {
  heartRate: { min: 45, max: 125 },
  bloodPressureSystolic: { min: 90, max: 155 },
  bloodPressureDiastolic: { min: 55, max: 95 },
  bodyTemperature: { min: 35.5, max: 38.5 },
  bloodGlucose: { min: 70, max: 180 },
  spo2: { min: 92, max: 100 },
  sleepHours: { min: 4, max: 10 },
  sleepQuality: { min: 1, max: 5 },
  mood: { min: 1, max: 5 },
  stress: { min: 1, max: 10 },
  fatigue: { min: 1, max: 10 },
  appetite: { min: 1, max: 5 },
  exerciseMinutes: { min: 0, max: 120 },
  radiationDose: { min: 0, max: 5 },
}

const metricLabels: Record<MetricKey, string> = {
  heartRate: 'Heart rate',
  bloodPressureSystolic: 'Systolic BP',
  bloodPressureDiastolic: 'Diastolic BP',
  bodyTemperature: 'Temperature',
  bloodGlucose: 'Blood glucose',
  spo2: 'SpO₂',
  sleepHours: 'Sleep hours',
  sleepQuality: 'Sleep quality',
  mood: 'Mood',
  stress: 'Stress',
  fatigue: 'Fatigue',
  appetite: 'Appetite',
  exerciseMinutes: 'Exercise',
  radiationDose: 'Radiation',
}

function clampStatus(level: AlertLevel) {
  return level
}

function getMetricLevel(value: number, baseline: number, min?: number, max?: number): AlertLevel {
  if (typeof min !== 'undefined' && value < min) return clampStatus('RED')
  if (typeof max !== 'undefined' && value > max) return clampStatus('RED')

  const deviation = Math.abs(value - baseline) / Math.max(baseline, 1)
  if (deviation > 0.2) return clampStatus('YELLOW')
  return clampStatus('GREEN')
}

export function evaluateMetricStatus(
  entry: HealthEntry,
  history: HealthEntry[],
  metric: MetricKey,
): { level: AlertLevel; delta: number; message: string; baseline: number } {
  const baseline = computeMetricBaseline(history, metric).average
  const value = entry[metric] as number
  const metricInfo = metricLimits[metric]
  const delta = value - baseline

  let level: AlertLevel = 'GREEN'
  let message = 'Within expected range.'

  if (metricInfo.min !== undefined && value < metricInfo.min) {
    level = 'RED'
    message = `${metricLabels[metric]} is below a safe floor.`
  } else if (metricInfo.max !== undefined && value > metricInfo.max) {
    level = 'RED'
    message = `${metricLabels[metric]} exceeds the safety threshold.`
  } else {
    const computedLevel = getMetricLevel(value, baseline, undefined, undefined)
    if (Math.abs(delta) / Math.max(Math.abs(baseline), 1) > 0.2 || computedLevel === 'YELLOW') {
      level = 'YELLOW'
      message = `${metricLabels[metric]} is drifting from your baseline.`
    }
  }

  if (metric === 'sleepHours' && value < 6) {
    level = 'YELLOW'
    message = 'Sleep is trending low, which can worsen stress and recovery.'
  }

  if (metric === 'stress' && value > 7) {
    level = 'YELLOW'
    message = 'Stress is elevated and may affect sleep and mood.'
  }

  if (metric === 'mood' && value <= 2) {
    level = 'YELLOW'
    message = 'Mood is below your recent pattern and deserves attention.'
  }

  return { level, delta, message, baseline }
}

export function generateAlerts(member: CrewMember): AlertSummary[] {
  const recent = [...member.entries].slice(-7)
  if (!recent.length) return []

  const latest = recent[recent.length - 1]
  const alerts: AlertSummary[] = []

  const checkMetric = (metric: MetricKey, title: string, guidance: string, reason: string) => {
    const result = evaluateMetricStatus(latest, member.entries, metric)
    if (result.level !== 'GREEN') {
      alerts.push({
        id: `${member.id}-${metric}`,
        title,
        message: result.message,
        metric,
        level: result.level,
        date: latest.date,
        guidance,
        why: reason,
        actions: ['Recheck with the same method', 'Document symptoms', 'Review the last several days'],
      })
    }
  }

  checkMetric('heartRate', 'Heart rate drift', 'Resting HR and trend matter more than a single spike.', 'Spaceflight stress and dehydration can increase heart rate even before obvious symptoms appear.')
  checkMetric('sleepHours', 'Sleep debt', 'Recovery depends on consistent rest and good sleep quality.', 'Poor sleep increases mood disruption, stress, and immune vulnerability in isolated missions.')
  checkMetric('mood', 'Mood change', 'Check for stressor buildup and time away from routine.', 'Confinement and communication delay can amplify mental health strain.')

  const stressMoodSleep = latest.stress > 7 && latest.mood <= 2 && latest.sleepHours < 6
  if (stressMoodSleep) {
    alerts.push({
      id: `${member.id}-behavioral`,
      title: 'Behavioral health risk',
      message: 'Low mood, poor sleep, and high stress are clustering together.',
      metric: 'summary',
      level: 'YELLOW',
      date: latest.date,
      guidance: 'Contact support early and reduce workload pressure while continuing your routine.',
      why: 'Isolation and mission demands can compound stress, sleep debt, and emotional strain.',
      actions: ['Check in with a crewmate', 'Reduce unnecessary tasks', 'Rest and hydrate'],
    })
  }

  const infectionPattern = latest.heartRate > 85 && latest.bodyTemperature > 37.4 && latest.fatigue > 6
  if (infectionPattern) {
    alerts.push({
      id: `${member.id}-infection`,
      title: 'Possible infection',
      message: 'Persistently elevated heart rate plus temperature and fatigue may suggest a developing infection.',
      metric: 'summary',
      level: 'RED',
      date: latest.date,
      guidance: 'Contact your flight surgeon urgently. In a mission setting, reply with symptoms and current status while waiting for instructions.',
      why: 'Closed habitats and immune stress create conditions where mild infection symptoms can escalate without early support.',
      actions: ['Rest and monitor symptoms', 'Hydrate', 'Limit exertion until assessed'],
    })
  }

  const hypertensionPattern = latest.bloodPressureSystolic > 145 && latest.symptoms.includes('headache')
  if (hypertensionPattern) {
    alerts.push({
      id: `${member.id}-hypertension`,
      title: 'Cardiovascular warning',
      message: 'High blood pressure with headache or vision changes needs attention.',
      metric: 'summary',
      level: 'RED',
      date: latest.date,
      guidance: 'Stop exertion and contact flight surgery immediately. If symptoms worsen, follow the emergency protocol for delayed communications.',
      why: 'Cardiovascular stress can be amplified by dehydration, reduced gravity, and workload during long missions.',
      actions: ['Rest in a quiet environment', 'Hydrate', 'Document symptoms'],
    })
  }

  return alerts
}

export function computeReadiness(member: CrewMember): ReadinessSummary {
  const alerts = generateAlerts(member)
  const latest = getLatestEntry(member.entries)
  const scoreBase = latest ? 100 : 0
  let score = scoreBase

  if (latest) {
    if (latest.sleepHours < 6) score -= 10
    if (latest.stress > 7) score -= 10
    if (latest.mood <= 2) score -= 10
    if (latest.heartRate > 85) score -= 8
    if (latest.bodyTemperature > 37.5) score -= 12
    if (alerts.some((alert) => alert.level === 'RED')) score -= 20
  }

  const overall: AlertLevel = score >= 80 ? 'GREEN' : score >= 60 ? 'YELLOW' : 'RED'

  const metricStatuses = (Object.keys(metricLimits) as MetricKey[]).map((metric): ReadinessSummary['metricStatuses'][number] => {
    if (!latest) {
      return {
        metric,
        label: metricLabels[metric],
        value: null,
        baseline: null,
        level: 'GREEN',
        statusText: 'No data',
        delta: 0,
        reason: 'No entry yet',
      }
    }

    const status = evaluateMetricStatus(latest, member.entries, metric)
    return {
      metric,
      label: metricLabels[metric],
      value: Number(latest[metric] ?? 0),
      baseline: status.baseline,
      level: status.level,
      statusText: status.message,
      delta: status.delta,
      reason: status.message,
    }
  })

  return {
    score: Math.max(0, Math.min(100, score)),
    overall,
    narrative: overall === 'GREEN' ? 'Crew is trending within expected readiness limits.' : overall === 'YELLOW' ? 'Some indicators are drifting and deserve monitoring.' : 'High-risk pattern detected; immediate action recommended.',
    alerts,
    metricStatuses,
  }
}
