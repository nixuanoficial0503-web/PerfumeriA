// types/product.ts

export interface ProductVariant {
  id: string
  productId: string
  sizeMl: number
  price: number       // centavos COP
  stock: number
  sku: string | null
  stripePriceId: string | null
}

export interface Product {
  id: string
  brandId: string | null
  name: string
  slug: string
  description: string | null
  tagline: string | null
  concentration: 'EDC' | 'EDT' | 'EDP' | 'Parfum' | null
  gender: 'masculino' | 'femenino' | 'unisex' | null
  olfactoryFamily: string | null
  notesTop: string[]
  notesHeart: string[]
  notesBase: string[]
  images: string[]
  isActive: boolean
  isFeatured: boolean
  createdAt: string
}

export interface ProductWithBrand extends Product {
  brand: {
    id: string
    name: string
    slug: string
    country: string | null
  } | null
  variants: ProductVariant[]
}

export interface ProductWithRating extends ProductWithBrand {
  avgRating: number | null
  reviewCount: number
}

// Filters for catalog
export interface ProductFilters {
  olfactoryFamily?: string[]
  concentration?: string[]
  gender?: string[]
  minPrice?: number
  maxPrice?: number
  brandSlug?: string
  search?: string
  isFeatured?: boolean
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular'
  page?: number
  limit?: number
}
