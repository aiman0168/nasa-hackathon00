import type { CrewMember } from '../types'

const STORAGE_PREFIX = 'vio:'

export const storageKeys = {
  crew: `${STORAGE_PREFIX}crew`,
  activeCrewId: `${STORAGE_PREFIX}activeCrewId`,
  lastCheckIn: `${STORAGE_PREFIX}lastCheckIn`,
}

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  const value = window.localStorage.getItem(key)

  if (!value) return fallback

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function readCrew(): CrewMember[] {
  return readStorage<CrewMember[]>(storageKeys.crew, [])
}

export function writeCrew(crew: CrewMember[]) {
  writeStorage(storageKeys.crew, crew)
}

export function readActiveCrewId(): string | null {
  return readStorage<string | null>(storageKeys.activeCrewId, null)
}

export function writeActiveCrewId(id: string | null) {
  writeStorage(storageKeys.activeCrewId, id)
}
