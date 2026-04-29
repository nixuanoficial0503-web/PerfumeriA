export const APP_NAME = 'NOIR·ESSENCE'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

// Cart
export const MAX_CART_ITEMS = 10
export const FREE_SHIPPING_THRESHOLD = 20000000 // $200.000 COP en centavos

// Pagination
export const PRODUCTS_PER_PAGE = 12
export const ORDERS_PER_PAGE = 10

// Product
export const CONCENTRATION_LABELS: Record<string, string> = {
  EDC: 'Eau de Cologne',
  EDT: 'Eau de Toilette',
  EDP: 'Eau de Parfum',
  Parfum: 'Parfum / Extrait',
}

export const GENDER_LABELS: Record<string, string> = {
  masculino: 'Masculino',
  femenino: 'Femenino',
  unisex: 'Unisex',
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  processing: 'En preparación',
  shipped: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'text-gold bg-gold/10',
  paid: 'text-info bg-info/10',
  processing: 'text-info bg-info/10',
  shipped: 'text-info bg-info/10',
  delivered: 'text-success bg-success/10',
  cancelled: 'text-error bg-error/10',
}

// Olfactory families
export const OLFACTORY_FAMILIES = [
  'Amaderadas',
  'Florales',
  'Orientales',
  'Cítricas',
  'Acuáticas',
  'Especiadas',
  'Gourmand',
  'Chypre',
  'Fougère',
  'Cuero',
]

// Available sizes in ml
export const AVAILABLE_SIZES = [10, 30, 50, 75, 100, 125, 200]
