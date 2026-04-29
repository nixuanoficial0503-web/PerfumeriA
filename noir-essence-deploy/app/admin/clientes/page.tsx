import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/utils/formatPrice'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Clientes — Admin' }

export default async function AdminClientesPage() {
  const supabase = await createClient()

  const { data: customers } = await supabase
    .from('profiles')
    .select(`id, full_name, email, phone, created_at, role`)
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  const customerIds = customers?.map(c => c.id) ?? []
  const ordersMap: Record<string, { count: number; total: number }> = {}

  if (customerIds.length) {
    const { data: orders } = await supabase
      .from('orders')
      .select('user_id, total')
      .in('user_id', customerIds)
      .in('status', ['paid','processing','shipped','delivered'])

    for (const o of orders ?? []) {
      if (!ordersMap[o.user_id!]) ordersMap[o.user_id!] = { count: 0, total: 0 }
      ordersMap[o.user_id!].count++
      ordersMap[o.user_id!].total += o.total
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl font-light text-paper">Clientes</h1>
        <p className="text-[10px] text-muted">{customers?.length ?? 0} registrados</p>
      </div>

      <div className="bg-ink border border-[rgba(184,154,90,0.2)]">
        <div className="grid grid-cols-[1fr_1fr_80px_120px_120px] gap-4 px-5 py-3 border-b border-[rgba(184,154,90,0.12)] bg-[#0a0908]">
          {['Cliente','Email','Pedidos','Total gastado','Desde'].map(h=>(
            <p key={h} className="text-[8px] tracking-[0.15em] uppercase text-muted">{h}</p>
          ))}
        </div>
        {(customers??[]).map(c=>{
          const stats = ordersMap[c.id] ?? { count: 0, total: 0 }
          return (
            <div key={c.id} className="grid grid-cols-[1fr_1fr_80px_120px_120px] gap-4 px-5 py-3.5 border-b border-[rgba(184,154,90,0.06)] hover:bg-[rgba(184,154,90,0.02)] items-center">
              <p className="text-sm text-paper">{c.full_name ?? '—'}</p>
              <p className="text-[11px] text-muted truncate">{c.email}</p>
              <p className="text-sm text-paper">{stats.count}</p>
              <p className="text-sm text-gold font-light">{stats.total>0?formatPrice(stats.total):'—'}</p>
              <p className="text-[10px] text-muted">
                {new Date(c.created_at).toLocaleDateString('es-CO',{year:'numeric',month:'short'})}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
