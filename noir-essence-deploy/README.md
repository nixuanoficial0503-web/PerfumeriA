# 🖤 NOIR·ESSENCE

> Perfumería nicho e-commerce · Colombia

**Stack:** Next.js 14 · Supabase · Stripe · Brevo · Cloudinary · Vercel  
**Costo:** $0/mes (free tiers)

---

## 🚀 Deploy rápido

```bash
# 1. Instalar
npm install

# 2. Variables de entorno
cp .env.example .env.local
# → Llena las variables con tus credenciales

# 3. Base de datos
# → Ejecuta supabase-MASTER.sql en Supabase SQL Editor

# 4. Dev local
npm run dev
# → http://localhost:3000
```

Lee **DEPLOY.md** para el paso a paso completo de producción.

---

## 📁 Estructura

```
├── app/
│   ├── (store)/          # Tienda pública
│   ├── (auth)/           # Login + Registro  
│   ├── (account)/        # Mi cuenta + Pedidos
│   ├── admin/            # Panel admin (protegido)
│   └── api/              # Routes: stripe, productos, pedidos, cron
├── components/
│   ├── store/            # Navbar, ProductCard, CartDrawer, etc.
│   ├── admin/            # OrderStatusUpdater, InventoryEditor, etc.
│   └── ui/               # Toast
├── lib/
│   ├── supabase/         # Clients browser + server
│   ├── stripe/           # Checkout + helpers
│   └── brevo/            # 4 email templates
├── domain/               # Clean Architecture: entities + use-cases
├── infrastructure/       # SupabaseProductRepository
├── store/                # Zustand: cart + ui
├── hooks/                # useAuth, useWishlist, useProducts
├── types/                # TypeScript: database, product, order, cart
└── utils/                # cn, formatPrice, slugify
```

---

## 🗺️ Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Home con hero + destacados |
| `/catalogo` | Catálogo con filtros |
| `/producto/[slug]` | Detalle del producto |
| `/carrito` | Carrito completo |
| `/checkout` | Pago con Stripe |
| `/checkout/success` | Confirmación de compra |
| `/login` | Inicio de sesión |
| `/registro` | Crear cuenta |
| `/cuenta` | Perfil del usuario |
| `/cuenta/pedidos` | Historial de pedidos |
| `/cuenta/wishlist` | Lista de favoritos |
| `/admin` | Dashboard admin |
| `/admin/pedidos` | Gestión de pedidos |
| `/admin/productos` | CRUD productos |
| `/admin/inventario` | Control de stock |
| `/admin/clientes` | Lista de clientes |
| `/admin/descuentos` | Códigos de descuento |

---

## 💳 Tarjeta de prueba Stripe

```
Número:  4242 4242 4242 4242
Fecha:   12/30
CVV:     123
```

---

*NOIR·ESSENCE · Hecho con 🖤 y Next.js*
