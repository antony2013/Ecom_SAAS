import type { PageServerLoad } from './$types.js';
import type { Product } from '@repo/shared-types';
import { error } from '@sveltejs/kit';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3000';

export const load: PageServerLoad = async ({ params, url, fetch }) => {
  const host = url.hostname;
  const subdomain = host.split('.')[0];
  const storeDomain = subdomain !== 'localhost' && subdomain !== '127' ? subdomain : undefined;
  const headers: Record<string, string> = {};
  if (storeDomain) headers['X-Store-Domain'] = storeDomain;

  let product: Product | null = null;
  try {
    const res = await fetch(`${API_BASE}/api/v1/public/products/${params.id}`, { headers });
    if (res.ok) {
      const data = await res.json();
      product = data.product ?? null;
    } else if (res.status === 404) {
      throw error(404, 'Product not found');
    }
  } catch (e: any) {
    if (e?.status === 404) throw e;
  }

  if (!product) {
    throw error(404, 'Product not found');
  }

  // Fetch related products (same category, limit 4)
  let relatedProducts: Product[] = [];
  try {
    const relParams = new URLSearchParams({
      categoryId: product.categoryId,
      limit: '4',
      sort: 'newest',
    });
    const res = await fetch(`${API_BASE}/api/v1/public/products/search?${relParams.toString()}`, {
      headers,
    });
    if (res.ok) {
      const data = await res.json();
      relatedProducts = (data.items ?? []).filter((p: Product) => p.id !== product!.id).slice(0, 4);
    }
  } catch {
    // continue without related products
  }

  // Fetch reviews
  let reviews: any[] = [];
  let reviewTotal = 0;
  let reviewAvg = 0;
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/public/reviews/product/${params.id}?limit=10`,
      { headers },
    );
    if (res.ok) {
      const data = await res.json();
      reviews = data.data ?? [];
      reviewTotal = data.pagination?.total ?? 0;
      reviewAvg =
        reviews.length > 0
          ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
          : 0;
    }
  } catch {
    // continue without reviews
  }

  // Fetch bundles containing this product
  let bundles: any[] = [];
  try {
    const res = await fetch(`${API_BASE}/api/v1/public/bundles/product/${params.id}`, { headers });
    if (res.ok) {
      const data = await res.json();
      bundles = data.bundles ?? [];
    }
  } catch {
    // continue without bundles
  }

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.titleEn,
    description: product.descriptionEn ?? '',
    image: Array.isArray(product.images) ? product.images[0] ?? '' : product.images?.split(',')[0]?.trim() ?? '',
    offers: {
      '@type': 'Offer',
      price: product.salePrice,
      priceCurrency: 'USD',
      availability: product.currentQuantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    ...(reviewAvg > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: reviewAvg.toFixed(1),
            reviewCount: reviewTotal,
          },
        }
      : {}),
  };

  return {
    product,
    relatedProducts,
    reviews,
    reviewTotal,
    reviewAvg,
    bundles,
    jsonLd,
  };
};