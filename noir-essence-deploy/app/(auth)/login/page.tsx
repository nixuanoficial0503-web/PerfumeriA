'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/utils/cn'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-6">
      {/* Background texture */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,154,90,0.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/">
            <span className="font-serif text-2xl font-light tracking-[0.3em] text-paper hover:text-gold transition-colors">
              NOIR·ESSENCE
            </span>
          </Link>
          <p className="mt-2 text-[9px] text-muted tracking-[0.2em] uppercase">
            Accede a tu cuenta
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="label-caps">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-dark"
              placeholder="tu@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="label-caps">
                Contraseña
              </label>
              <Link
                href="/recuperar-contrasena"
                className="text-[9px] text-muted hover:text-gold transition-colors tracking-[0.1em]"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-dark"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-[11px] text-error border border-error/20 bg-error/5 px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              'btn-primary w-full mt-2',
              loading && 'opacity-60 cursor-not-allowed'
            )}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 divider" />
          <span className="text-[9px] text-muted tracking-[0.15em] uppercase">o</span>
          <div className="flex-1 divider" />
        </div>

        {/* Register link */}
        <p className="text-center text-[11px] text-muted">
          ¿No tienes cuenta?{' '}
          <Link
            href="/registro"
            className="text-gold hover:text-gold-light transition-colors"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  )
}
