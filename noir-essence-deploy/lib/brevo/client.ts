// lib/brevo/client.ts

const BREVO_API = 'https://api.brevo.com/v3/smtp/email'

export interface EmailPayload {
  to: { email: string; name?: string }[]
  subject: string
  htmlContent: string
  replyTo?: { email: string; name?: string }
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const res = await fetch(BREVO_API, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL!,
        name: process.env.BREVO_SENDER_NAME ?? 'NOIR·ESSENCE',
      },
      ...payload,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Brevo error ${res.status}: ${JSON.stringify(err)}`)
  }
}

/** Base HTML wrapper for all transactional emails */
export function emailBase(content: string, preheader = ''): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NOIR·ESSENCE</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#0d0c0a;font-family:Arial,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ''}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0d0c0a;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" style="max-width:600px;width:100%;" cellspacing="0" cellpadding="0">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px;text-align:center;border-bottom:1px solid rgba(184,154,90,0.2);">
              <p style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:300;letter-spacing:0.3em;color:#f5f2ec;">
                NOIR<span style="color:#b89a5a;">·</span>ESSENCE
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px 0;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0 0;border-top:1px solid rgba(184,154,90,0.15);text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;color:#6b6760;letter-spacing:0.1em;">
                NOIR·ESSENCE · Perfumería Nicho · Colombia
              </p>
              <p style="margin:0;font-size:10px;color:#6b6760;">
                ¿Preguntas? Escríbenos a
                <a href="mailto:hola@noiressence.co" style="color:#b89a5a;text-decoration:none;">hola@noiressence.co</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
