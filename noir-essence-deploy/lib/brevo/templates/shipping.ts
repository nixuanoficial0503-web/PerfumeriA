// lib/brevo/templates/shipping.ts
import { sendEmail, emailBase } from '../client'

interface ShippingEmailParams {
  to: string
  name: string
  orderId: string
  trackingCode?: string
  carrier?: string
}

export async function sendShippingEmail({ to, name, orderId, trackingCode, carrier }: ShippingEmailParams) {
  const firstName = name.split(' ')[0]
  const shortId = orderId.slice(0, 8).toUpperCase()

  const content = `
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#b89a5a;">
      Tu pedido está en camino
    </p>
    <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:26px;font-weight:300;color:#f5f2ec;">
      ${firstName}, tu fragancia viaja hacia ti
    </h1>
    <p style="margin:0 0 20px;font-size:14px;color:#ede9e1;line-height:1.8;">
      El pedido <strong style="color:#b89a5a;">#${shortId}</strong> ha sido despachado y
      pronto estará contigo.
    </p>
    ${trackingCode ? `
    <div style="background:#1e1c18;border:1px solid rgba(184,154,90,0.2);padding:20px;margin-bottom:32px;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#6b6760;">
        Código de seguimiento
      </p>
      <p style="margin:0;font-size:18px;color:#b89a5a;letter-spacing:0.1em;">${trackingCode}</p>
      ${carrier ? `<p style="margin:4px 0 0;font-size:11px;color:#6b6760;">${carrier}</p>` : ''}
    </div>
    ` : ''}
    <p style="margin:0 0 32px;font-size:13px;color:#6b6760;line-height:1.8;">
      Tiempo estimado de entrega: <strong style="color:#ede9e1;">3–7 días hábiles</strong>
      dependiendo de tu ciudad.
    </p>
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
    subject: `Tu pedido #${shortId} está en camino — NOIR·ESSENCE`,
    htmlContent: emailBase(content, 'Tu fragancia está siendo enviada.'),
  })
}
