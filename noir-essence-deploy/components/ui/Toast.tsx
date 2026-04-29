'use client'

import { useUIStore } from '@/store/uiStore'
import { cn } from '@/utils/cn'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const STYLES = {
  success: 'border-success/30 bg-success/10 text-success',
  error: 'border-error/30 bg-error/10 text-error',
  info: 'border-info/30 bg-info/10 text-info',
}

export function Toast() {
  const { toast, hideToast } = useUIStore()

  if (!toast) return null

  const Icon = ICONS[toast.type]

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-fade-in">
      <div className={cn(
        'flex items-center gap-3 px-4 py-3 border text-sm max-w-sm',
        STYLES[toast.type]
      )}>
        <Icon size={14} className="flex-shrink-0" />
        <span className="font-sans font-light">{toast.message}</span>
        <button onClick={hideToast} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
          <X size={12} />
        </button>
      </div>
    </div>
  )
}
