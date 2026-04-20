<script lang="ts">
  import type { CartItem } from '@repo/shared-types';
  import { formatPrice } from '$lib/utils/format.js';

  interface Props {
    items: CartItem[];
    subtotal: string;
    shipping?: string;
    tax?: string;
    discount?: string;
    total: string;
  }

  let { items, subtotal, shipping = '0', tax = '0', discount = '0', total }: Props = $props();
</script>

<div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-6">
  <h2 class="text-lg font-semibold text-[var(--color-text)] mb-4">Order Summary</h2>

  <div class="space-y-3 mb-6">
    {#each items as item (item.id)}
      <div class="flex justify-between text-sm">
        <span class="text-[var(--color-text-secondary)] truncate mr-2">
          {item.productId.slice(0, 12)} x{item.quantity}
        </span>
        <span class="text-[var(--color-text)] font-medium shrink-0">{formatPrice(item.total)}</span>
      </div>
    {/each}
  </div>

  <div class="border-t border-[var(--color-border)] pt-3 space-y-2 text-sm">
    <div class="flex justify-between">
      <span class="text-[var(--color-text-secondary)]">Subtotal</span>
      <span class="text-[var(--color-text)]">{formatPrice(subtotal)}</span>
    </div>
    {#if parseFloat(shipping) > 0}
      <div class="flex justify-between">
        <span class="text-[var(--color-text-secondary)]">Shipping</span>
        <span class="text-[var(--color-text)]">{formatPrice(shipping)}</span>
      </div>
    {/if}
    {#if parseFloat(tax) > 0}
      <div class="flex justify-between">
        <span class="text-[var(--color-text-secondary)]">Tax</span>
        <span class="text-[var(--color-text)]">{formatPrice(tax)}</span>
      </div>
    {/if}
    {#if parseFloat(discount) > 0}
      <div class="flex justify-between text-green-600">
        <span>Discount</span>
        <span>-{formatPrice(discount)}</span>
      </div>
    {/if}
    <div class="border-t border-[var(--color-border)] pt-2 flex justify-between">
      <span class="font-semibold text-[var(--color-text)]">Total</span>
      <span class="font-bold text-lg text-[var(--color-primary)]">{formatPrice(total)}</span>
    </div>
  </div>
</div>