import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendShippingEmail } from '@/lib/brevo/templates/shipping'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { status, trackingCode, carrier } = body

  const { data: order, error } = await supabase
    .from('orders')
    .update({ status, ...(trackingCode ? { notes: `Tracking: ${trackingCode}` } : {}) })
    .eq('id', id)
    .select('*, profiles ( full_name, email )')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send shipping email when status changes to 'shipped'
  if (status === 'shipped') {
    const profile = order.profiles as any
    if (profile?.email) {
      await sendShippingEmail({
        to: profile.email,
        name: profile.full_name ?? 'Cliente',
        orderId: id,
        trackingCode,
        carrier,
      }).catch(console.error)
    }
  }

  return NextResponse.json({ success: true })
}
