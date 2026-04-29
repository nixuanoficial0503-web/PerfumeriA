import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FREE_SHIPPING_THRESHOLD, MAX_CART_ITEMS } from '@/constants'

export interface CartItem {
  variantId: string
  productId: string
  name: string
  brand: string
  sizeMl: number
  price: number        // en centavos COP
  quantity: number
  image: string
  slug: string
  concentration: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Computed
  total: () => number
  count: () => number
  hasItem: (variantId: string) => boolean
  hasFreeShipping: () => boolean
  amountToFreeShipping: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.variantId === item.variantId)

        if (existing) {
          if (existing.quantity >= MAX_CART_ITEMS) return state
          return {
            items: state.items.map(i =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
            isOpen: true,
          }
        }

        return {
          items: [...state.items, { ...item, quantity: 1 }],
          isOpen: true,
        }
      }),

      removeItem: (variantId) => set((state) => ({
        items: state.items.filter(i => i.variantId !== variantId),
      })),

      updateQuantity: (variantId, quantity) => set((state) => {
        if (quantity <= 0) {
          return { items: state.items.filter(i => i.variantId !== variantId) }
        }
        return {
          items: state.items.map(i =>
            i.variantId === variantId
              ? { ...i, quantity: Math.min(quantity, MAX_CART_ITEMS) }
              : i
          ),
        }
      }),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      count: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      hasItem: (variantId) =>
        get().items.some(i => i.variantId === variantId),

      hasFreeShipping: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0) >= FREE_SHIPPING_THRESHOLD,

      amountToFreeShipping: () => {
        const total = get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
        return Math.max(0, FREE_SHIPPING_THRESHOLD - total)
      },
    }),
    {
      name: 'noir-essence-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
