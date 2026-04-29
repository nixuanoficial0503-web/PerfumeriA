// domain/use-cases/products/GetProducts.ts
import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import type { ProductFilters } from '@/types/product'

export class GetProducts {
  constructor(private repo: IProductRepository) {}

  async execute(filters: ProductFilters = {}) {
    return this.repo.findAll(filters)
  }
}

export class GetProductBySlug {
  constructor(private repo: IProductRepository) {}

  async execute(slug: string) {
    return this.repo.findBySlug(slug)
  }
}

export class GetFeaturedProducts {
  constructor(private repo: IProductRepository) {}

  async execute(limit?: number) {
    return this.repo.findFeatured(limit)
  }
}

export class GetRelatedProducts {
  constructor(private repo: IProductRepository) {}

  async execute(productId: string, limit?: number) {
    return this.repo.findRelated(productId, limit)
  }
}
