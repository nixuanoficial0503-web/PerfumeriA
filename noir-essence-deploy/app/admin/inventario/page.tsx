import { createClient } from '@/lib/supabase/server'
import { InventoryEditor } from '@/components/admin/InventoryEditor'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Inventario — Admin' }

export default async function AdminInventarioPage() {
  const supabase = await createClient()

  const { data: variants } = await supabase
    .from('product_variants')
    .select(`id, size_ml, price, stock, sku,
      products ( id, name, slug, brands ( name ) )`)
    .order('stock', { ascending: true })

  const critical = (variants??[]).filter(v=>v.stock<=5)
  const ok = (variants??[]).filter(v=>v.stock>5)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl font-light text-paper">Inventario</h1>
        <div className="flex items-center gap-3">
          {critical.length>0&&(
            <span className="px-3 py-1 text-[9px] uppercase tracking-wider bg-error/10 text-error border border-error/20">
              {critical.length} crítico{critical.length>1?'s':''}
            </span>
          )}
          <p className="text-[10px] text-muted">{variants?.length??0} variantes</p>
        </div>
      </div>

      {critical.length>0&&(
        <div className="mb-8">
          <p className="text-[9px] tracking-[0.15em] uppercase text-error mb-3">Stock crítico (&le;5 unidades)</p>
          <InventoryTable variants={critical} highlight />
        </div>
      )}

      <div>
        <p className="text-[9px] tracking-[0.15em] uppercase text-muted mb-3">Stock normal</p>
        <InventoryTable variants={ok} />
      </div>
    </div>
  )
}

function InventoryTable({ variants, highlight=false }: { variants: any[]; highlight?: boolean }) {
  return (
    <div className="bg-ink border border-[rgba(184,154,90,0.2)]">
      <div className="grid grid-cols-[1fr_80px_100px_120px_80px] gap-4 px-5 py-3 border-b border-[rgba(184,154,90,0.12)] bg-[#0a0908]">
        {['Producto','Tamaño','SKU','Stock','Editar'].map(h=>(
          <p key={h} className="text-[8px] tracking-[0.15em] uppercase text-muted">{h}</p>
        ))}
      </div>
      {variants.map(v=>{
        const prod=v.products as any
        const brand=prod?.brands
        return (
          <div key={v.id} className="grid grid-cols-[1fr_80px_100px_120px_80px] gap-4 px-5 py-3.5 border-b border-[rgba(184,154,90,0.06)] items-center">
            <div>
              <p className="text-[11px] text-paper">{prod?.name}</p>
              <p className="text-[9px] text-muted">{brand?.name}</p>
            </div>
            <p className="text-[11px] text-muted">{v.size_ml}ml</p>
            <p className="text-[10px] text-muted font-mono">{v.sku??'—'}</p>
            <p className={`text-sm font-light ${v.stock<=5?'text-error':v.stock<=20?'text-gold':'text-success'}`}>
              {v.stock} uds
            </p>
            <InventoryEditor variantId={v.id} currentStock={v.stock}/>
          </div>
        )
      })}
    </div>
  )
}
