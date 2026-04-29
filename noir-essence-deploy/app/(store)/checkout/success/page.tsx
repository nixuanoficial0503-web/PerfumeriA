// app/(store)/checkout/success/page.tsx
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { CheckCircle } from 'lucide-react'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const clearCart = useCartStore(s => s.clearCart)
  const cleared = useRef(false)

  useEffect(() => {
    if (!cleared.current) {
      clearCart()
      cleared.current = true
    }
  }, [clearCart])

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center animate-fade-in">
        {/* Icon */}
        <div className="w-16 h-16 border border-success/30 flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={28} className="text-success" />
        </div>

        <p className="label-gold mb-3">Pedido confirmado</p>
        <h1 className="font-serif text-4xl font-light text-paper mb-4">
          ¡Gracias por tu compra!
        </h1>
        <p className="text-sm text-muted leading-relaxed mb-2 font-light">
          Tu fragancia está en camino. Recibirás un email de confirmación
          con todos los detalles de tu pedido.
        </p>
        {sessionId && (
          <p className="text-[10px] text-muted/60 mb-10 font-mono">
            Ref: {sessionId.slice(-16).toUpperCase()}
          </p>
        )}

        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-[rgba(184,154,90,0.15)]" />
          <span className="text-gold text-lg">·</span>
          <div className="flex-1 h-px bg-[rgba(184,154,90,0.15)]" />
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/cuenta/pedidos" className="btn-primary w-full text-center">
            Ver mis pedidos
          </Link>
          <Link href="/catalogo" className="btn-ghost w-full text-center">
            Seguir explorando
          </Link>
        </div>

        <p className="text-[10px] text-muted mt-8 leading-relaxed">
          ¿Preguntas? Escríbenos a{' '}
          <a href="mailto:hola@noiressence.co" className="text-gold hover:text-gold-light transition-colors">
            hola@noiressence.co
          </a>
        </p>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <p className="text-muted text-sm">Procesando tu pedido...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
