import Link from 'next/link'
import type { Metadata } from 'next'
import { ProductCard } from '@/components/store/ProductCard'
import { SupabaseProductRepository } from '@/infrastructure/repositories/SupabaseProductRepository'
import { GetFeaturedProducts } from '@/domain/use-cases/products/GetProducts'
import { OLFACTORY_FAMILIES } from '@/constants'

export const metadata: Metadata = {
  title: 'NOIR·ESSENCE — Perfumería Nicho',
  description: 'Fragancias de autor. Perfumes que no se llevan — se habitan.',
}

export default async function HomePage() {
  const repo = new SupabaseProductRepository()
  const featured = await new GetFeaturedProducts(repo).execute(8).catch(() => [])

  return (
    <div className="min-h-screen bg-ink">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(184,154,90,0.06)_0%,transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-24">
          <div className="flex flex-col gap-6">
            <p className="text-[9px] tracking-[0.35em] uppercase text-gold font-sans animate-fade-in">
              Nueva colección — 2025
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-light leading-[1.05] text-paper">
              El arte de<br />
              <em className="text-gold-light not-italic">seducir</em><br />
              con aroma
            </h1>
            <p className="text-sm text-muted leading-relaxed max-w-sm font-light">
              Fragancias de autor, cada una una historia. Perfumes que no
              se llevan — se habitan.
            </p>
            <div className="flex gap-4 mt-2">
              <Link href="/catalogo" className="btn-primary">
                Explorar colección
              </Link>
              <Link href="/nosotros" className="btn-ghost">
                Nuestro ADN
              </Link>
            </div>
          </div>

          {/* Decorative bottle */}
          <div className="hidden md:flex items-center justify-center relative h-[420px]">
            <div className="absolute w-72 h-72 bg-[radial-gradient(circle,rgba(184,154,90,0.07)_0%,transparent_70%)] rounded-full" />
            <div className="relative">
              <div className="w-28 h-52 border border-[rgba(184,154,90,0.25)] bg-[rgba(184,154,90,0.03)] rounded-sm">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-10 h-10 border border-[rgba(184,154,90,0.2)] bg-[rgba(184,154,90,0.05)] rounded-sm" />
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-14 h-5 bg-[rgba(184,154,90,0.25)] rounded-sm" />
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-16 border border-[rgba(184,154,90,0.12)] flex flex-col items-center justify-center gap-1">
                  <span className="font-serif text-[10px] text-gold tracking-[0.2em]">NOIR</span>
                  <div className="w-10 h-px bg-[rgba(184,154,90,0.25)]" />
                  <span className="text-[8px] text-muted tracking-[0.08em]">100 ml · EDP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Strip ─────────────────────────────────────────── */}
      <div className="border-y border-[rgba(184,154,90,0.12)] py-3 overflow-hidden">
        <div className="flex gap-16 px-6">
          {[
            'Envío gratis +$200.000',
            'Fragancias 100% originales',
            'Pago seguro con Stripe',
            'Envío a toda Colombia',
            'Devoluciones en 30 días',
          ].map((text, i) => (
            <span key={i} className="text-[9px] tracking-[0.2em] uppercase text-muted whitespace-nowrap">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* ── Featured ─────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-serif text-3xl font-light text-paper">Más deseados</h2>
            <Link
              href="/catalogo"
              className="text-[9px] tracking-[0.15em] uppercase text-gold hover:text-gold-light transition-colors"
            >
              Ver todo →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>
        </section>
      )}

      {/* ── Families ─────────────────────────────────────────── */}
      <section className="border-t border-[rgba(184,154,90,0.12)] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-light text-paper mb-10">
            Por familia olfativa
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {OLFACTORY_FAMILIES.slice(0, 10).map(family => (
              <Link
                key={family}
                href={`/catalogo?familia=${encodeURIComponent(family)}`}
                className="border border-[rgba(184,154,90,0.15)] hover:border-gold/50 px-4 py-5 group transition-colors"
              >
                <p className="text-[10px] tracking-[0.15em] uppercase text-muted group-hover:text-gold transition-colors">
                  {family}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA newsletter ─────────────────────────────────────────── */}
      <section className="bg-smoke border-t border-[rgba(184,154,90,0.15)] py-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="label-gold mb-3">Club NOIR·ESSENCE</p>
          <h2 className="font-serif text-3xl font-light text-paper mb-4">
            Sé el primero en conocer<br />
            <em className="text-gold-light">los nuevos drops</em>
          </h2>
          <p className="text-sm text-muted mb-8 leading-relaxed font-light">
            Lanzamientos exclusivos, guías de fragancia y descuentos para suscriptores.
          </p>
          <form className="flex gap-0">
            <input
              type="email"
              placeholder="tu@email.com"
              className="input-dark flex-1 border-r-0"
            />
            <button type="submit" className="btn-primary px-6 whitespace-nowrap">
              Suscribirme
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
