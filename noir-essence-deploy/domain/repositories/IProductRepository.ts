// domain/repositories/IProductRepository.ts
import type { ProductEntity } from '@/domain/entities/Product'
import type { ProductFilters } from '@/types/product'

export interface IProductRepository {
  findAll(filters: ProductFilters): Promise<{
    products: ProductEntity[]
    total: number
    pages: number
  }>
  findBySlug(slug: string): Promise<ProductEntity | null>
  findFeatured(limit?: number): Promise<ProductEntity[]>
  findRelated(productId: string, limit?: number): Promise<ProductEntity[]>
}
