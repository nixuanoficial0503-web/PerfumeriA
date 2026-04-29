'use client'

import { useState } from 'react'
import { Minus, Plus, Heart, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/utils/formatPrice'
import { cn } from '@/utils/cn'
import type { ProductEntity } from '@/domain/entities/Product'

interface Variant {
  id: string
  sizeMl: number
  price: number
  stock: number
  stripePriceId: string | null
}

interface AddToCartSectionProps {
  product: ProductEntity
  variants: Variant[]
}

export function AddToCartSection({ product, variants }: AddToCartSectionProps) {
  const addItem = useCartStore(s => s.addItem)
  const showToast = useUIStore(s => s.showToast)
  const [selectedVariant, setSelectedVariant] = useState<Variant>(variants[0])
  const [qty, setQty] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [adding, setAdding] = useState(false)

  const inStock = selectedVariant?.stock > 0

  async function handleAdd() {
    if (!selectedVariant || !inStock) return
    setAdding(true)

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      brand: product.brandName ?? '',
      sizeMl: selectedVariant.sizeMl,
      price: selectedVariant.price,
      quantity: qty,
      image: product.images[0] ?? '',
      slug: product.slug,
      concentration: product.concentration ?? 'EDP',
    })

    showToast(`${product.name} (${selectedVariant.sizeMl}ml) agregado al carrito`)
    setTimeout(() => setAdding(false), 600)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Price */}
      <div>
        <p className="text-3xl text-gold font-light">
          {formatPrice(selectedVariant?.price ?? 0)}
        </p>
        {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
          <p className="text-[10px] text-error mt-1">
            ¡Solo quedan {selectedVariant.stock} unidades!
          </p>
        )}
      </div>

      {/* Size selector */}
      <div>
        <p className="label-caps mb-3">Presentación</p>
        <div className="flex gap-2 flex-wrap">
          {variants.map(v => (
            <button
              key={v.id}
              onClick={() => { setSelectedVariant(v); setQty(1) }}
              disabled={v.stock === 0}
              className={cn(
                'flex flex-col items-center px-4 py-2.5 border transition-all duration-200',
                v.stock === 0 && 'opacity-30 cursor-not-allowed',
                v.id === selectedVariant?.id
                  ? 'border-gold bg-[rgba(184,154,90,0.08)]'
                  : 'border-[rgba(184,154,90,0.2)] hover:border-gold/50'
              )}
            >
              <span className={cn(
                'text-sm font-light',
                v.id === selectedVariant?.id ? 'text-gold' : 'text-paper'
              )}>
                {v.sizeMl}ml
              </span>
              <span className="text-[9px] text-muted mt-0.5">
                {formatPrice(v.price)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity + Add to cart */}
      <div className="flex gap-3 items-center">
        {/* Qty */}
        <div className="flex items-center border border-[rgba(184,154,90,0.2)]">
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            aria-label="Reducir cantidad"
            className="w-10 h-11 flex items-center justify-center text-muted hover:text-gold transition-colors"
          >
            <Minus size={12} />
          </button>
          <span className="w-10 text-center text-sm text-paper">{qty}</span>
          <button
            onClick={() => setQty(q => Math.min(selectedVariant?.stock ?? 1, q + 1))}
            aria-label="Aumentar cantidad"
            className="w-10 h-11 flex items-center justify-center text-muted hover:text-gold transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Add button */}
        <button
          onClick={handleAdd}
          disabled={!inStock || adding}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 h-11',
            'text-[10px] tracking-[0.15em] uppercase font-medium font-sans transition-all duration-200',
            inStock
              ? adding
                ? 'bg-gold-dark text-ink cursor-default'
                : 'bg-gold text-ink hover:bg-gold-light'
              : 'bg-smoke text-muted cursor-not-allowed border border-[rgba(184,154,90,0.15)]'
          )}
        >
          <ShoppingBag size={13} />
          {!inStock ? 'Agotado' : adding ? 'Agregado ✓' : 'Agregar al carrito'}
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setWishlisted(w => !w)}
          aria-label={wishlisted ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          className="w-11 h-11 flex items-center justify-center border border-[rgba(184,154,90,0.2)] hover:border-gold transition-colors"
        >
          <Heart
            size={15}
            className={cn(
              'transition-colors',
              wishlisted ? 'text-gold fill-gold' : 'text-muted'
            )}
          />
        </button>
      </div>

      {/* Trust badges */}
      <div className="flex gap-4 pt-2 border-t border-[rgba(184,154,90,0.1)]">
        {[
          { icon: '🔒', text: 'Pago seguro' },
          { icon: '🚚', text: 'Envío a Colombia' },
          { icon: '✓', text: '100% originales' },
        ].map(b => (
          <div key={b.text} className="flex items-center gap-1.5">
            <span className="text-[11px]">{b.icon}</span>
            <span className="text-[9px] text-muted tracking-[0.05em]">{b.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
