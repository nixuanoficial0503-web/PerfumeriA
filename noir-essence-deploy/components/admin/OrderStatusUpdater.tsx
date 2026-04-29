'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ORDER_STATUS_LABELS } from '@/constants'
import { cn } from '@/utils/cn'
import type { OrderStatus } from '@/types/order'

const NEXT_STATUS: Record<string, OrderStatus[]> = {
  pending:    ['paid', 'cancelled'],
  paid:       ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped:    ['delivered'],
  delivered:  [],
  cancelled:  [],
}

interface Props {
  orderId: string
  currentStatus: string
}

export function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const nextStatuses = NEXT_STATUS[currentStatus] ?? []

  async function update(newStatus: OrderStatus) {
    setLoading(true)
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    router.refresh()
    setLoading(false)
  }

  if (!nextStatuses.length) {
    return <span className="text-[9px] text-muted/40">—</span>
  }

  return (
    <div className="flex flex-col gap-1.5">
      {nextStatuses.map(s => (
        <button key={s} onClick={() => update(s)} disabled={loading}
          className={cn(
            'text-[9px] tracking-[0.1em] uppercase px-2 py-1 border transition-colors text-left',
            s === 'cancelled'
              ? 'border-error/30 text-error/70 hover:border-error hover:text-error'
              : 'border-[rgba(184,154,90,0.2)] text-muted hover:border-gold hover:text-gold',
            loading && 'opacity-40 cursor-not-allowed'
          )}>
          → {ORDER_STATUS_LABELS[s]}
        </button>
      ))}
    </div>
  )
}
