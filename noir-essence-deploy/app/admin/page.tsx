import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/utils/formatPrice'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/constants'
import type { Metadata } from 'next'
import { cn } from '@/utils/cn'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminPage() {
  const supabase = await createClient()

  // Fetch stats in parallel
  const [ordersRes, customersRes, productsRes] = await Promise.all([
    supabase.from('orders').select('id, total, status, created_at').order('created_at', { ascending: false }).limit(10),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('product_variants').select('id, stock', { count: 'exact' }).lt('stock', 5),
  ])

  const orders = ordersRes.data ?? []
  const totalCustomers = customersRes.count ?? 0
  const lowStockCount = productsRes.count ?? 0
  const todayTotal = orders
    .filter(o => new Date(o.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-light text-paper mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Ventas hoy', value: formatPrice(todayTotal), change: '↑ +18%', up: true },
          { label: 'Pedidos totales', value: orders.length.toString(), change: `${orders.filter(o => o.status === 'pending').length} pendientes`, up: true },
          { label: 'Clientes', value: totalCustomers.toString(), change: 'Registrados', up: true },
          { label: 'Stock crítico', value: lowStockCount.toString(), change: lowStockCount > 0 ? '↓ Reponer pronto' : '✓ OK', up: lowStockCount === 0 },
        ].map(stat => (
          <div key={stat.label} className="bg-ink border border-[rgba(184,154,90,0.2)] p-5">
            <p className="text-[8px] tracking-[0.2em] uppercase text-muted mb-3">{stat.label}</p>
            <p className="font-serif text-2xl font-light text-paper mb-1">{stat.value}</p>
            <p className={cn('text-[9px]', stat.up ? 'text-success' : 'text-error')}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-lg font-light text-paper">Últimos pedidos</h2>
        <a href="/admin/pedidos" className="text-[9px] tracking-[0.12em] uppercase text-gold hover:text-gold-light transition-colors">
          Ver todos →
        </a>
      </div>

      <div className="bg-ink border border-[rgba(184,154,90,0.2)] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_1fr_100px_120px] gap-4 px-5 py-3 border-b border-[rgba(184,154,90,0.12)] bg-[#0a0908]">
          {['ID Pedido', 'Total', 'Estado', 'Fecha'].map(h => (
            <p key={h} className="text-[8px] tracking-[0.15em] uppercase text-muted">{h}</p>
          ))}
        </div>

        {orders.length === 0 ? (
          <p className="text-center text-muted text-sm py-12">No hay pedidos aún</p>
        ) : (
          orders.map(order => (
            <div
              key={order.id}
              className="grid grid-cols-[1fr_1fr_100px_120px] gap-4 px-5 py-4 border-b border-[rgba(184,154,90,0.06)] hover:bg-[rgba(184,154,90,0.02)] transition-colors cursor-pointer items-center"
            >
              <p className="text-xs text-muted font-mono">
                #{order.id.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-sm text-gold font-light">{formatPrice(order.total)}</p>
              <span className={cn(
                'inline-flex px-2 py-0.5 text-[8px] uppercase tracking-wider',
                ORDER_STATUS_COLORS[order.status]
              )}>
                {ORDER_STATUS_LABELS[order.status]}
              </span>
              <p className="text-[10px] text-muted">
                {new Date(order.created_at).toLocaleDateString('es-CO')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
