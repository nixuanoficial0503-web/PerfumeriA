// lib/brevo/templates/welcome.ts
import { sendEmail, emailBase } from '../client'

interface WelcomeEmailParams {
  to: string
  name: string
}

export async function sendWelcomeEmail({ to, name }: WelcomeEmailParams) {
  const firstName = name.split(' ')[0]

  const content = `
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#b89a5a;">
      Bienvenido/a
    </p>
    <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:28px;font-weight:300;color:#f5f2ec;line-height:1.2;">
      Hola, ${firstName}
    </h1>
    <p style="margin:0 0 20px;font-size:14px;color:#ede9e1;line-height:1.8;font-weight:300;">
      Tu cuenta en <strong style="color:#b89a5a;font-weight:400;">NOIR·ESSENCE</strong> ha sido creada.
      Ahora eres parte de una comunidad de personas que entienden que un aroma no es un accesorio,
      es una firma.
    </p>
    <p style="margin:0 0 32px;font-size:14px;color:#6b6760;line-height:1.8;">
      Explora nuestra colección y encuentra la fragancia que te define.
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0">
      <tr>
        <td style="background:#b89a5a;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/catalogo"
             style="display:inline-block;padding:12px 28px;font-size:11px;font-weight:500;
                    letter-spacing:0.15em;text-transform:uppercase;color:#0d0c0a;
                    text-decoration:none;">
            Explorar colección
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:40px 0 0;font-family:Georgia,serif;font-style:italic;font-size:13px;color:#6b6760;">
      "Un perfume es la marca invisible de tu presencia."
    </p>
  `

  return sendEmail({
    to: [{ email: to, name }],
    subject: `Bienvenido/a a NOIR·ESSENCE, ${firstName}`,
    htmlContent: emailBase(content, `Tu cuenta está lista. Descubre fragancias de autor.`),
  })
}
