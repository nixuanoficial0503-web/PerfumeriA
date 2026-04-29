import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/utils/formatPrice'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/constants'
import { cn } from '@/utils/cn'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mis pedidos' }

export default async function PedidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id, status, total, created_at,
      order_items (
        quantity,
        product_variants (
          size_ml,
          products ( name, slug )
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-light text-paper">Mis pedidos</h1>
          <Link href="/cuenta" className="text-[10px] text-muted hover:text-gold transition-colors uppercase tracking-[0.1em]">
            ← Mi cuenta
          </Link>
        </div>

        {!orders?.length ? (
          <div className="text-center py-20">
            <p className="text-muted text-sm mb-6">Aún no has realizado ningún pedido.</p>
            <Link href="/catalogo" className="btn-primary">Explorar fragancias</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => {
              const items = order.order_items as any[]
              return (
                <div key={order.id} className="border border-[rgba(184,154,90,0.15)] hover:border-[rgba(184,154,90,0.35)] transition-colors">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(184,154,90,0.1)]">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="label-caps mb-0.5">Pedido</p>
                        <p className="text-sm text-paper font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="label-caps mb-0.5">Fecha</p>
                        <p className="text-sm text-muted">
                          {new Date(order.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="label-caps mb-0.5">Total</p>
                        <p className="text-sm text-gold">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                    <span className={cn('px-3 py-1 text-[8px] uppercase tracking-[0.1em]', ORDER_STATUS_COLORS[order.status])}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-sm text-muted">
                      {items.map((item: any) => {
                        const p = item.product_variants?.products
                        return p ? `${p.name} ${item.product_variants.size_ml}ml ×${item.quantity}` : '—'
                      }).join(' · ')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
