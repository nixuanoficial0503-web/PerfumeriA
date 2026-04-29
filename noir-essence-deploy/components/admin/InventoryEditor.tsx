'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Check, X } from 'lucide-react'

interface Props { variantId: string; currentStock: number }

export function InventoryEditor({ variantId, currentStock }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(currentStock))
  const [saving, setSaving] = useState(false)

  async function save() {
    const n = parseInt(value)
    if (isNaN(n) || n < 0) return
    setSaving(true)
    await fetch(`/api/admin/products/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantId, stock: n }),
    })
    router.refresh()
    setEditing(false)
    setSaving(false)
  }

  if (!editing) return (
    <button onClick={() => setEditing(true)}
      className="flex items-center gap-1 text-[9px] text-muted hover:text-gold transition-colors uppercase tracking-[0.1em]">
      <Pencil size={10} /> Editar
    </button>
  )

  return (
    <div className="flex items-center gap-1">
      <input type="number" min="0" value={value} onChange={e=>setValue(e.target.value)}
        className="w-16 bg-transparent border border-gold text-paper text-[11px] px-2 py-1 outline-none" />
      <button onClick={save} disabled={saving}
        className="w-6 h-6 flex items-center justify-center border border-success/40 text-success hover:border-success transition-colors">
        <Check size={10}/>
      </button>
      <button onClick={()=>{setEditing(false);setValue(String(currentStock))}}
        className="w-6 h-6 flex items-center justify-center border border-[rgba(184,154,90,0.2)] text-muted hover:border-error hover:text-error transition-colors">
        <X size={10}/>
      </button>
    </div>
  )
}
