'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils/formatPrice'
import { FREE_SHIPPING_THRESHOLD } from '@/constants'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, count, amountToFreeShipping } = useCartStore()

  if (!isOpen) return null

  const cartTotal = total()
  const toFreeShipping = amountToFreeShipping()
  const progressPct = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Carrito de compras"
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-smoke border-l border-[rgba(184,154,90,0.2)] flex flex-col animate-slide-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(184,154,90,0.15)]">
          <div className="flex items-center gap-3">
            <ShoppingBag size={15} className="text-gold" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-paper font-medium">
              Carrito
            </span>
            {count() > 0 && (
              <span className="text-[9px] text-muted">({count()} items)</span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="text-muted hover:text-paper transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free shipping progress */}
        {cartTotal > 0 && (
          <div className="px-6 py-4 border-b border-[rgba(184,154,90,0.1)]">
            {toFreeShipping > 0 ? (
              <p className="text-[10px] text-muted mb-2">
                Te faltan{' '}
                <span className="text-gold">{formatPrice(toFreeShipping)}</span>{' '}
                para envío gratis
              </p>
            ) : (
              <p className="text-[10px] text-success">¡Tienes envío gratis! 🎉</p>
            )}
            <div className="h-0.5 bg-[rgba(184,154,90,0.15)] rounded-full">
              <div
                className="h-full bg-gold rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} className="text-muted opacity-30" />
              <p className="text-sm text-muted">Tu carrito está vacío</p>
              <button onClick={closeCart} className="btn-ghost text-sm">
                Explorar fragancias
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {items.map(item => (
                <li key={item.variantId} className="flex gap-4">
                  {/* Image */}
                  <Link
                    href={`/producto/${item.slug}`}
                    onClick={closeCart}
                    className="w-16 h-20 bg-ink border border-[rgba(184,154,90,0.15)] flex-shrink-0 relative overflow-hidden hover:border-gold/40 transition-colors"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-6 h-10 border border-[rgba(184,154,90,0.2)] rounded-sm" />
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] text-gold tracking-[0.15em] uppercase mb-0.5">
                      {item.brand}
                    </p>
                    <p className="text-sm text-paper font-serif font-light leading-tight mb-1 truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-muted mb-3">
                      {item.concentration} · {item.sizeMl}ml
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Qty control */}
                      <div className="flex items-center border border-[rgba(184,154,90,0.2)]">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          aria-label="Reducir cantidad"
                          className="w-7 h-7 flex items-center justify-center text-muted hover:text-gold transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-7 text-center text-xs text-paper">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          aria-label="Aumentar cantidad"
                          className="w-7 h-7 flex items-center justify-center text-muted hover:text-gold transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-sm text-gold font-light">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="btn-danger mt-2 text-[9px]"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[rgba(184,154,90,0.15)]">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] text-muted uppercase tracking-[0.1em]">Total</span>
              <span className="text-lg text-gold font-light">{formatPrice(cartTotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full block text-center"
            >
              Finalizar compra
            </Link>
            <Link
              href="/carrito"
              onClick={closeCart}
              className="btn-ghost w-full block text-center mt-3"
            >
              Ver carrito completo
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
