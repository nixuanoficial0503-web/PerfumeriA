import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/utils/formatPrice'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Productos — Admin' }

export default async function AdminProductosPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select(`
      id, name, slug, concentration, gender, is_active, is_featured, created_at,
      brands ( name ),
      product_variants ( price, stock )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl font-light text-paper">Productos</h1>
        <Link href="/admin/productos/nuevo" className="btn-primary">
          + Nuevo producto
        </Link>
      </div>

      <div className="bg-ink border border-[rgba(184,154,90,0.2)] overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_80px_80px_100px] gap-4 px-5 py-3 border-b border-[rgba(184,154,90,0.12)] bg-[#0a0908]">
          {['Producto', 'Marca', 'Precio desde', 'Stock', 'Estado', 'Acciones'].map(h => (
            <p key={h} className="text-[8px] tracking-[0.15em] uppercase text-muted">{h}</p>
          ))}
        </div>

        {(products ?? []).map(p => {
          const variants = (p.product_variants as any[]) ?? []
          const minPrice = variants.length ? Math.min(...variants.map((v: any) => v.price)) : 0
          const totalStock = variants.reduce((s: number, v: any) => s + (v.stock ?? 0), 0)

          return (
            <div
              key={p.id}
              className="grid grid-cols-[2fr_1fr_1fr_80px_80px_100px] gap-4 px-5 py-4 border-b border-[rgba(184,154,90,0.06)] hover:bg-[rgba(184,154,90,0.02)] transition-colors items-center"
            >
              <div>
                <p className="text-sm text-paper">{p.name}</p>
                <p className="text-[9px] text-muted mt-0.5">
                  {p.concentration ?? '—'} · {p.gender ?? '—'}
                </p>
              </div>
              <p className="text-xs text-muted">{(p.brands as any)?.name ?? '—'}</p>
              <p className="text-sm text-gold font-light">
                {minPrice ? formatPrice(minPrice) : '—'}
              </p>
              <p className={`text-sm ${totalStock <= 5 ? 'text-error' : 'text-paper'}`}>
                {totalStock}
              </p>
              <div>
                <span className={`inline-flex px-2 py-0.5 text-[8px] uppercase tracking-wider ${
                  p.is_active ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                }`}>
                  {p.is_active ? 'Activo' : 'Oculto'}
                </span>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/admin/productos/${p.id}`}
                  className="text-[9px] text-gold hover:text-gold-light transition-colors tracking-[0.1em] uppercase"
                >
                  Editar
                </Link>
                <Link
                  href={`/producto/${p.slug}`}
                  target="_blank"
                  className="text-[9px] text-muted hover:text-paper transition-colors tracking-[0.1em] uppercase"
                >
                  Ver
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
