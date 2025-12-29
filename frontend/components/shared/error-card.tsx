'use client'

/**
 * ErrorCard Component
 * Displays user-friendly error messages with retry option
 */

import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'

interface ErrorCardProps {
  title?: string
  message: string
  onRetry?: () => void
  isRetrying?: boolean
}

export function ErrorCard({
  title = 'Something went wrong',
  message,
  onRetry,
  isRetrying = false,
}: ErrorCardProps) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">{message}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
