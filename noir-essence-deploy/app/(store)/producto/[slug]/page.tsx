import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SupabaseProductRepository } from '@/infrastructure/repositories/SupabaseProductRepository'
import { GetProductBySlug, GetRelatedProducts } from '@/domain/use-cases/products/GetProducts'
import { NotesPyramid } from '@/components/store/NotesPyramid'
import { ProductCard } from '@/components/store/ProductCard'
import { AddToCartSection } from '@/components/store/AddToCartSection'
import { ReviewsSection } from '@/components/store/ReviewsSection'
import { CONCENTRATION_LABELS, GENDER_LABELS } from '@/constants'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const repo = new SupabaseProductRepository()
  const product = await new GetProductBySlug(repo).execute(slug)
  if (!product) return { title: 'Producto no encontrado' }

  return {
    title: `${product.name} — ${product.brandName ?? 'NOIR·ESSENCE'}`,
    description: product.description ?? product.tagline ?? undefined,
    openGraph: {
      title: `${product.name} | NOIR·ESSENCE`,
      description: product.tagline ?? product.description ?? undefined,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const repo = new SupabaseProductRepository()
  const [product, related] = await Promise.all([
    new GetProductBySlug(repo).execute(slug),
    new GetRelatedProducts(repo).execute(slug, 4).catch(() => []),
  ])

  if (!product) notFound()

  const sortedVariants = [...product.variants].sort((a, b) => a.sizeMl - b.sizeMl)

  return (
    <div className="min-h-screen bg-ink">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-[10px] text-muted">
        <Link href="/" className="hover:text-gold transition-colors">Inicio</Link>
        <span>·</span>
        <Link href="/catalogo" className="hover:text-gold transition-colors">Catálogo</Link>
        <span>·</span>
        <span className="text-paper">{product.name}</span>
      </nav>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[rgba(184,154,90,0.15)]">
          {/* Gallery */}
          <div className="relative bg-smoke border-r border-[rgba(184,154,90,0.15)]">
            <div className="sticky top-20">
              {/* Main image */}
              <div className="relative h-[480px] flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,154,90,0.06)_0%,transparent_70%)] pointer-events-none" />
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-12"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="relative">
                    <div className="w-20 h-40 border border-[rgba(184,154,90,0.3)] bg-[rgba(184,154,90,0.04)] rounded-sm">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 border border-[rgba(184,154,90,0.2)] bg-[rgba(184,154,90,0.06)] rounded-sm" />
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 p-4 border-t border-[rgba(184,154,90,0.1)]">
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      className="w-14 h-14 relative border border-[rgba(184,154,90,0.2)] hover:border-gold transition-colors cursor-pointer overflow-hidden"
                    >
                      <Image
                        src={img}
                        alt={`${product.name} vista ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-8 md:p-10 flex flex-col gap-6">
            {/* Brand + name */}
            <div>
              <Link
                href={`/catalogo?marca=${product.brandSlug}`}
                className="label-gold hover:text-gold-light transition-colors"
              >
                {product.brandName}
              </Link>
              <h1 className="font-serif text-4xl font-light text-paper mt-1 leading-tight">
                {product.name}
              </h1>
              {product.tagline && (
                <p className="font-serif italic text-sm text-muted mt-2">
                  "{product.tagline}"
                </p>
              )}
            </div>

            {/* Meta chips */}
            <div className="flex gap-2 flex-wrap">
              {product.concentration && (
                <span className="px-3 py-1 border border-[rgba(184,154,90,0.2)] text-[9px] uppercase tracking-[0.1em] text-muted">
                  {CONCENTRATION_LABELS[product.concentration]}
                </span>
              )}
              {product.gender && (
                <span className="px-3 py-1 border border-[rgba(184,154,90,0.2)] text-[9px] uppercase tracking-[0.1em] text-muted">
                  {GENDER_LABELS[product.gender]}
                </span>
              )}
              {product.olfactoryFamily && (
                <span className="px-3 py-1 border border-[rgba(184,154,90,0.2)] text-[9px] uppercase tracking-[0.1em] text-muted">
                  {product.olfactoryFamily}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-muted leading-relaxed font-light">
                {product.description}
              </p>
            )}

            {/* Notes */}
            <NotesPyramid
              notesTop={product.notesTop}
              notesHeart={product.notesHeart}
              notesBase={product.notesBase}
            />

            <div className="divider" />

            {/* Add to cart — Client Component */}
            <AddToCartSection product={product} variants={sortedVariants} />
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-serif text-2xl font-light text-paper">También te puede gustar</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <ReviewsSection productId={product.id} />
      </div>
    </div>
  )
}
