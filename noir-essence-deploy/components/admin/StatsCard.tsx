import { cn } from '@/utils/cn'

interface StatsCardProps {
  label: string
  value: string
  change?: string
  up?: boolean
  sub?: string
}

export function StatsCard({ label, value, change, up = true, sub }: StatsCardProps) {
  return (
    <div className="bg-ink border border-[rgba(184,154,90,0.2)] p-5">
      <p className="text-[8px] tracking-[0.2em] uppercase text-muted mb-3">{label}</p>
      <p className="font-serif text-2xl font-light text-paper mb-1">{value}</p>
      {change && (
        <p className={cn('text-[9px]', up ? 'text-success' : 'text-error')}>{change}</p>
      )}
      {sub && <p className="text-[9px] text-muted mt-0.5">{sub}</p>}
    </div>
  )
}
