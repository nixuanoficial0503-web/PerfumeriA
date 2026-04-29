// app/api/stripe/webhook/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { sendOrderConfirmationEmail } from '@/lib/brevo/templates/order-confirmation'
import { sendWelcomeEmail } from '@/lib/brevo/templates/welcome'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent>

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const orderId = session.metadata?.orderId
      const userId = session.metadata?.userId

      if (!orderId) break

      // 1. Update order status to 'paid'
      const { data: order } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          stripe_payment_intent: session.payment_intent as string,
        })
        .eq('id', orderId)
        .select(`
          id, total, created_at, shipping_address,
          order_items (
            quantity, unit_price,
            product_variants (
              size_ml,
              products ( name, slug, images, brands ( name ) )
            )
          )
        `)
        .single()

      if (!order) break

      // 2. Decrease inventory
      const { data: items } = await supabase
        .from('order_items')
        .select('variant_id, quantity')
        .eq('order_id', orderId)

      for (const item of items ?? []) {
        await supabase.rpc('decrement_stock', {
          p_variant_id: item.variant_id,
          p_quantity: item.quantity,
        })
      }

      // 3. Send confirmation email
      const customerEmail = session.customer_details?.email
      const customerName = session.customer_details?.name

      if (customerEmail) {
        await sendOrderConfirmationEmail({
          to: customerEmail,
          name: customerName ?? 'Cliente',
          order: order as any,
        }).catch(console.error)
      }

      console.log(`[webhook] order ${orderId} marked as paid`)
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object
      const orderId = session.metadata?.orderId
      if (orderId) {
        await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', orderId)
        console.log(`[webhook] order ${orderId} cancelled (session expired)`)
      }
      break
    }

    default:
      console.log(`[webhook] unhandled event: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

// Stripe needs the raw body — disable Next.js body parsing
export const config = { api: { bodyParser: false } }
