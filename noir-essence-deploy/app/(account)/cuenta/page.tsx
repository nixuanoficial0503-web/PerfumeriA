// app/(account)/cuenta/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/utils/formatPrice'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mi cuenta' }

export default async function CuentaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: totalOrders } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'delivered')

  const { data: totalSpentRow } = await supabase
    .from('orders')
    .select('total')
    .eq('user_id', user.id)
    .in('status', ['paid', 'processing', 'shipped', 'delivered'])

  const totalSpent = (totalSpentRow ?? []).reduce((s, o) => s + o.total, 0)

  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl font-light text-paper mb-10">Mi cuenta</h1>

        {/* Profile card */}
        <div className="border border-[rgba(184,154,90,0.2)] p-6 mb-8 bg-smoke">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-serif text-xl font-light text-paper mb-1">
                {profile?.full_name ?? 'Cliente'}
              </p>
              <p className="text-sm text-muted">{user.email}</p>
              {profile?.phone && (
                <p className="text-[11px] text-muted mt-1">{profile.phone}</p>
              )}
            </div>
            <span className="px-2 py-0.5 text-[8px] uppercase tracking-wider bg-gold/10 text-gold">
              {profile?.role === 'admin' ? 'Administrador' : 'Cliente'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[rgba(184,154,90,0.1)]">
            <div>
              <p className="text-[8px] text-muted tracking-[0.15em] uppercase mb-1">Pedidos completados</p>
              <p className="font-serif text-2xl font-light text-paper">{totalOrders ?? 0}</p>
            </div>
            <div>
              <p className="text-[8px] text-muted tracking-[0.15em] uppercase mb-1">Total invertido</p>
              <p className="font-serif text-2xl font-light text-gold">{formatPrice(totalSpent)}</p>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Mis pedidos', desc: 'Historial y estado de envíos', href: '/cuenta/pedidos' },
            { label: 'Wishlist', desc: 'Fragancias guardadas', href: '/cuenta/wishlist' },
            { label: 'Catálogo', desc: 'Explorar nuevas fragancias', href: '/catalogo' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="border border-[rgba(184,154,90,0.15)] hover:border-gold/40 p-5 transition-colors group"
            >
              <p className="text-sm text-paper group-hover:text-gold transition-colors mb-1">
                {item.label}
              </p>
              <p className="text-[11px] text-muted">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
