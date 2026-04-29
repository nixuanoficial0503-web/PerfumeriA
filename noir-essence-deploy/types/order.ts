// types/order.ts

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
  department: string
  postalCode?: string
}

export interface OrderItemDetail {
  id: string
  variantId: string
  productName: string
  brandName: string
  sizeMl: number
  quantity: number
  unitPrice: number   // centavos
  image: string
  slug: string
}

export interface OrderDetail {
  id: string
  userId: string | null
  status: OrderStatus
  total: number            // centavos
  shippingAddress: ShippingAddress | null
  stripeSessionId: string | null
  notes: string | null
  createdAt: string
  items: OrderItemDetail[]
}
