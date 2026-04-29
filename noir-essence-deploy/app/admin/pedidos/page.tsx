import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/utils/formatPrice'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/constants'
import { cn } from '@/utils/cn'
import { OrderStatusUpdater } from '@/components/admin/OrderStatusUpdater'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pedidos — Admin' }

interface Props { searchParams: Promise<{ status?: string }> }

export default async function AdminPedidosPage({ searchParams }: Props) {
  const { status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('orders')
    .select(`id, status, total, created_at, shipping_address,
      profiles ( full_name, email ),
      order_items ( quantity, unit_price,
        product_variants ( size_ml, products ( name, brands ( name ) ) )
      )`, { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50)
  if (status) query = query.eq('status', status)
  const { data: orders, count } = await query

  const statusCounts = await Promise.all(
    ['pending','paid','processing','shipped','delivered','cancelled'].map(async s => {
      const { count: c } = await supabase.from('orders').select('id',{count:'exact',head:true}).eq('status',s)
      return { status: s, count: c ?? 0 }
    })
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-light text-paper">Pedidos</h1>
        <p className="text-[10px] text-muted">{count ?? 0} total</p>
      </div>
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        <a href="/admin/pedidos" className={cn('px-3 py-1.5 text-[9px] tracking-[0.1em] uppercase border transition-all whitespace-nowrap',
          !status?'border-gold text-gold bg-[rgba(184,154,90,0.06)]':'border-[rgba(184,154,90,0.2)] text-muted hover:text-paper')}>
          Todos ({count??0})
        </a>
        {statusCounts.map(({status:s,count:c}) => (
          <a key={s} href={`/admin/pedidos?status=${s}`}
            className={cn('px-3 py-1.5 text-[9px] tracking-[0.1em] uppercase border transition-all whitespace-nowrap',
              status===s?'border-gold text-gold bg-[rgba(184,154,90,0.06)]':'border-[rgba(184,154,90,0.2)] text-muted hover:text-paper')}>
            {ORDER_STATUS_LABELS[s]} ({c})
          </a>
        ))}
      </div>
      <div className="bg-ink border border-[rgba(184,154,90,0.2)]">
        <div className="grid grid-cols-[110px_1fr_1fr_90px_130px_130px] gap-3 px-5 py-3 border-b border-[rgba(184,154,90,0.12)] bg-[#0a0908]">
          {['ID / Fecha','Cliente','Items','Total','Estado','Acción'].map(h=>(
            <p key={h} className="text-[8px] tracking-[0.15em] uppercase text-muted">{h}</p>
          ))}
        </div>
        {!orders?.length?(
          <p className="text-center text-muted text-sm py-12">Sin pedidos</p>
        ):orders.map(order=>{
          const profile=order.profiles as any
          const items=order.order_items as any[]
          const addr=order.shipping_address as any
          return(
            <div key={order.id} className="grid grid-cols-[110px_1fr_1fr_90px_130px_130px] gap-3 px-5 py-4 border-b border-[rgba(184,154,90,0.06)] hover:bg-[rgba(184,154,90,0.02)] items-start">
              <div>
                <p className="text-[10px] text-paper font-mono">#{order.id.slice(0,8).toUpperCase()}</p>
                <p className="text-[9px] text-muted mt-0.5">{new Date(order.created_at).toLocaleDateString('es-CO',{month:'short',day:'numeric'})}</p>
              </div>
              <div>
                <p className="text-[11px] text-paper">{profile?.full_name??'Anónimo'}</p>
                <p className="text-[10px] text-muted truncate">{profile?.email??'—'}</p>
                {addr&&<p className="text-[9px] text-muted/60 mt-0.5">{addr.city}</p>}
              </div>
              <div>
                {items.slice(0,2).map((item,i)=>{
                  const prod=item.product_variants?.products
                  return<p key={i} className="text-[10px] text-muted">{prod?.name} {item.product_variants?.size_ml}ml ×{item.quantity}</p>
                })}
                {items.length>2&&<p className="text-[9px] text-muted/50">+{items.length-2} más</p>}
              </div>
              <p className="text-sm text-gold font-light">{formatPrice(order.total)}</p>
              <span className={cn('inline-flex px-2 py-0.5 text-[8px] uppercase tracking-wider self-start',ORDER_STATUS_COLORS[order.status])}>
                {ORDER_STATUS_LABELS[order.status]}
              </span>
              <OrderStatusUpdater orderId={order.id} currentStatus={order.status}/>
            </div>
          )
        })}
      </div>
    </div>
  )
}
