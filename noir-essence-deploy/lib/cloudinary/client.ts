// lib/cloudinary/client.ts

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!

/**
 * Build an optimized Cloudinary URL.
 * getImageUrl('noir-essence/products/oud-absolu/main', { w: 800 })
 */
export function getImageUrl(
  publicId: string,
  options: {
    w?: number
    h?: number
    quality?: number
    format?: string
    crop?: string
  } = {}
): string {
  const {
    w = 800,
    h,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
  } = options

  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    w ? `w_${w}` : '',
    h ? `h_${h}` : '',
    w && h ? `c_${crop}` : '',
  ]
    .filter(Boolean)
    .join(',')

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`
}

/**
 * Get a product's primary image URL, or a fallback placeholder.
 */
export function getProductImage(images: string[], index = 0): string {
  if (!images?.length) return '/placeholder-bottle.png'
  const img = images[index] ?? images[0]
  // If already a full URL, return as-is
  if (img.startsWith('http')) return img
  return getImageUrl(img, { w: 600, h: 700, crop: 'fill' })
}

/**
 * Get thumbnail version of an image.
 */
export function getProductThumbnail(images: string[], index = 0): string {
  if (!images?.length) return '/placeholder-bottle.png'
  const img = images[index] ?? images[0]
  if (img.startsWith('http')) return img
  return getImageUrl(img, { w: 200, h: 240, crop: 'fill' })
}
