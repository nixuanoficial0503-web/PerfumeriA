'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'

// Clears the cart after a successful purchase
export function ClearCartOnSuccess() {
  const clearCart = useCartStore(s => s.clearCart)
  useEffect(() => { clearCart() }, [clearCart])
  return null
}
