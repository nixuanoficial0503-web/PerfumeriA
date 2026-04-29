import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendAbandonedCartEmail } from '@/lib/brevo/templates/abandoned-cart'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = await createClient()
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  const { data: abandoned } = await supabase
    .from('orders')
    .select(`id, total, profiles ( email, full_name ),
      order_items ( quantity, unit_price,
        product_variants ( size_ml, products ( name, brands ( name ) ) )
      )`)
    .eq('status', 'pending')
    .lt('created_at', twoHoursAgo)
    .not('user_id', 'is', null)
    .limit(50)

  let sent = 0
  for (const order of abandoned ?? []) {
    const profile = order.profiles as any
    if (!profile?.email) continue
    const items = (order.order_items as any[]).map(i => ({
      name: i.product_variants?.products?.name ?? 'Producto',
      brand: i.product_variants?.products?.brands?.name ?? '',
      sizeMl: i.product_variants?.size_ml ?? 0,
      price: i.unit_price,
    }))
    await sendAbandonedCartEmail({ to: profile.email, name: profile.full_name ?? 'Cliente', items, cartTotal: order.total }).catch(console.error)
    sent++
  }
  return NextResponse.json({ sent })
}
