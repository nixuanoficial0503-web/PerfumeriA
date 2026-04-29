// app/(store)/checkout/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils/formatPrice'
import { cn } from '@/utils/cn'
import { Lock, ChevronDown } from 'lucide-react'
import type { ShippingAddress } from '@/types/order'

const DEPARTMENTS = [
  'Amazonas','Antioquia','Arauca','Atlántico','Bolívar','Boyacá','Caldas',
  'Caquetá','Casanare','Cauca','Cesar','Chocó','Córdoba','Cundinamarca',
  'Guainía','Guaviare','Huila','La Guajira','Magdalena','Meta','Nariño',
  'Norte de Santander','Putumayo','Quindío','Risaralda','San Andrés',
  'Santander','Sucre','Tolima','Valle del Cauca','Vaupés','Vichada',
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    department: 'Atlántico',
    postalCode: '',
  })

  const cartTotal = total()

  function setField(key: keyof ShippingAddress, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    if (!items.length) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shippingAddress: form }),
      })

      const data = await res.json()
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Error al procesar el pago. Intenta de nuevo.')
        setLoading(false)
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
      setLoading(false)
    }
  }

  if (!items.length) {
    router.replace('/carrito')
    return null
  }

  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl font-light text-paper mb-10">Finalizar compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Form */}
          <form onSubmit={handleCheckout} className="flex flex-col gap-8">
            {/* Shipping */}
            <section>
              <h2 className="font-serif text-xl font-light text-paper mb-5 pb-3 border-b border-[rgba(184,154,90,0.15)]">
                Dirección de envío
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="label-caps">Nombre completo</label>
                  <input
                    required
                    value={form.fullName}
                    onChange={e => setField('fullName', e.target.value)}
                    className="input-dark"
                    placeholder="María García López"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="label-caps">Teléfono / WhatsApp</label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={e => setField('phone', e.target.value)}
                    className="input-dark"
                    placeholder="300 123 4567"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="label-caps">Departamento</label>
                  <div className="relative">
                    <select
                      required
                      value={form.department}
                      onChange={e => setField('department', e.target.value)}
                      className="input-dark w-full appearance-none cursor-pointer pr-8 bg-ink"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d} className="bg-smoke">{d}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  </div>
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="label-caps">Dirección completa</label>
                  <input
                    required
                    value={form.address}
                    onChange={e => setField('address', e.target.value)}
                    className="input-dark"
                    placeholder="Calle 50 # 46-25, Apto 301"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="label-caps">Ciudad</label>
                  <input
                    required
                    value={form.city}
                    onChange={e => setField('city', e.target.value)}
                    className="input-dark"
                    placeholder="Barranquilla"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="label-caps">Código postal (opcional)</label>
                  <input
                    value={form.postalCode}
                    onChange={e => setField('postalCode', e.target.value)}
                    className="input-dark"
                    placeholder="080001"
                  />
                </div>
              </div>
            </section>

            {/* Payment info */}
            <section>
              <h2 className="font-serif text-xl font-light text-paper mb-5 pb-3 border-b border-[rgba(184,154,90,0.15)]">
                Pago
              </h2>
              <div className="border border-[rgba(184,154,90,0.15)] p-5 flex items-start gap-4 bg-smoke">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-[rgba(184,154,90,0.2)]">
                  <Lock size={13} className="text-gold" />
                </div>
                <div>
                  <p className="text-sm text-paper mb-1">Stripe Checkout — Pago seguro</p>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Al continuar serás redirigido a Stripe para completar tu pago de forma
                    segura. Aceptamos tarjetas débito, crédito y PSE.
                  </p>
                </div>
              </div>
            </section>

            {error && (
              <p className="text-[11px] text-error border border-error/20 bg-error/5 px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'btn-primary w-full flex items-center justify-center gap-2 py-3.5',
                loading && 'opacity-60 cursor-not-allowed'
              )}
            >
              <Lock size={12} />
              {loading ? 'Redirigiendo a Stripe...' : `Pagar ${formatPrice(cartTotal)}`}
            </button>
          </form>

          {/* Order summary */}
          <div className="border border-[rgba(184,154,90,0.2)] bg-smoke p-6 sticky top-24">
            <h3 className="font-serif text-lg font-light text-paper mb-5">Tu pedido</h3>
            <div className="flex flex-col gap-3 mb-5">
              {items.map(item => (
                <div key={item.variantId} className="flex justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-paper truncate">{item.name}</p>
                    <p className="text-[10px] text-muted">
                      {item.sizeMl}ml · x{item.quantity}
                    </p>
                  </div>
                  <p className="text-[12px] text-gold flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-[rgba(184,154,90,0.15)] pt-4 flex justify-between items-baseline">
              <span className="text-[10px] text-muted uppercase tracking-[0.1em]">Total</span>
              <span className="text-xl text-gold font-light">{formatPrice(cartTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
