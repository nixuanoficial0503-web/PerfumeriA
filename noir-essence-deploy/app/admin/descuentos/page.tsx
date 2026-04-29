import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/utils/formatPrice'
import { CreateDiscountForm } from '@/components/admin/CreateDiscountForm'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Descuentos — Admin' }

export default async function AdminDescuentosPage() {
  const supabase = await createClient()
  const { data: codes } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-light text-paper mb-8">Descuentos</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Table */}
        <div className="bg-ink border border-[rgba(184,154,90,0.2)]">
          <div className="grid grid-cols-[1fr_80px_100px_80px_80px_60px] gap-3 px-5 py-3 border-b border-[rgba(184,154,90,0.12)] bg-[#0a0908]">
            {['Código','Tipo','Valor','Usos','Estado',''].map(h=>(
              <p key={h} className="text-[8px] tracking-[0.15em] uppercase text-muted">{h}</p>
            ))}
          </div>
          {!codes?.length?(
            <p className="text-center text-muted text-sm py-10">Sin códigos aún</p>
          ):codes.map(code=>(
            <div key={code.id} className="grid grid-cols-[1fr_80px_100px_80px_80px_60px] gap-3 px-5 py-3.5 border-b border-[rgba(184,154,90,0.06)] items-center">
              <p className="text-sm text-gold font-mono tracking-wider">{code.code}</p>
              <p className="text-[10px] text-muted uppercase">{code.type==='percentage'?'%':'Fijo'}</p>
              <p className="text-sm text-paper">
                {code.type==='percentage'?`${code.value}%`:formatPrice(code.value)}
              </p>
              <p className="text-[11px] text-muted">{code.uses_count}/{code.max_uses??'∞'}</p>
              <span className={`inline-flex px-2 py-0.5 text-[8px] uppercase tracking-wider ${code.is_active?'bg-success/10 text-success':'bg-error/10 text-error'}`}>
                {code.is_active?'Activo':'Inactivo'}
              </span>
              <button className="text-[9px] text-muted hover:text-error transition-colors uppercase tracking-[0.1em]">
                Borrar
              </button>
            </div>
          ))}
        </div>

        {/* Create form */}
        <div className="border border-[rgba(184,154,90,0.2)] bg-smoke p-6">
          <p className="font-serif text-lg font-light text-paper mb-5">Nuevo código</p>
          <CreateDiscountForm />
        </div>
      </div>
    </div>
  )
}
