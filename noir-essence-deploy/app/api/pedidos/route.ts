import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, status, total, created_at, shipping_address,
      order_items ( quantity, unit_price,
        product_variants ( size_ml, products ( name, slug, images, brands ( name ) ) )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Error' }, { status: 500 })
  return NextResponse.json(data)
}
