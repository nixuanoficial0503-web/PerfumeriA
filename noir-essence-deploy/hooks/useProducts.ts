'use client'

import { useState, useEffect } from 'react'
import type { ProductEntity } from '@/domain/entities/Product'
import type { ProductFilters } from '@/types/product'

interface UseProductsResult {
  products: ProductEntity[]
  total: number
  pages: number
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useProducts(filters: ProductFilters = {}): UseProductsResult {
  const [products, setProducts] = useState<ProductEntity[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.search) params.set('q', filters.search)
      if (filters.gender?.length) params.set('genero', filters.gender.join(','))
      if (filters.concentration?.length) params.set('concentracion', filters.concentration.join(','))
      if (filters.olfactoryFamily?.length) params.set('familia', filters.olfactoryFamily.join(','))
      if (filters.sort) params.set('sort', filters.sort)
      if (filters.page) params.set('page', String(filters.page))

      try {
        const res = await window.fetch(`/api/productos?${params.toString()}`)
        if (!res.ok) throw new Error('Error al cargar productos')
        const data = await res.json()
        if (!cancelled) {
          setProducts(data.products)
          setTotal(data.total)
          setPages(data.pages)
        }
      } catch (err) {
        if (!cancelled) setError('No se pudieron cargar los productos')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [JSON.stringify(filters), tick])

  return { products, total, pages, loading, error, refetch: () => setTick(t => t + 1) }
}
