import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://noiressence.vercel.app'
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true)

  const productUrls: MetadataRoute.Sitemap = (products ?? []).map(p => ({
    url: `${baseUrl}/producto/${p.slug}`,
    lastModified: new Date(p.updated_at ?? Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/catalogo`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/registro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ...productUrls,
  ]
}
