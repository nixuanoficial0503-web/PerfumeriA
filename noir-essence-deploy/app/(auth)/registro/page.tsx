'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/utils/cn'

export default function RegistroPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center animate-fade-in">
          <div className="w-12 h-12 border border-gold/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-gold text-lg">✓</span>
          </div>
          <h2 className="font-serif text-2xl font-light text-paper mb-3">
            Revisa tu correo
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-6">
            Te enviamos un enlace de confirmación a{' '}
            <span className="text-gold">{email}</span>.
            Confirma tu cuenta para comenzar.
          </p>
          <Link href="/login" className="btn-ghost inline-block">
            Volver al inicio de sesión
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-6">
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
            Crea tu cuenta
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fullName" className="label-caps">Nombre completo</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="input-dark"
              placeholder="Tu nombre"
              required
              autoComplete="name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="label-caps">Email</label>
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
            <label htmlFor="password" className="label-caps">
              Contraseña
              <span className="text-muted font-normal normal-case tracking-normal ml-1">(mín. 8 caracteres)</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-dark"
              placeholder="••••••••"
              required
              autoComplete="new-password"
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
            className={cn('btn-primary w-full mt-2', loading && 'opacity-60 cursor-not-allowed')}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p className="text-[10px] text-muted text-center leading-relaxed">
            Al registrarte aceptas nuestros{' '}
            <Link href="/terminos" className="text-gold hover:text-gold-light transition-colors">
              términos y condiciones
            </Link>
          </p>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 divider" />
          <span className="text-[9px] text-muted tracking-[0.15em] uppercase">o</span>
          <div className="flex-1 divider" />
        </div>

        <p className="text-center text-[11px] text-muted">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  )
}
