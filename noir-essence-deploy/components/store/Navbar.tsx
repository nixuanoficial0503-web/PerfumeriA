'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, User, Search, Menu, X, Heart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/uiStore'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/utils/cn'

const NAV_LINKS = [
  { label: 'Colecciones', href: '/catalogo' },
  { label: 'Novedades', href: '/catalogo?sort=newest' },
  { label: 'Marcas', href: '/marcas' },
  { label: 'Nuestro ADN', href: '/nosotros' },
]

export function Navbar() {
  const router = useRouter()
  const count = useCartStore(s => s.count())
  const openCart = useCartStore(s => s.openCart)
  const { user, isAdmin } = useAuth()
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu, openSearch } = useUIStore()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-ink/95 backdrop-blur-sm border-b border-[rgba(184,154,90,0.15)]">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="font-serif text-xl font-light tracking-[0.3em] text-paper hover:text-gold transition-colors">
            NOIR·<span className="text-gold">ESSENCE</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] tracking-[0.12em] uppercase text-muted hover:text-paper transition-colors font-sans"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={openSearch}
              aria-label="Buscar"
              className="w-9 h-9 flex items-center justify-center text-muted hover:text-gold transition-colors"
            >
              <Search size={16} />
            </button>

            {/* Wishlist / Account */}
            {user ? (
              <>
                <Link
                  href="/cuenta/wishlist"
                  aria-label="Lista de deseos"
                  className="w-9 h-9 flex items-center justify-center text-muted hover:text-gold transition-colors"
                >
                  <Heart size={16} />
                </Link>
                <Link
                  href={isAdmin ? '/admin' : '/cuenta'}
                  aria-label="Mi cuenta"
                  className="w-9 h-9 flex items-center justify-center text-muted hover:text-gold transition-colors"
                >
                  <User size={16} />
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                aria-label="Iniciar sesión"
                className="w-9 h-9 flex items-center justify-center text-muted hover:text-gold transition-colors"
              >
                <User size={16} />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              aria-label={`Carrito (${count} items)`}
              className="relative w-9 h-9 flex items-center justify-center text-muted hover:text-gold transition-colors"
            >
              <ShoppingBag size={16} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-ink text-[8px] font-medium rounded-full flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
              aria-label="Menú"
              className="md:hidden w-9 h-9 flex items-center justify-center text-muted hover:text-gold transition-colors ml-1"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-ink pt-16 animate-fade-in md:hidden">
          <nav className="flex flex-col px-6 py-8 gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="py-4 text-sm tracking-[0.1em] uppercase text-muted hover:text-paper border-b border-[rgba(184,154,90,0.1)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-8 flex flex-col gap-3">
              {user ? (
                <>
                  <Link href="/cuenta" onClick={closeMobileMenu} className="btn-ghost text-center">
                    Mi cuenta
                  </Link>
                  <button onClick={handleLogout} className="btn-danger">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={closeMobileMenu} className="btn-primary text-center">
                    Iniciar sesión
                  </Link>
                  <Link href="/registro" onClick={closeMobileMenu} className="btn-ghost text-center">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}
