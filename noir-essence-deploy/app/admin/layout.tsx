import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: '▦' },
  { label: 'Pedidos', href: '/admin/pedidos', icon: '◫' },
  { label: 'Productos', href: '/admin/productos', icon: '◈' },
  { label: 'Clientes', href: '/admin/clientes', icon: '◉' },
  { label: 'Inventario', href: '/admin/inventario', icon: '◧' },
  { label: 'Emails', href: '/admin/emails', icon: '◻' },
  { label: 'Descuentos', href: '/admin/descuentos', icon: '◌' },
  { label: 'Analytics', href: '/admin/analytics', icon: '◜' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-[#0a0908] flex">
      {/* Sidebar */}
      <aside className="w-[200px] flex-shrink-0 bg-ink border-r border-[rgba(184,154,90,0.15)] flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[rgba(184,154,90,0.15)]">
          <p className="font-serif text-sm tracking-[0.25em] text-gold">N·E</p>
          <p className="text-[8px] text-muted tracking-[0.15em] uppercase mt-0.5">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {ADMIN_NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-5 py-2.5 text-[10px] tracking-[0.1em] uppercase text-muted hover:text-gold hover:bg-[rgba(184,154,90,0.04)] border-l-2 border-transparent hover:border-gold transition-all duration-200"
            >
              <span className="text-xs">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="px-5 py-4 border-t border-[rgba(184,154,90,0.15)]">
          <p className="text-[10px] text-muted truncate">{profile?.full_name ?? user.email}</p>
          <Link href="/" className="text-[9px] text-gold hover:text-gold-light transition-colors mt-1 block">
            ← Ver tienda
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
