import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://noiressence.vercel.app'

export function buildProductMeta(product: {
  name: string
  description: string | null
  tagline: string | null
  brandName: string | null
  images: string[]
  slug: string
}): Metadata {
  const title = `${product.name} — ${product.brandName ?? 'NOIR·ESSENCE'}`
  const description = product.description ?? product.tagline ?? 'Fragancia de autor. Descubre NOIR·ESSENCE.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/producto/${product.slug}`,
      images: product.images[0] ? [{
        url: product.images[0],
        width: 800,
        height: 960,
        alt: product.name,
      }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.images[0] ? [product.images[0]] : [],
    },
    alternates: {
      canonical: `${BASE_URL}/producto/${product.slug}`,
    },
  }
}

export function buildCatalogMeta(filters?: { familia?: string; genero?: string }): Metadata {
  const suffix = filters?.familia ? ` — ${filters.familia}` : ''
  return {
    title: `Catálogo${suffix} — NOIR·ESSENCE`,
    description: 'Explora nuestra colección de perfumes de autor. Fragancias nicho seleccionadas para Colombia.',
    openGraph: {
      title: `Catálogo de fragancias${suffix}`,
      description: 'Perfumes de autor. Cada fragancia, una historia.',
    },
  }
}
