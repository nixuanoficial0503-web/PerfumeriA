import { createClient } from '@/lib/supabase/server'

interface ReviewsSectionProps {
  productId: string
}

export async function ReviewsSection({ productId }: ReviewsSectionProps) {
  const supabase = await createClient()
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      id, rating, comment, created_at, is_verified,
      profiles ( full_name )
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(20)

  const avgRating = reviews?.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0

  return (
    <section className="mt-16 border-t border-[rgba(184,154,90,0.15)] pt-12">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-serif text-2xl font-light text-paper">
          Reseñas
          {reviews?.length ? (
            <span className="text-muted font-sans text-sm font-light ml-3">
              ({reviews.length})
            </span>
          ) : null}
        </h2>
        {avgRating > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={avgRating} />
            <span className="text-[10px] text-muted">{avgRating.toFixed(1)} / 5</span>
          </div>
        )}
      </div>

      {!reviews?.length ? (
        <p className="text-sm text-muted">Aún no hay reseñas para este producto.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map(review => (
            <div
              key={review.id}
              className="border border-[rgba(184,154,90,0.15)] p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-paper font-medium">
                    {(review.profiles as any)?.full_name ?? 'Cliente anónimo'}
                  </p>
                  {review.is_verified && (
                    <p className="text-[9px] text-success mt-0.5">✓ Compra verificada</p>
                  )}
                </div>
                <Stars rating={review.rating} />
              </div>
              {review.comment && (
                <p className="text-sm text-muted leading-relaxed font-light">
                  {review.comment}
                </p>
              )}
              <p className="text-[9px] text-muted/60 mt-auto">
                {new Date(review.created_at).toLocaleDateString('es-CO', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          className={n <= Math.round(rating) ? 'text-gold text-[11px]' : 'text-muted text-[11px]'}
        >
          ★
        </span>
      ))}
    </div>
  )
}
