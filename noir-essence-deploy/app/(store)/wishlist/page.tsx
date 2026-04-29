import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SupabaseProductRepository } from '@/infrastructure/repositories/SupabaseProductRepository'
import { ProductCard } from '@/components/store/ProductCard'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Mi Wishlist — NOIR·ESSENCE' }

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/cuenta/wishlist')

  const { data: wishlist } = await supabase
    .from('wishlist')
    .select('product_id')
    .eq('user_id', user.id)

  const productIds = (wishlist ?? []).map(w => w.product_id)

  let products: any[] = []
  if (productIds.length) {
    const { data } = await supabase
      .from('products')
      .select(`*, brands ( id, name, slug, country ),
        product_variants ( id, size_ml, price, stock, stripe_price_id )`)
      .in('id', productIds)
      .eq('is_active', true)
    products = data ?? []
  }

  const mapped = products.map(p => ({
    id: p.id, name: p.name, slug: p.slug, description: p.description,
    tagline: p.tagline, concentration: p.concentration, gender: p.gender,
    olfactoryFamily: p.olfactory_family, notesTop: p.notes_top??[],
    notesHeart: p.notes_heart??[], notesBase: p.notes_base??[],
    images: p.images??[], isFeatured: p.is_featured,
    brandName: p.brands?.name??null, brandSlug: p.brands?.slug??null,
    variants: (p.product_variants??[]).map((v:any) => ({
      id: v.id, sizeMl: v.size_ml, price: v.price, stock: v.stock, stripePriceId: v.stripe_price_id
    })),
  }))

  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-baseline justify-between mb-10">
          <h1 className="font-serif text-3xl font-light text-paper">
            Mi Wishlist
            <span className="font-sans text-sm font-light text-muted ml-3">({mapped.length})</span>
          </h1>
        </div>
        {!mapped.length ? (
          <div className="text-center py-20">
            <p className="text-muted text-sm mb-6">Tu lista de favoritos está vacía.</p>
            <a href="/catalogo" className="btn-primary">Explorar fragancias</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mapped.map((p, i) => (
              <ProductCard key={p.id} product={p} isWishlisted priority={i<4} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
