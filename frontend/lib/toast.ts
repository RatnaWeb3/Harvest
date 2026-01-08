/**
 * Toast Utility Functions
 * Wrapper around sonner for consistent toast notifications
 */

import { toast } from 'sonner'
import { getExplorerUrl } from '@/lib/move'

export function showSuccess(message: string) {
  toast.success(message)
}

export function showError(message: string) {
  toast.error(message)
}

export function showTxPending(message = 'Waiting for wallet...') {
  return toast.loading(message)
}

export function showTxSuccess(txHash: string, message = 'Transaction confirmed') {
  const explorerUrl = getExplorerUrl('txn', txHash)
  toast.success(message, {
    action: {
      label: 'View',
      onClick: () => window.open(explorerUrl, '_blank'),
    },
  })
}

export function showTxError(message = 'Transaction failed') {
  toast.error(message)
}

export function showTxWarning(message: string) {
  toast.warning(message)
}

export function showGaslessSuccess(txHash: string, message = 'Gasless claim confirmed') {
  const explorerUrl = getExplorerUrl('txn', txHash)
  toast.success(message, {
    description: 'Gas sponsored by Harvest',
    action: {
      label: 'View',
      onClick: () => window.open(explorerUrl, '_blank'),
    },
  })
}

export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId)
}
