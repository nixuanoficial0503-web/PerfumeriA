// types/cart.ts
export interface CartItemType {
  variantId: string
  productId: string
  name: string
  brand: string
  sizeMl: number
  price: number        // centavos COP
  quantity: number
  image: string
  slug: string
  concentration: string
}
