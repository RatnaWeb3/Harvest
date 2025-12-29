/**
 * Airdrop Reminders
 * localStorage-based reminder system with browser notifications
 */

import type { AirdropReminder } from '@/app/airdrops/types'

const STORAGE_KEY = 'harvest-airdrop-reminders'

/**
 * Get all stored reminders
 */
export function getReminders(): AirdropReminder[] {
  if (typeof window === 'undefined') return []

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []

  try {
    const reminders = JSON.parse(stored) as AirdropReminder[]
    return reminders.map((r) => ({ ...r, reminderDate: new Date(r.reminderDate) }))
  } catch {
    return []
  }
}

/**
 * Add a reminder for an airdrop
 */
export function addReminder(airdropId: string, airdropName: string, reminderDate: Date): void {
  const reminders = getReminders()
  const exists = reminders.some((r) => r.airdropId === airdropId)

  if (exists) return

  reminders.push({ airdropId, airdropName, reminderDate, notified: false })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
}

/**
 * Remove a reminder
 */
export function removeReminder(airdropId: string): void {
  const reminders = getReminders().filter((r) => r.airdropId !== airdropId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
}

/**
 * Check if reminder exists
 */
export function hasReminder(airdropId: string): boolean {
  return getReminders().some((r) => r.airdropId === airdropId)
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

/**
 * Show browser notification
 */
export function showNotification(title: string, body: string): void {
  if (Notification.permission !== 'granted') return

  new Notification(title, {
    body,
    icon: '/favicon.ico',
    tag: 'harvest-airdrop',
  })
}

/**
 * Check and trigger due reminders
 */
export function checkReminders(): void {
  const reminders = getReminders()
  const now = new Date()

  reminders.forEach((reminder) => {
    if (!reminder.notified && new Date(reminder.reminderDate) <= now) {
      showNotification('Airdrop Reminder', `${reminder.airdropName} is now live!`)
      reminder.notified = true
    }
  })

  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
}
