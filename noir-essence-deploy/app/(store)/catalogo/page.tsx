import { Suspense } from 'react'
import type { Metadata } from 'next'
import { FilterSidebar } from '@/components/store/FilterSidebar'
import { ProductCard } from '@/components/store/ProductCard'
import { SupabaseProductRepository } from '@/infrastructure/repositories/SupabaseProductRepository'
import { GetProducts } from '@/domain/use-cases/products/GetProducts'
import type { ProductFilters } from '@/types/product'
import { OLFACTORY_FAMILIES } from '@/constants'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Catálogo — Todas las fragancias',
  description: 'Explora nuestra colección completa de perfumes de autor. Filtra por familia olfativa, concentración y precio.',
}

const PRICE_RANGES = [
  { min: 0, max: 10000000 },
  { min: 10000000, max: 20000000 },
  { min: 20000000, max: 35000000 },
  { min: 35000000, max: 999999999 },
]

interface CatalogoPageProps {
  searchParams: Promise<{
    familia?: string
    concentracion?: string
    genero?: string
    precio?: string
    sort?: string
    q?: string
    page?: string
  }>
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const priceRange = params.precio !== undefined ? PRICE_RANGES[Number(params.precio)] : undefined

  const filters: ProductFilters = {
    olfactoryFamily: params.familia?.split(','),
    concentration: params.concentracion?.split(',') as any,
    gender: params.genero?.split(',') as any,
    search: params.q,
    sort: (params.sort as ProductFilters['sort']) ?? 'popular',
    minPrice: priceRange?.min,
    maxPrice: priceRange?.max,
    page,
  }

  const repo = new SupabaseProductRepository()
  const useCase = new GetProducts(repo)
  const { products, total, pages } = await useCase.execute(filters)

  const buildPageUrl = (p: number) => {
    const sp = new URLSearchParams(params as any)
    sp.set('page', String(p))
    return `/catalogo?${sp.toString()}`
  }

  return (
    <div className="min-h-screen bg-ink">
      {/* Header strip */}
      <div className="border-b border-[rgba(184,154,90,0.15)] px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-3xl font-light text-paper">
            {params.q ? `Resultados para "${params.q}"` : 'Catálogo'}
          </h1>
          <p className="text-[10px] text-muted mt-1">{total} fragancias</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <Suspense fallback={<div className="w-[220px]" />}>
          <FilterSidebar />
        </Suspense>

        {/* Main */}
        <div className="flex-1 px-6 py-6 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(184,154,90,0.1)]">
            <p className="text-[10px] text-muted">
              {products.length} de {total} productos
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted">Ordenar:</span>
              <SortSelect current={params.sort ?? 'popular'} params={params} />
            </div>
          </div>

          {/* Search bar */}
          <SearchBar defaultValue={params.q ?? ''} params={params} />

          {/* Grid */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <p className="text-muted text-sm">No encontramos fragancias con esos filtros.</p>
              <Link href="/catalogo" className="btn-ghost">Limpiar filtros</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={i < 4}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {page > 1 && (
                <Link href={buildPageUrl(page - 1)} className="btn-ghost px-3 py-2">
                  <ChevronLeft size={14} />
                </Link>
              )}
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <Link
                  key={p}
                  href={buildPageUrl(p)}
                  className={p === page
                    ? 'w-8 h-8 flex items-center justify-center bg-gold text-ink text-[10px] font-medium'
                    : 'w-8 h-8 flex items-center justify-center border border-[rgba(184,154,90,0.2)] text-muted text-[10px] hover:border-gold hover:text-gold transition-colors'
                  }
                >
                  {p}
                </Link>
              ))}
              {page < pages && (
                <Link href={buildPageUrl(page + 1)} className="btn-ghost px-3 py-2">
                  <ChevronRight size={14} />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Client sub-components ────────────────────────────────────────

function SortSelect({ current, params }: { current: string; params: any }) {
  const options = [
    { value: 'popular', label: 'Más populares' },
    { value: 'newest', label: 'Más recientes' },
    { value: 'price_asc', label: 'Precio: menor a mayor' },
    { value: 'price_desc', label: 'Precio: mayor a menor' },
  ]

  return (
    <form>
      {Object.entries(params).filter(([k]) => k !== 'sort').map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v as string} />
      ))}
      <select
        name="sort"
        defaultValue={current}
        onChange={e => {
          const form = e.target.form!
          form.submit()
        }}
        className="bg-transparent border border-[rgba(184,154,90,0.2)] text-paper text-[10px] px-3 py-1.5 focus:outline-none focus:border-gold font-sans cursor-pointer"
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-smoke">
            {o.label}
          </option>
        ))}
      </select>
    </form>
  )
}

function SearchBar({ defaultValue, params }: { defaultValue: string; params: any }) {
  return (
    <form className="mb-6 flex gap-2">
      {Object.entries(params).filter(([k]) => k !== 'q' && k !== 'page').map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v as string} />
      ))}
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Buscar por nombre, nota olfativa..."
        className="input-dark flex-1 py-2 text-xs"
      />
      <button type="submit" className="btn-primary px-4 py-2 text-[10px]">
        Buscar
      </button>
    </form>
  )
}
