'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUIStore } from '@/store/uiStore'

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]) // product IDs
  const [loading, setLoading] = useState(false)
  const showToast = useUIStore(s => s.showToast)

  // Load wishlist on mount
  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user.id)

      setWishlist((data ?? []).map(d => d.product_id))
    }
    load()
  }, [])

  const toggle = useCallback(async (productId: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      showToast('Inicia sesión para guardar favoritos', 'info')
      return
    }

    setLoading(true)
    const isWishlisted = wishlist.includes(productId)

    if (isWishlisted) {
      await supabase.from('wishlist').delete()
        .eq('user_id', user.id).eq('product_id', productId)
      setWishlist(w => w.filter(id => id !== productId))
      showToast('Eliminado de favoritos', 'info')
    } else {
      await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId })
      setWishlist(w => [...w, productId])
      showToast('Guardado en favoritos')
    }

    setLoading(false)
  }, [wishlist, showToast])

  return {
    wishlist,
    isWishlisted: (id: string) => wishlist.includes(id),
    toggle,
    loading,
  }
}
