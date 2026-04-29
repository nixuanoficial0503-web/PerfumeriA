// lib/brevo/templates/order-confirmation.ts
import { sendEmail, emailBase } from '../client'
import { formatPrice } from '@/utils/formatPrice'

interface OrderConfirmationParams {
  to: string
  name: string
  order: {
    id: string
    total: number
    created_at: string
    shipping_address: any
    order_items: any[]
  }
}

export async function sendOrderConfirmationEmail({ to, name, order }: OrderConfirmationParams) {
  const firstName = name.split(' ')[0]
  const shortId = order.id.slice(0, 8).toUpperCase()

  const itemsHtml = order.order_items.map((item: any) => {
    const variant = item.product_variants
    const product = variant?.products
    const brand = product?.brands
    return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid rgba(184,154,90,0.1);">
          <p style="margin:0 0 2px;font-size:13px;color:#f5f2ec;">${product?.name ?? 'Producto'}</p>
          <p style="margin:0;font-size:11px;color:#6b6760;">
            ${brand?.name ?? ''} · ${variant?.size_ml ?? ''}ml · x${item.quantity}
          </p>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid rgba(184,154,90,0.1);text-align:right;vertical-align:top;">
          <p style="margin:0;font-size:13px;color:#b89a5a;">
            ${formatPrice(item.unit_price * item.quantity)}
          </p>
        </td>
      </tr>
    `
  }).join('')

  const content = `
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#b89a5a;">
      Pedido confirmado
    </p>
    <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:26px;font-weight:300;color:#f5f2ec;">
      ¡Gracias, ${firstName}!
    </h1>
    <p style="margin:0 0 32px;font-size:14px;color:#6b6760;">
      Pedido <strong style="color:#b89a5a;">#${shortId}</strong> ·
      ${new Date(order.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
    </p>

    <!-- Items -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
           style="border-top:1px solid rgba(184,154,90,0.2);margin-bottom:24px;">
      ${itemsHtml}
    </table>

    <!-- Total -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
           style="border-top:1px solid rgba(184,154,90,0.3);padding-top:16px;margin-bottom:32px;">
      <tr>
        <td style="font-size:13px;color:#6b6760;">Total</td>
        <td style="text-align:right;font-size:18px;font-weight:300;color:#b89a5a;">
          ${formatPrice(order.total)}
        </td>
      </tr>
    </table>

    <!-- Shipping -->
    ${order.shipping_address ? `
    <div style="background:#1e1c18;border:1px solid rgba(184,154,90,0.15);padding:20px;margin-bottom:32px;">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#b89a5a;">
        Dirección de envío
      </p>
      <p style="margin:0;font-size:13px;color:#ede9e1;line-height:1.8;">
        ${order.shipping_address.fullName}<br/>
        ${order.shipping_address.address}<br/>
        ${order.shipping_address.city}, ${order.shipping_address.department}
      </p>
    </div>
    ` : ''}

    <!-- CTA -->
    <table role="presentation" cellspacing="0" cellpadding="0">
      <tr>
        <td style="background:#b89a5a;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/cuenta/pedidos"
             style="display:inline-block;padding:12px 28px;font-size:11px;font-weight:500;
                    letter-spacing:0.15em;text-transform:uppercase;color:#0d0c0a;text-decoration:none;">
            Ver mis pedidos
          </a>
        </td>
      </tr>
    </table>
  `

  return sendEmail({
    to: [{ email: to, name }],
    subject: `Pedido confirmado #${shortId} — NOIR·ESSENCE`,
    htmlContent: emailBase(content, `Tu pedido por ${formatPrice(order.total)} está en camino.`),
  })
}
