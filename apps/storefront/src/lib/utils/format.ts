/**
 * Format a decimal-string price for display.
 * Prices from the backend are always strings (decimal columns) — never assume numbers.
 */
export function formatPrice(price: string | number, currency = '$'): string {
	const num = typeof price === 'string' ? parseFloat(price) : price;
	if (Number.isNaN(num)) return `${currency}0.00`;
	return `${currency}${num.toFixed(2)}`;
}

/**
 * Parse the comma-separated `images` field into an array of URLs.
 * The backend stores multiple image URLs as a single comma-joined string.
 */
export function parseImages(images: string | null): string[] {
	if (!images) return [];
	return images
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
}

/**
 * Parse the comma-separated `tags` field into an array of strings.
 */
export function parseTags(tags: string | null): string[] {
	if (!tags) return [];
	return tags
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
}

/**
 * Compute the final price after applying a discount.
 * `discountType` is "Percent" or "Fixed" (matches backend enum).
 * Returns a number so callers can format it themselves.
 */
export function calcDiscountedPrice(
	salePrice: string,
	discountType: string,
	discount: string
): number {
	const price = parseFloat(salePrice);
	const disc = parseFloat(discount);
	if (Number.isNaN(price) || Number.isNaN(disc) || disc <= 0) return price;
	if (discountType === 'Percent') return price * (1 - disc / 100);
	return Math.max(0, price - disc);
}

/**
 * Build a human-readable discount label like "-20%" or "-$5.00".
 */
export function discountLabel(discountType: string, discount: string): string {
	const disc = parseFloat(discount);
	if (Number.isNaN(disc) || disc <= 0) return '';
	if (discountType === 'Percent') return `-${disc}%`;
	return `-${formatPrice(disc)}`;
}