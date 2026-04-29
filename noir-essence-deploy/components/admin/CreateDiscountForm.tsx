'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/utils/cn'

export function CreateDiscountForm() {
  const router = useRouter()
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', maxUses: '', minOrder: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); setSuccess(false) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/admin/discounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: form.code.toUpperCase().trim(),
        type: form.type,
        value: parseInt(form.value),
        maxUses: form.maxUses ? parseInt(form.maxUses) : null,
        minOrder: form.minOrder ? parseInt(form.minOrder) * 100 : 0,
      }),
    })
    setSuccess(true)
    setForm({ code: '', type: 'percentage', value: '', maxUses: '', minOrder: '' })
    router.refresh()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="label-caps">Código</label>
        <input required value={form.code} onChange={e=>set('code',e.target.value.toUpperCase())}
          className="input-dark font-mono tracking-widest" placeholder="BLACKFRIDAY25" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="label-caps">Tipo</label>
          <select value={form.type} onChange={e=>set('type',e.target.value)}
            className="input-dark bg-ink cursor-pointer">
            <option value="percentage" className="bg-smoke">Porcentaje (%)</option>
            <option value="fixed" className="bg-smoke">Monto fijo (COP)</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label-caps">{form.type==='percentage'?'%':'Pesos'}</label>
          <input required type="number" min="1" value={form.value} onChange={e=>set('value',e.target.value)}
            className="input-dark" placeholder={form.type==='percentage'?'15':'50000'} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="label-caps">Usos máx.</label>
          <input type="number" min="1" value={form.maxUses} onChange={e=>set('maxUses',e.target.value)}
            className="input-dark" placeholder="∞ ilimitado" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label-caps">Pedido mín. ($)</label>
          <input type="number" min="0" value={form.minOrder} onChange={e=>set('minOrder',e.target.value)}
            className="input-dark" placeholder="0" />
        </div>
      </div>
      {success&&<p className="text-[10px] text-success">✓ Código creado correctamente</p>}
      <button type="submit" disabled={loading}
        className={cn('btn-primary mt-2', loading&&'opacity-60 cursor-not-allowed')}>
        {loading?'Creando...':'Crear código'}
      </button>
    </form>
  )
}
