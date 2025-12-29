/**
 * Streak Tracking Utility
 * Calculate and track daily claim streaks
 */

const STREAK_STORAGE_KEY = 'harvest_claim_streak'
const LAST_CLAIM_KEY = 'harvest_last_claim_date'

interface StreakData {
  currentStreak: number
  lastClaimDate: string | null
  longestStreak: number
}

function getStoredData(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, lastClaimDate: null, longestStreak: 0 }
  }

  try {
    const data = localStorage.getItem(STREAK_STORAGE_KEY)
    return data ? JSON.parse(data) : { currentStreak: 0, lastClaimDate: null, longestStreak: 0 }
  } catch {
    return { currentStreak: 0, lastClaimDate: null, longestStreak: 0 }
  }
}

function saveStreakData(data: StreakData) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data))
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isConsecutiveDay(lastDate: Date, currentDate: Date): boolean {
  const nextDay = new Date(lastDate)
  nextDay.setDate(nextDay.getDate() + 1)
  return isSameDay(nextDay, currentDate)
}

export function getCurrentStreak(): number {
  return getStoredData().currentStreak
}

export function getLongestStreak(): number {
  return getStoredData().longestStreak
}

export function recordClaim(): StreakData {
  const data = getStoredData()
  const now = new Date()
  const lastClaim = data.lastClaimDate ? new Date(data.lastClaimDate) : null

  if (!lastClaim) {
    // First claim ever
    data.currentStreak = 1
  } else if (isSameDay(lastClaim, now)) {
    // Already claimed today - no change
    return data
  } else if (isConsecutiveDay(lastClaim, now)) {
    // Consecutive day claim - increment streak
    data.currentStreak += 1
  } else {
    // Streak broken - reset to 1
    data.currentStreak = 1
  }

  data.lastClaimDate = now.toISOString()
  data.longestStreak = Math.max(data.longestStreak, data.currentStreak)

  saveStreakData(data)
  return data
}

export function checkStreakStatus(): { isActive: boolean; willExpireIn: number } {
  const data = getStoredData()
  if (!data.lastClaimDate) {
    return { isActive: false, willExpireIn: 0 }
  }

  const lastClaim = new Date(data.lastClaimDate)
  const now = new Date()
  const endOfDay = new Date(lastClaim)
  endOfDay.setDate(endOfDay.getDate() + 1)
  endOfDay.setHours(23, 59, 59, 999)

  const msUntilExpiry = endOfDay.getTime() - now.getTime()
  const hoursUntilExpiry = Math.max(0, Math.floor(msUntilExpiry / (1000 * 60 * 60)))

  return {
    isActive: msUntilExpiry > 0,
    willExpireIn: hoursUntilExpiry,
  }
}
