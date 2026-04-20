<script lang="ts">
  import type { PageData } from './$types.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { CheckCircle } from '@lucide/svelte';
  import { formatPrice } from '$lib/utils/format.js';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Order Confirmed</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-16 text-center">
  <CheckCircle class="size-16 mx-auto text-green-500 mb-4" />
  <h1 class="text-3xl font-bold text-[var(--color-text)] mb-2">Order Confirmed!</h1>
  <p class="text-[var(--color-text-secondary)] mb-8">
    Thank you for your order. You will receive a confirmation email shortly.
  </p>

  {#if data.order}
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-6 text-left mb-8">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-[var(--color-text-secondary)]">Order Number</p>
          <p class="font-semibold text-[var(--color-text)]">{data.order.orderNumber}</p>
        </div>
        <div>
          <p class="text-[var(--color-text-secondary)]">Total</p>
          <p class="font-semibold text-[var(--color-primary)]">{formatPrice(data.order.total)}</p>
        </div>
        <div>
          <p class="text-[var(--color-text-secondary)]">Status</p>
          <p class="font-medium text-[var(--color-text)]">{data.order.status}</p>
        </div>
        <div>
          <p class="text-[var(--color-text-secondary)]">Payment</p>
          <p class="font-medium text-[var(--color-text)]">{data.order.paymentMethod ?? 'COD'}</p>
        </div>
      </div>

      {#if data.order.items && data.order.items.length > 0}
        <div class="mt-4 pt-4 border-t border-[var(--color-border)]">
          <p class="text-sm font-semibold text-[var(--color-text)] mb-2">Items</p>
          {#each data.order.items as item}
            <div class="flex justify-between text-sm py-1">
              <span class="text-[var(--color-text-secondary)]">{item.productName} x{item.quantity}</span>
              <span class="text-[var(--color-text)]">{formatPrice(item.total)}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {:else}
    <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-6 mb-8">
      <p class="text-sm text-[var(--color-text-secondary)]">Your order has been placed. Check your email for details.</p>
    </div>
  {/if}

  <div class="flex items-center justify-center gap-4">
    <a href="/products">
      <Button variant="outline">Continue Shopping</Button>
    </a>
    {#if data.isLoggedIn}
      <a href="/account/orders">
        <Button>View Orders</Button>
      </a>
    {/if}
  </div>
</div>