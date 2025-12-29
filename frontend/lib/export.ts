/**
 * Export Utilities
 * Functions for exporting data to various formats (CSV, etc.)
 */

import type { ClaimHistory } from '@/app/rewards/types'
import { PROTOCOL_NAMES } from '@/app/dashboard/constants'

/**
 * Format date for CSV export
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Format USD value for display
 */
function formatUsd(value: number): string {
  return value.toFixed(2)
}

/**
 * Escape CSV field (handle commas, quotes, newlines)
 */
function escapeCSV(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

/**
 * Convert claim history to CSV format
 */
export function claimHistoryToCSV(history: ClaimHistory[]): string {
  const headers = ['Date', 'Protocol', 'Token', 'Amount', 'USD Value', 'Status', 'Transaction Hash']
  const rows: string[][] = []

  for (const claim of history) {
    for (const reward of claim.rewards) {
      rows.push([
        formatDate(claim.timestamp),
        PROTOCOL_NAMES[claim.protocol] || claim.protocol,
        reward.tokenSymbol,
        reward.amount,
        formatUsd(reward.usdValue),
        claim.status,
        claim.txHash,
      ])
    }
  }

  const headerRow = headers.map(escapeCSV).join(',')
  const dataRows = rows.map((row) => row.map(escapeCSV).join(',')).join('\n')

  return `${headerRow}\n${dataRows}`
}

/**
 * Trigger download of a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export claim history to CSV and trigger download
 */
export function exportClaimHistoryCSV(history: ClaimHistory[]): void {
  const csv = claimHistoryToCSV(history)
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `harvest-claim-history-${timestamp}.csv`
  downloadFile(csv, filename, 'text/csv;charset=utf-8;')
}
