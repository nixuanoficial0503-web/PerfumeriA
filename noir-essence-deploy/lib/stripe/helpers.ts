import { stripe } from './client'
import type { CartItem } from '@/store/cartStore'

/**
 * Build Stripe line_items from cart items.
 * Each item needs a stripe_price_id OR we create an inline price.
 */
export async function buildLineItems(items: CartItem[]) {
  return items.map(item => ({
    price_data: {
      currency: 'cop',
      unit_amount: item.price,       // already in centavos
      product_data: {
        name: `${item.name} ${item.sizeMl}ml`,
        description: `${item.brand} · ${item.concentration} · ${item.sizeMl}ml`,
        metadata: {
          variantId: item.variantId,
          productId: item.productId,
        },
      },
    },
    quantity: item.quantity,
  }))
}

/** Format Stripe amount (centavos) to COP string */
export function formatStripeCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount / 100)
}
