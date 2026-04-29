// app/(store)/carrito/page.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/utils/formatPrice'
import { FREE_SHIPPING_THRESHOLD } from '@/constants'
import { cn } from '@/utils/cn'

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total, count, clearCart } = useCartStore()
  const showToast = useUIStore(s => s.showToast)
  const router = useRouter()
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')

  const cartTotal = total()
  const toFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal)
  const hasFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD
  const progressPct = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100)

  function applyPromo() {
    if (!promoCode.trim()) return
    setPromoError('Código no válido o expirado.')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center gap-6 px-6">
        <ShoppingBag size={48} className="text-muted opacity-20" />
        <h1 className="font-serif text-3xl font-light text-paper">Tu carrito está vacío</h1>
        <p className="text-sm text-muted text-center max-w-xs">
          Explora nuestra colección y encuentra la fragancia que te define.
        </p>
        <Link href="/catalogo" className="btn-primary">
          Explorar fragancias
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-10">
          <h1 className="font-serif text-3xl font-light text-paper">
            Tu carrito
            <span className="text-muted font-sans text-sm font-light ml-3">
              ({count()} items)
            </span>
          </h1>
          <button
            onClick={() => { clearCart(); showToast('Carrito vaciado', 'info') }}
            className="btn-danger text-[10px]"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Items */}
          <div className="flex flex-col gap-0 border border-[rgba(184,154,90,0.15)]">
            {items.map((item, i) => (
              <div
                key={item.variantId}
                className={cn(
                  'grid grid-cols-[80px_1fr_auto] gap-5 p-5 items-start',
                  i < items.length - 1 && 'border-b border-[rgba(184,154,90,0.1)]'
                )}
              >
                {/* Image */}
                <Link href={`/producto/${item.slug}`}>
                  <div className="w-20 h-24 relative bg-smoke border border-[rgba(184,154,90,0.15)] overflow-hidden hover:border-gold/40 transition-colors">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-5 h-10 border border-[rgba(184,154,90,0.2)] rounded-sm" />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex flex-col gap-1">
                  <p className="label-gold">{item.brand}</p>
                  <Link href={`/producto/${item.slug}`}>
                    <h3 className="font-serif text-lg font-light text-paper hover:text-gold transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-[10px] text-muted">
                    {item.concentration} · {item.sizeMl}ml
                  </p>
                  <p className="text-[10px] text-muted mt-1">
                    Precio unitario: {formatPrice(item.price)}
                  </p>

                  {/* Qty control */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-[rgba(184,154,90,0.2)]">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted hover:text-gold transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="w-8 text-center text-sm text-paper">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted hover:text-gold transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="flex items-center gap-1.5 text-[9px] text-muted hover:text-error transition-colors uppercase tracking-[0.1em]"
                    >
                      <Trash2 size={10} />
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-lg text-gold font-light">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border border-[rgba(184,154,90,0.2)] bg-smoke p-6 flex flex-col gap-5 sticky top-24">
            <h2 className="font-serif text-xl font-light text-paper">Resumen del pedido</h2>

            {/* Free shipping progress */}
            <div>
              {hasFreeShipping ? (
                <p className="text-[10px] text-success mb-2">✓ ¡Tienes envío gratis!</p>
              ) : (
                <p className="text-[10px] text-muted mb-2">
                  Te faltan <span className="text-gold">{formatPrice(toFreeShipping)}</span> para envío gratis
                </p>
              )}
              <div className="h-0.5 bg-[rgba(184,154,90,0.1)] rounded-full">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Line items */}
            <div className="flex flex-col gap-2 py-2 border-y border-[rgba(184,154,90,0.1)]">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted">Subtotal</span>
                <span className="text-paper">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted">Envío</span>
                <span className={hasFreeShipping ? 'text-success' : 'text-muted'}>
                  {hasFreeShipping ? 'Gratis' : 'Calculado al pagar'}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] text-muted uppercase tracking-[0.1em]">Total</span>
              <span className="text-2xl text-gold font-light">{formatPrice(cartTotal)}</span>
            </div>

            {/* Promo code */}
            <div>
              <p className="label-caps mb-2">Código de descuento</p>
              <div className="flex gap-0">
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError('') }}
                  placeholder="BLACKFRIDAY"
                  className="input-dark flex-1 py-2 text-xs border-r-0"
                />
                <button onClick={applyPromo} className="btn-ghost px-4 py-2 text-[10px] border-l-0">
                  Aplicar
                </button>
              </div>
              {promoError && (
                <p className="text-[10px] text-error mt-1">{promoError}</p>
              )}
            </div>

            {/* Checkout button */}
            <Link href="/checkout" className="btn-primary w-full text-center flex items-center justify-center gap-2">
              Continuar con el pago
              <ArrowRight size={13} />
            </Link>

            <Link href="/catalogo" className="btn-ghost w-full text-center text-[10px]">
              Seguir comprando
            </Link>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-[rgba(184,154,90,0.1)]">
              {['🔒 Pago seguro', '✓ 100% originales', '↩ 30 días devolución'].map(b => (
                <span key={b} className="text-[9px] text-muted">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
