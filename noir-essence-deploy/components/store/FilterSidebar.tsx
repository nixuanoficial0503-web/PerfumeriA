'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { X } from 'lucide-react'
import { OLFACTORY_FAMILIES, CONCENTRATION_LABELS, GENDER_LABELS } from '@/constants'
import { formatPrice } from '@/utils/formatPrice'
import { cn } from '@/utils/cn'

const PRICE_RANGES = [
  { label: 'Hasta $100.000', min: 0, max: 10000000 },
  { label: '$100k – $200k', min: 10000000, max: 20000000 },
  { label: '$200k – $350k', min: 20000000, max: 35000000 },
  { label: 'Más de $350.000', min: 35000000, max: 999999999 },
]

export function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const getParam = (key: string) => searchParams.get(key) ?? ''
  const getParamArray = (key: string) => {
    const val = searchParams.get(key)
    return val ? val.split(',') : []
  }

  const selectedFamilies = getParamArray('familia')
  const selectedConcentrations = getParamArray('concentracion')
  const selectedGenders = getParamArray('genero')
  const selectedPriceIdx = getParam('precio')

  const updateParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page') // reset page on filter change
    router.push(`/catalogo?${params.toString()}`)
  }, [router, searchParams])

  function toggleArrayParam(key: string, value: string, current: string[]) {
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    updateParam(key, next.length ? next.join(',') : null)
  }

  function clearAll() {
    router.push('/catalogo')
  }

  const hasFilters = selectedFamilies.length || selectedConcentrations.length || selectedGenders.length || selectedPriceIdx

  return (
    <aside className="w-[220px] flex-shrink-0 border-r border-[rgba(184,154,90,0.15)] overflow-y-auto sticky top-16 h-[calc(100vh-64px)]">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[9px] tracking-[0.2em] uppercase text-muted font-medium">Filtros</p>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-[9px] text-gold hover:text-gold-light transition-colors"
            >
              <X size={10} /> Limpiar
            </button>
          )}
        </div>

        {/* Familia olfativa */}
        <FilterGroup title="Familia olfativa">
          {OLFACTORY_FAMILIES.map(family => (
            <FilterCheckbox
              key={family}
              label={family}
              checked={selectedFamilies.includes(family)}
              onChange={() => toggleArrayParam('familia', family, selectedFamilies)}
            />
          ))}
        </FilterGroup>

        {/* Concentración */}
        <FilterGroup title="Concentración">
          {Object.entries(CONCENTRATION_LABELS).map(([value, label]) => (
            <FilterCheckbox
              key={value}
              label={value}
              sublabel={label}
              checked={selectedConcentrations.includes(value)}
              onChange={() => toggleArrayParam('concentracion', value, selectedConcentrations)}
            />
          ))}
        </FilterGroup>

        {/* Género */}
        <FilterGroup title="Género">
          {Object.entries(GENDER_LABELS).map(([value, label]) => (
            <FilterCheckbox
              key={value}
              label={label}
              checked={selectedGenders.includes(value)}
              onChange={() => toggleArrayParam('genero', value, selectedGenders)}
            />
          ))}
        </FilterGroup>

        {/* Precio */}
        <FilterGroup title="Precio" last>
          {PRICE_RANGES.map((range, i) => (
            <FilterCheckbox
              key={i}
              label={range.label}
              checked={selectedPriceIdx === String(i)}
              onChange={() =>
                updateParam('precio', selectedPriceIdx === String(i) ? null : String(i))
              }
              radio
            />
          ))}
        </FilterGroup>
      </div>
    </aside>
  )
}

// Sub-components
function FilterGroup({
  title,
  children,
  last = false,
}: {
  title: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <div className={cn('mb-6', !last && 'pb-6 border-b border-[rgba(184,154,90,0.1)]')}>
      <p className="text-[9px] tracking-[0.2em] uppercase text-gold mb-3">{title}</p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}

function FilterCheckbox({
  label,
  sublabel,
  checked,
  onChange,
  radio = false,
}: {
  label: string
  sublabel?: string
  checked: boolean
  onChange: () => void
  radio?: boolean
}) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'flex items-center gap-2.5 py-1.5 text-left w-full group',
        checked ? 'text-paper' : 'text-muted hover:text-paper',
        'transition-colors duration-150'
      )}
    >
      {/* Checkbox/Radio indicator */}
      <div className={cn(
        'flex-shrink-0 flex items-center justify-center transition-all duration-150',
        radio ? 'w-3 h-3 rounded-full border' : 'w-3 h-3 border',
        checked
          ? 'border-gold bg-gold'
          : 'border-[rgba(184,154,90,0.3)] group-hover:border-gold/60'
      )}>
        {checked && (
          <div className={cn(
            'bg-ink',
            radio ? 'w-1 h-1 rounded-full' : 'text-ink text-[8px] leading-none'
          )}>
            {!radio && '✓'}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <span className="text-[11px]">{label}</span>
        {sublabel && <span className="text-[9px] text-muted">{sublabel}</span>}
      </div>
    </button>
  )
}
