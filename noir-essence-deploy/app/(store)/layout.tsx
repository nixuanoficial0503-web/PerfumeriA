import { Navbar } from '@/components/store/Navbar'
import { CartDrawer } from '@/components/store/CartDrawer'
import { Toast } from '@/components/ui/Toast'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink">
        {children}
      </main>
      <CartDrawer />
      <Toast />
      <footer className="border-t border-[rgba(184,154,90,0.15)] py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <p className="font-serif text-xl font-light tracking-[0.3em] text-paper mb-4">
              NOIR·<span className="text-gold">ESSENCE</span>
            </p>
            <p className="text-xs text-muted leading-relaxed max-w-xs font-light">
              Perfumería nicho. Fragancias de autor seleccionadas para quienes buscan
              una firma olfativa única.
            </p>
          </div>
          <div>
            <p className="text-[9px] text-gold tracking-[0.2em] uppercase mb-4">Tienda</p>
            <ul className="flex flex-col gap-2">
              {['Catálogo', 'Novedades', 'Marcas', 'Colecciones'].map(item => (
                <li key={item}>
                  <span className="text-xs text-muted hover:text-paper transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[9px] text-gold tracking-[0.2em] uppercase mb-4">Ayuda</p>
            <ul className="flex flex-col gap-2">
              {['Envíos', 'Devoluciones', 'FAQ', 'Contacto'].map(item => (
                <li key={item}>
                  <span className="text-xs text-muted hover:text-paper transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[rgba(184,154,90,0.1)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted">
            © {new Date().getFullYear()} NOIR·ESSENCE. Todos los derechos reservados.
          </p>
          <p className="text-[10px] text-muted">
            Pagos seguros con{' '}
            <span className="text-gold">Stripe</span>
          </p>
        </div>
      </footer>
    </>
  )
}
