// infrastructure/repositories/SupabaseProductRepository.ts
import { createClient } from '@/lib/supabase/server'
import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import type { ProductEntity } from '@/domain/entities/Product'
import type { ProductFilters } from '@/types/product'
import { PRODUCTS_PER_PAGE } from '@/constants'

function mapRow(row: any): ProductEntity {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    tagline: row.tagline,
    concentration: row.concentration,
    gender: row.gender,
    olfactoryFamily: row.olfactory_family,
    notesTop: row.notes_top ?? [],
    notesHeart: row.notes_heart ?? [],
    notesBase: row.notes_base ?? [],
    images: row.images ?? [],
    isFeatured: row.is_featured,
    brandName: row.brands?.name ?? null,
    brandSlug: row.brands?.slug ?? null,
    variants: (row.product_variants ?? []).map((v: any) => ({
      id: v.id,
      sizeMl: v.size_ml,
      price: v.price,
      stock: v.stock,
      stripePriceId: v.stripe_price_id,
    })),
  }
}

export class SupabaseProductRepository implements IProductRepository {
  async findAll(filters: ProductFilters) {
    const supabase = await createClient()
    const page = filters.page ?? 1
    const limit = filters.limit ?? PRODUCTS_PER_PAGE
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('products')
      .select(`
        *,
        brands ( id, name, slug, country ),
        product_variants ( id, size_ml, price, stock, stripe_price_id )
      `, { count: 'exact' })
      .eq('is_active', true)
      .range(from, to)

    // Filters
    if (filters.gender?.length) {
      query = query.in('gender', filters.gender)
    }
    if (filters.concentration?.length) {
      query = query.in('concentration', filters.concentration)
    }
    if (filters.olfactoryFamily?.length) {
      query = query.in('olfactory_family', filters.olfactoryFamily)
    }
    if (filters.isFeatured) {
      query = query.eq('is_featured', true)
    }
    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      )
    }
    if (filters.brandSlug) {
      const { data: brand } = await supabase
        .from('brands').select('id').eq('slug', filters.brandSlug).single()
      if (brand) query = query.eq('brand_id', brand.id)
    }

    // Sort
    switch (filters.sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'price_asc':
        query = query.order('id') // sorted client-side by min variant price
        break
      case 'price_desc':
        query = query.order('id')
        break
      default:
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
    }

    const { data, count, error } = await query
    if (error) throw error

    let products = (data ?? []).map(mapRow)

    // Client-side price sort (variants are nested)
    if (filters.sort === 'price_asc') {
      products = products.sort((a, b) =>
        Math.min(...a.variants.map(v => v.price)) - Math.min(...b.variants.map(v => v.price))
      )
    }
    if (filters.sort === 'price_desc') {
      products = products.sort((a, b) =>
        Math.min(...b.variants.map(v => v.price)) - Math.min(...a.variants.map(v => v.price))
      )
    }

    // Filter by price if provided
    if (filters.minPrice || filters.maxPrice) {
      products = products.filter(p => {
        const min = Math.min(...p.variants.map(v => v.price))
        if (filters.minPrice && min < filters.minPrice) return false
        if (filters.maxPrice && min > filters.maxPrice) return false
        return true
      })
    }

    return {
      products,
      total: count ?? 0,
      pages: Math.ceil((count ?? 0) / limit),
    }
  }

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brands ( id, name, slug, country ),
        product_variants ( id, size_ml, price, stock, stripe_price_id )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !data) return null
    return mapRow(data)
  }

  async findFeatured(limit = 8): Promise<ProductEntity[]> {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select(`
        *,
        brands ( id, name, slug, country ),
        product_variants ( id, size_ml, price, stock, stripe_price_id )
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    return (data ?? []).map(mapRow)
  }

  async findRelated(productId: string, limit = 4): Promise<ProductEntity[]> {
    const supabase = await createClient()

    // Get current product's family
    const { data: current } = await supabase
      .from('products')
      .select('olfactory_family, brand_id')
      .eq('id', productId)
      .single()

    if (!current) return []

    const { data } = await supabase
      .from('products')
      .select(`
        *,
        brands ( id, name, slug, country ),
        product_variants ( id, size_ml, price, stock, stripe_price_id )
      `)
      .eq('is_active', true)
      .neq('id', productId)
      .or(`olfactory_family.eq.${current.olfactory_family},brand_id.eq.${current.brand_id}`)
      .limit(limit)

    return (data ?? []).map(mapRow)
  }
}
