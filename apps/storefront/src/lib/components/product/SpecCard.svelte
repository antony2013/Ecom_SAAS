<script lang="ts">
	import type { ProductListItem } from '@repo/shared-types';
	import { ShoppingCart, Plus } from '@lucide/svelte';
	import { formatPrice, parseImages, parseTags, calcDiscountedPrice, discountLabel } from '$lib/utils/format.js';
	import { cn } from '$lib/utils.js';

	interface Props {
		product: ProductListItem;
		showAddToCart?: boolean;
		showDiscountBadge?: boolean;
	}

	let { product, showAddToCart = true, showDiscountBadge = true }: Props = $props();

	let images = $derived(parseImages(product.images));
	let tags = $derived(parseTags(product.tags));
	let hasDiscount = $derived(parseFloat(product.discount) > 0);
	let finalPrice = $derived(calcDiscountedPrice(product.salePrice, product.discountType, product.discount));
	let label = $derived(discountLabel(product.discountType, product.discount));

	let compareChecked = $state(false);
</script>

<a
	href="/products/{product.id}"
	class="group block overflow-hidden rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-200 ease-out hover:border-[var(--color-primary)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
	aria-label="View {product.titleEn}"
>
	<!-- Image area: landscape 4:3 -->
	<div class="relative aspect-[4/3] overflow-hidden bg-[var(--color-bg)]">
		{#if images.length > 0}
			<img
				src={images[0]}
				alt={product.titleEn}
				loading="lazy"
				class="h-full w-full object-contain p-4 transition-transform duration-200 group-hover:scale-[1.03]"
			/>
		{:else}
			<div class="h-full w-full flex items-center justify-center">
				<span class="text-[var(--color-text-secondary)] text-sm">No image</span>
			</div>
		{/if}

		<!-- Discount badge — blue accent -->
		{#if hasDiscount && showDiscountBadge && label}
			<span
				class="absolute top-2 left-2 rounded-[6px] bg-[var(--color-accent)] px-2 py-0.5 text-xs font-semibold text-white"
				aria-label="Discount {label}"
			>
				{label}
			</span>
		{/if}
	</div>

	<!-- Content: structured, info-dense -->
	<div class="flex flex-col gap-2 p-3">
		<!-- Product name — bold -->
		<h3 class="text-sm font-bold text-[var(--color-text)] leading-tight line-clamp-2">
			{product.titleEn}
		</h3>

		<!-- Spec tags: inline badges from product.tags -->
		{#if tags.length > 0}
			<div class="flex flex-wrap gap-1">
				{#each tags.slice(0, 3) as tag}
					<span class="inline-block rounded-[4px] bg-[var(--color-bg)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-secondary)] border border-[var(--color-border)]">
						{tag}
					</span>
				{/each}
			</div>
		{/if}

		<!-- Price row -->
		<div class="flex items-baseline gap-2">
			<span class="text-lg font-bold text-[var(--color-primary)]">
				{formatPrice(finalPrice)}
			</span>
			{#if hasDiscount}
				<span class="text-xs text-[var(--color-text-secondary)] line-through">
					{formatPrice(product.salePrice)}
				</span>
			{/if}
		</div>

		<!-- Bottom row: Add to Cart + Compare checkbox -->
		{#if showAddToCart}
			<div class="flex items-center gap-2 mt-auto pt-1 border-t border-[var(--color-border)]">
				<span
					class="flex-1 flex items-center justify-center gap-1.5 rounded-[6px] bg-[var(--color-primary)] px-2 py-1.5 text-xs font-semibold text-white transition-opacity group-hover:opacity-90"
					role="button"
					aria-label="Add {product.titleEn} to cart"
				>
					<ShoppingCart class="size-3.5" />
					Add to Cart
				</span>
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="flex items-center gap-1 cursor-pointer select-none shrink-0" onclick={(e) => e.stopPropagation()} onkeydown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.stopPropagation(); compareChecked = !compareChecked; } }}>
					<input
						type="checkbox"
						bind:checked={compareChecked}
						class="size-3.5 rounded-[2px] border-[var(--color-border)] text-[var(--color-primary)] accent-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
						aria-label="Compare {product.titleEn}"
						tabindex="-1"
					/>
					<span class="text-[10px] text-[var(--color-text-secondary)]">Compare</span>
				</div>
			</div>
		{/if}
	</div>
</a>