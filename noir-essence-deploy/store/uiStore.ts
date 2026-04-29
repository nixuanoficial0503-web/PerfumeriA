import { create } from 'zustand'

interface UIStore {
  // Mobile menu
  isMobileMenuOpen: boolean
  openMobileMenu: () => void
  closeMobileMenu: () => void

  // Search
  isSearchOpen: boolean
  openSearch: () => void
  closeSearch: () => void

  // Toast notifications
  toast: { message: string; type: 'success' | 'error' | 'info' } | null
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  hideToast: () => void
}

export const useUIStore = create<UIStore>()((set) => ({
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  toast: null,
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } })
    setTimeout(() => set({ toast: null }), 3500)
  },
  hideToast: () => set({ toast: null }),
}))
