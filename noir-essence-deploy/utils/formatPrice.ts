/**
 * Formats a price stored in centavos (COP) to a readable string.
 * formatPrice(189000) → "$189.000"
 * formatPrice(189000, true) → "$189.000 COP"
 */
export function formatPrice(centavos: number, showCurrency = false): string {
  const pesos = centavos / 100
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pesos)

  // Remove " COP" suffix unless requested
  return showCurrency ? formatted : formatted.replace(/\s?COP/, '')
}

/**
 * Converts pesos to centavos for storage.
 * toCentavos(189000) → 18900000  (pesos → centavos)
 */
export function toCentavos(pesos: number): number {
  return Math.round(pesos * 100)
}

/**
 * Converts centavos to pesos.
 * toPesos(18900000) → 189000
 */
export function toPesos(centavos: number): number {
  return centavos / 100
}
