// domain/entities/Product.ts

export interface ProductEntity {
  id: string
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
  isFeatured: boolean
  brandName: string | null
  brandSlug: string | null
  variants: {
    id: string
    sizeMl: number
    price: number
    stock: number
    stripePriceId: string | null
  }[]
}

export function getMinPrice(product: ProductEntity): number {
  if (!product.variants.length) return 0
  return Math.min(...product.variants.map(v => v.price))
}

export function getMaxPrice(product: ProductEntity): number {
  if (!product.variants.length) return 0
  return Math.max(...product.variants.map(v => v.price))
}

export function isInStock(product: ProductEntity): boolean {
  return product.variants.some(v => v.stock > 0)
}

export function getAllNotes(product: ProductEntity): string[] {
  return [...product.notesTop, ...product.notesHeart, ...product.notesBase]
}
