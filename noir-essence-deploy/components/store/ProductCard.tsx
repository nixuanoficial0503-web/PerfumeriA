'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, Plus } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/utils/formatPrice'
import { cn } from '@/utils/cn'
import type { ProductEntity } from '@/domain/entities/Product'
import { getMinPrice } from '@/domain/entities/Product'

interface ProductCardProps {
  product: ProductEntity
  isWishlisted?: boolean
  onWishlistToggle?: (productId: string) => void
  priority?: boolean
}

export function ProductCard({
  product,
  isWishlisted = false,
  onWishlistToggle,
  priority = false,
}: ProductCardProps) {
  const addItem = useCartStore(s => s.addItem)
  const showToast = useUIStore(s => s.showToast)
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)
  const [wishlisted, setWishlisted] = useState(isWishlisted)
  const [imgError, setImgError] = useState(false)

  const sortedVariants = [...product.variants].sort((a, b) => a.sizeMl - b.sizeMl)
  const selectedVariant = sortedVariants[selectedVariantIdx]
  const hasStock = sortedVariants.some(v => v.stock > 0)
  const allNotes = [...product.notesTop, ...product.notesHeart].slice(0, 3)
  const minPrice = getMinPrice(product)

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!selectedVariant || selectedVariant.stock === 0) return

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      brand: product.brandName ?? '',
      sizeMl: selectedVariant.sizeMl,
      price: selectedVariant.price,
      quantity: 1,
      image: product.images[0] ?? '',
      slug: product.slug,
      concentration: product.concentration ?? 'EDP',
    })
    showToast(`${product.name} agregado al carrito`)
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted(w => !w)
    onWishlistToggle?.(product.id)
  }

  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      <article className="card-dark overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-52 bg-smoke overflow-hidden">
          {product.images[0] && !imgError ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={priority}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-24 border border-[rgba(184,154,90,0.25)] bg-[rgba(184,154,90,0.04)] rounded-sm" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 border border-[rgba(184,154,90,0.2)] bg-[rgba(184,154,90,0.06)] rounded-sm" />
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isFeatured && (
              <span className="bg-gold text-ink text-[7px] font-medium px-2 py-0.5 uppercase tracking-wider">
                Bestseller
              </span>
            )}
            {!hasStock && (
              <span className="bg-smoke/90 text-muted text-[7px] px-2 py-0.5 uppercase tracking-wider border border-[rgba(184,154,90,0.15)]">
                Agotado
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-ink/70 border border-[rgba(184,154,90,0.15)] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:border-gold"
          >
            <Heart
              size={12}
              className={cn(
                'transition-colors',
                wishlisted ? 'text-gold fill-gold' : 'text-muted'
              )}
            />
          </button>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-1.5 flex-1">
          <p className="label-gold">{product.brandName}</p>
          <h3 className="font-serif text-lg font-light text-paper leading-tight">
            {product.name}
          </h3>
          {allNotes.length > 0 && (
            <p className="text-[9px] text-muted">
              {allNotes.join(' · ')}
            </p>
          )}

          {/* Sizes */}
          {sortedVariants.length > 0 && (
            <div className="flex gap-1.5 mt-1 flex-wrap">
              {sortedVariants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={e => { e.preventDefault(); setSelectedVariantIdx(i) }}
                  aria-label={`${v.sizeMl}ml`}
                  className={cn(
                    'px-2 py-0.5 text-[8px] border transition-all duration-200',
                    v.stock === 0 && 'opacity-30 cursor-not-allowed',
                    i === selectedVariantIdx
                      ? 'border-gold text-gold'
                      : 'border-[rgba(184,154,90,0.2)] text-muted hover:border-gold/50'
                  )}
                >
                  {v.sizeMl}ml
                </button>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-sm text-gold font-light">
              {selectedVariant
                ? formatPrice(selectedVariant.price)
                : minPrice > 0 ? `Desde ${formatPrice(minPrice)}` : '—'
              }
            </span>
            <button
              onClick={handleAddToCart}
              aria-label="Agregar al carrito"
              disabled={!hasStock || !selectedVariant}
              className={cn(
                'w-7 h-7 flex items-center justify-center border transition-all duration-200',
                hasStock && selectedVariant
                  ? 'border-[rgba(184,154,90,0.2)] text-muted hover:border-gold hover:text-gold'
                  : 'border-[rgba(184,154,90,0.1)] text-muted/30 cursor-not-allowed'
              )}
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      </article>
    </Link>
  )
}
