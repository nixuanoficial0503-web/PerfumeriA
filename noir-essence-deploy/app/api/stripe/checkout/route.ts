// app/api/stripe/checkout/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { buildLineItems } from '@/lib/stripe/helpers'
import { createClient } from '@/lib/supabase/server'
import type { CartItem } from '@/store/cartStore'
import type { ShippingAddress } from '@/types/order'

export async function POST(req: NextRequest) {
  try {
    const { items, shippingAddress }: {
      items: CartItem[]
      shippingAddress: ShippingAddress
    } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 })
    }

    // Get user session
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Create pending order in DB first
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id ?? null,
        status: 'pending',
        total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        shipping_address: shippingAddress as any,
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('[checkout] order insert error:', orderError)
      return NextResponse.json({ error: 'Error al crear pedido' }, { status: 500 })
    }

    // Insert order items
    await supabase.from('order_items').insert(
      items.map(item => ({
        order_id: order.id,
        variant_id: item.variantId,
        quantity: item.quantity,
        unit_price: item.price,
      }))
    )

    // Build Stripe line items
    const lineItems = await buildLineItems(items)

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/carrito`,
      customer_email: user?.email,
      metadata: {
        orderId: order.id,
        userId: user?.id ?? '',
      },
      shipping_address_collection: {
        allowed_countries: ['CO'],
      },
      phone_number_collection: { enabled: true },
      locale: 'es',
    })

    // Save stripe session id
    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id)

    return NextResponse.json({ url: session.url, orderId: order.id })
  } catch (err) {
    console.error('[checkout] unexpected error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
