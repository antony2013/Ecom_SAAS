<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Minus, Plus, ShoppingCart } from '@lucide/svelte';

  interface Props {
    productId: string;
    price: string;
    quantity: number;
    onQuantityChange: (q: number) => void;
    variantOptionIds?: string[];
    combinationKey?: string;
    modifierOptionIds?: string[];
    inStock?: boolean;
    mobile?: boolean;
  }

  let {
    productId,
    price,
    quantity,
    onQuantityChange,
    variantOptionIds = [],
    combinationKey = '',
    modifierOptionIds = [],
    inStock = true,
    mobile = false,
  }: Props = $props();

  let adding = $state(false);

  async function addToCart() {
    adding = true;
    try {
      const res = await fetch('/api/v1/public/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          quantity,
          variantOptionIds: variantOptionIds.length > 0 ? variantOptionIds : undefined,
          combinationKey: combinationKey || undefined,
          modifierOptionIds: modifierOptionIds.length > 0 ? modifierOptionIds : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Failed to add to cart' }));
        throw new Error(data.message);
      }
      // Trigger cart refresh — event or store update
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (e: any) {
      console.error('Add to cart failed:', e.message);
    } finally {
      adding = false;
    }
  }
</script>

{#if mobile}
  <div class="flex items-center gap-3">
    <div class="flex items-center border border-[var(--color-border)] rounded-[var(--radius-md)]">
      <button
        class="px-3 py-2 text-[var(--color-text)] hover:bg-[var(--color-surface)]"
        onclick={() => onQuantityChange(Math.max(1, quantity - 1))}
        aria-label="Decrease quantity"
      >
        <Minus class="size-4" />
      </button>
      <span class="px-3 text-sm font-medium text-[var(--color-text)]">{quantity}</span>
      <button
        class="px-3 py-2 text-[var(--color-text)] hover:bg-[var(--color-surface)]"
        onclick={() => onQuantityChange(quantity + 1)}
        aria-label="Increase quantity"
      >
        <Plus class="size-4" />
      </button>
    </div>
    <Button
      class="flex-1"
      disabled={!inStock || adding}
      onclick={addToCart}
    >
      <ShoppingCart class="size-4 mr-2" />
      {adding ? 'Adding...' : !inStock ? 'Out of Stock' : 'Add to Cart'} — {price}
    </Button>
  </div>
{:else}
  <div class="space-y-4">
    <div class="flex items-center border border-[var(--color-border)] rounded-[var(--radius-md)] w-fit">
      <button
        class="px-4 py-3 text-[var(--color-text)] hover:bg-[var(--color-surface)] rounded-l-[var(--radius-md)]"
        onclick={() => onQuantityChange(Math.max(1, quantity - 1))}
        aria-label="Decrease quantity"
      >
        <Minus class="size-4" />
      </button>
      <span class="px-6 text-base font-medium text-[var(--color-text)]">{quantity}</span>
      <button
        class="px-4 py-3 text-[var(--color-text)] hover:bg-[var(--color-surface)] rounded-r-[var(--radius-md)]"
        onclick={() => onQuantityChange(quantity + 1)}
        aria-label="Increase quantity"
      >
        <Plus class="size-4" />
      </button>
    </div>
    <Button
      size="lg"
      class="w-full"
      disabled={!inStock || adding}
      onclick={addToCart}
    >
      <ShoppingCart class="size-5 mr-2" />
      {adding ? 'Adding...' : !inStock ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  </div>
{/if}