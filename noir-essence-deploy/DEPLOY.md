# 🚀 Guía de Deploy — NOIR·ESSENCE

## Paso 1 — Supabase (5 min)

1. Ve a https://supabase.com → **New project**
   - Nombre: `noir-essence`
   - Región: `South America (São Paulo)`
   - Guarda la contraseña del DB en un lugar seguro

2. Una vez creado, ve a **SQL Editor** → pega TODO el contenido de `supabase-MASTER.sql` → **Run**

3. Ve a **Settings → API** y copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

4. Promueve tu usuario a admin (después de registrarte en la app):
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'tu@email.com';
   ```

---

## Paso 2 — Stripe (3 min)

1. Ve a https://dashboard.stripe.com → **Developers → API keys**
   - Copia `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copia `Secret key` → `STRIPE_SECRET_KEY`

2. **Developers → Webhooks → Add endpoint**
   - URL: `https://TU-APP.vercel.app/api/stripe/webhook`
   - Eventos a escuchar:
     - `checkout.session.completed`
     - `checkout.session.expired`
   - Copia el **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## Paso 3 — Brevo (2 min)

1. Ve a https://app.brevo.com → **SMTP & API → API Keys → Create**
   - Copia la key → `BREVO_API_KEY`
2. **Senders & IPs → Add a sender** → verifica tu email de envío

---

## Paso 4 — Cloudinary (2 min)

1. Ve a https://cloudinary.com → crea cuenta gratuita
2. Dashboard → copia **Cloud Name**, **API Key**, **API Secret**
3. Media Library → crea carpeta `noir-essence/products`

---

## Paso 5 — GitHub (2 min)

```bash
# En la carpeta raíz del proyecto:
git init
git add -A
git commit -m "🖤 NOIR·ESSENCE — Initial deploy"

# Crea repo en github.com/new (privado recomendado)
git remote add origin https://github.com/TU_USUARIO/noir-essence.git
git push -u origin main
```

---

## Paso 6 — Vercel (3 min)

1. Ve a https://vercel.com → **Add New Project → Import Git Repository**
2. Selecciona el repo `noir-essence`
3. Framework: **Next.js** (detección automática)
4. En **Environment Variables**, agrega TODAS las variables del `.env.example` con sus valores reales
5. Clic en **Deploy**

> ⚠️ En `NEXT_PUBLIC_APP_URL` usa la URL que te dé Vercel, ej: `https://noir-essence.vercel.app`

---

## Paso 7 — Verificación final ✅

| Check | URL |
|-------|-----|
| Home | `https://tu-app.vercel.app` |
| Catálogo | `https://tu-app.vercel.app/catalogo` |
| Login | `https://tu-app.vercel.app/login` |
| Admin | `https://tu-app.vercel.app/admin` |
| Sitemap | `https://tu-app.vercel.app/sitemap.xml` |

---

## Test del flujo completo

1. Regístrate en `/registro`
2. Corre en Supabase: `UPDATE profiles SET role = 'admin' WHERE email = 'tu@email.com'`
3. Ve a `/catalogo` → agrega un producto al carrito
4. Ve a `/checkout` → paga con tarjeta de prueba Stripe: `4242 4242 4242 4242`
5. Verifica que llegó el email de confirmación
6. Ve a `/admin/pedidos` → cambia el estado del pedido

---

## Costos mensuales

| Servicio | Plan | Costo |
|----------|------|-------|
| Vercel | Hobby | $0 |
| Supabase | Free | $0 |
| Stripe | — | 2.9% + $300 por transacción |
| Cloudinary | Free | $0 |
| Brevo | Free | $0 |
| **Total fijo** | | **$0/mes** |

