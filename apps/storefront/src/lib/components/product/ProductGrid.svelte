<script lang="ts">
	import type { ProductListItem } from '@repo/shared-types';
	import type { ThemeType } from '@repo/ui/themes';
	import ProductCard from './ProductCard.svelte';

	interface Props {
		products: ProductListItem[];
		themeType?: ThemeType;
		columns?: 2 | 3 | 4;
		showAddToCart?: boolean;
		showDiscountBadge?: boolean;
	}

	let {
		products,
		themeType = 'appliances',
		columns = 4,
		showAddToCart = true,
		showDiscountBadge = true
	}: Props = $props();

	/**
	 * Responsive grid classes:
	 *   - Mobile (< sm): 1 column
	 *   - sm: 2 columns
	 *   - md/lg: matches the `columns` prop
	 *
	 * We build the md breakpoint class dynamically so the prop drives the layout
	 * while keeping mobile-first defaults.
	 */
	let gridColsClass = $derived(
		columns === 2
			? 'md:grid-cols-2'
			: columns === 3
				? 'md:grid-cols-3'
				: 'md:grid-cols-4'
	);
</script>

{#if products.length === 0}
	<div class="flex flex-col items-center justify-center py-20 text-center">
		<span class="text-lg font-medium text-[var(--color-text-secondary)]">
			No products found
		</span>
		<span class="mt-1 text-sm text-[var(--color-text-secondary)]/70">
			Try adjusting your filters or browse other categories.
		</span>
	</div>
{:else}
	<div
		class="grid grid-cols-1 sm:grid-cols-2 {gridColsClass} gap-4 lg:gap-6"
		role="list"
		aria-label="Product list"
	>
		{#each products as product (product.id)}
			<div role="listitem">
				<ProductCard
					{product}
					{themeType}
					{showAddToCart}
					{showDiscountBadge}
				/>
			</div>
		{/each}
	</div>
{/if}