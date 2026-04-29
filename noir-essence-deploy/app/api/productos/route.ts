import { NextResponse, type NextRequest } from 'next/server'
import { SupabaseProductRepository } from '@/infrastructure/repositories/SupabaseProductRepository'
import { GetProducts } from '@/domain/use-cases/products/GetProducts'
import type { ProductFilters } from '@/types/product'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const filters: ProductFilters = {
    search: searchParams.get('q') ?? undefined,
    gender: searchParams.get('genero')?.split(',') as any,
    concentration: searchParams.get('concentracion')?.split(',') as any,
    olfactoryFamily: searchParams.get('familia')?.split(','),
    sort: (searchParams.get('sort') as ProductFilters['sort']) ?? 'popular',
    page: Number(searchParams.get('page') ?? 1),
  }

  try {
    const repo = new SupabaseProductRepository()
    const result = await new GetProducts(repo).execute(filters)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[GET /api/productos]', err)
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}
