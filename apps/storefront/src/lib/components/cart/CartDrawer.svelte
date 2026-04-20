<script lang="ts">
  import type { Cart } from '@repo/shared-types';
  import { formatPrice } from '$lib/utils/format.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { X, Minus, Plus, Trash2 } from '@lucide/svelte';

  interface Props {
    cart: Cart | null;
    open: boolean;
    onClose: () => void;
  }

  let { cart, open, onClose }: Props = $props();

  let updating = $state<Set<string>>(new Set());

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return;
    updating.add(itemId);
    try {
      const res = await fetch(`/api/v1/public/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity }),
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent('cart-updated'));
      }
    } catch {
      // failed
    } finally {
      updating.delete(itemId);
    }
  }

  async function removeItem(itemId: string) {
    updating.add(itemId);
    try {
      const res = await fetch(`/api/v1/public/cart/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent('cart-updated'));
      }
    } catch {
      // failed
    } finally {
      updating.delete(itemId);
    }
  }
</script>

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-40 bg-black/50 transition-opacity"
    onclick={onClose}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
    role="presentation"
  ></div>

  <!-- Drawer -->
  <aside
    class="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[var(--color-bg)] shadow-xl flex flex-col transition-transform duration-300 {open ? 'translate-x-0' : 'translate-x-full'}"
    role="dialog"
    aria-label="Shopping cart"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
      <h2 class="text-lg font-semibold text-[var(--color-text)]">Cart ({cart?.itemCount ?? 0})</h2>
      <Button variant="ghost" size="icon" onclick={onClose} aria-label="Close cart">
        <X class="size-5" />
      </Button>
    </div>

    <!-- Items -->
    <div class="flex-1 overflow-y-auto px-6 py-4">
      {#if !cart || !cart.items || cart.items.length === 0}
        <p class="text-center text-[var(--color-text-secondary)] py-8">Your cart is empty</p>
      {:else}
        <div class="space-y-4">
          {#each cart.items as item (item.id)}
            <div class="flex items-center gap-3 {updating.has(item.id) ? 'opacity-60' : ''}">
              <div class="shrink-0 w-14 h-14 bg-[var(--color-surface)] rounded-[var(--radius-sm)] flex items-center justify-center">
                <span class="text-[10px] text-[var(--color-text-secondary)]">{item.productId.slice(0,6)}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-[var(--color-text)] truncate">{item.productId.slice(0,12)}</p>
                <p class="text-xs text-[var(--color-text-secondary)]">{formatPrice(item.price)} each</p>
                <div class="flex items-center gap-2 mt-1">
                  <button
                    class="p-0.5 border border-[var(--color-border)] rounded hover:bg-[var(--color-surface)]"
                    onclick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus class="size-3" />
                  </button>
                  <span class="text-xs font-medium w-6 text-center">{item.quantity}</span>
                  <button
                    class="p-0.5 border border-[var(--color-border)] rounded hover:bg-[var(--color-surface)]"
                    onclick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus class="size-3" />
                  </button>
                  <button
                    class="p-0.5 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] ml-auto"
                    onclick={() => removeItem(item.id)}
                  >
                    <Trash2 class="size-3" />
                  </button>
                </div>
              </div>
              <span class="text-sm font-semibold text-[var(--color-text)]">{formatPrice(item.total)}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Footer -->
    {#if cart && cart.items.length > 0}
      <div class="border-t border-[var(--color-border)] px-6 py-4 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-[var(--color-text-secondary)]">Subtotal</span>
          <span class="font-semibold text-[var(--color-text)]">{formatPrice(cart.subtotal)}</span>
        </div>
        <a href="/cart">
          <Button variant="outline" class="w-full" size="sm">View Cart</Button>
        </a>
        <a href="/checkout/shipping">
          <Button class="w-full" size="sm">Checkout</Button>
        </a>
      </div>
    {/if}
  </aside>
{/if}