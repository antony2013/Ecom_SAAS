/**
 * Format a price from cents to display string.
 * Backend stores prices as decimal strings; this handles conversion.
 */
export function formatPrice(
  amount: number | string,
  currency: string = 'USD',
  locale: string = 'en-US',
): string {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

/**
 * Convert a price string to cents (for arithmetic).
 */
export function priceToCents(amount: string | number): number {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  return Math.round(numeric * 100);
}

/**
 * Convert cents back to a decimal string.
 */
export function centsToPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}