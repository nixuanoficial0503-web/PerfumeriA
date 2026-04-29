// lib/brevo/templates/abandoned-cart.ts
import { sendEmail, emailBase } from '../client'
import { formatPrice } from '@/utils/formatPrice'

interface AbandonedCartItem {
  name: string
  brand: string
  sizeMl: number
  price: number
}

interface AbandonedCartEmailParams {
  to: string
  name: string
  items: AbandonedCartItem[]
  cartTotal: number
}

export async function sendAbandonedCartEmail({ to, name, items, cartTotal }: AbandonedCartEmailParams) {
  const firstName = name.split(' ')[0]

  const itemsHtml = items.slice(0, 3).map(item => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(184,154,90,0.08);">
        <p style="margin:0 0 2px;font-size:13px;color:#f5f2ec;">${item.name}</p>
        <p style="margin:0;font-size:11px;color:#6b6760;">${item.brand} · ${item.sizeMl}ml</p>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(184,154,90,0.08);text-align:right;vertical-align:top;">
        <p style="margin:0;font-size:13px;color:#b89a5a;">${formatPrice(item.price)}</p>
      </td>
    </tr>
  `).join('')

  const content = `
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#b89a5a;">
      Olvidaste algo
    </p>
    <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:26px;font-weight:300;color:#f5f2ec;">
      ${firstName}, tu carrito te espera
    </h1>
    <p style="margin:0 0 28px;font-size:14px;color:#6b6760;line-height:1.8;">
      Dejaste fragancias increíbles en tu carrito. El aroma perfecto puede desaparecer —
      el inventario es limitado.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
           style="border-top:1px solid rgba(184,154,90,0.2);margin-bottom:8px;">
      ${itemsHtml}
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
           style="padding:12px 0;margin-bottom:32px;">
      <tr>
        <td style="font-size:12px;color:#6b6760;">Total estimado</td>
        <td style="text-align:right;font-size:16px;color:#b89a5a;">${formatPrice(cartTotal)}</td>
      </tr>
    </table>
    <table role="presentation" cellspacing="0" cellpadding="0">
      <tr>
        <td style="background:#b89a5a;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/carrito"
             style="display:inline-block;padding:12px 28px;font-size:11px;font-weight:500;
                    letter-spacing:0.15em;text-transform:uppercase;color:#0d0c0a;text-decoration:none;">
            Completar compra
          </a>
        </td>
      </tr>
    </table>
  `

  return sendEmail({
    to: [{ email: to, name }],
    subject: `${firstName}, tu carrito todavía está aquí — NOIR·ESSENCE`,
    htmlContent: emailBase(content, 'Tienes artículos esperándote en tu carrito.'),
  })
}
