<script lang="ts">
  import type { PageData } from './$types.js';
  import { formatPrice } from '$lib/utils/format.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import ProductPagination from '$lib/components/product/ProductPagination.svelte';

  let { data }: { data: PageData } = $props();

  let statusFilter = $state('all');

  let filteredOrders = $derived(
    statusFilter === 'all'
      ? data.orders
      : data.orders.filter((o: any) => o.status === statusFilter)
  );

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
</script>

<svelte:head>
  <title>Orders | My Account</title>
</svelte:head>

<div>
  <h1 class="text-2xl font-bold text-[var(--color-text)] mb-6">Order History</h1>

  <!-- Status filter tabs -->
  <div class="flex flex-wrap gap-2 mb-6">
    {#each ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as status}
      <button
        class="px-3 py-1.5 text-sm rounded-[var(--radius-md)] transition-colors {statusFilter === status
          ? 'bg-[var(--color-primary)] text-white font-medium'
          : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'}"
        onclick={() => (statusFilter = status)}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </button>
    {/each}
  </div>

  {#if filteredOrders.length === 0}
    <p class="text-[var(--color-text-secondary)] text-center py-8">No orders found</p>
  {:else}
    <div class="space-y-4">
      {#each filteredOrders as order (order.id)}
        <a
          href="/account/orders/{order.id}"
          class="block p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:border-[var(--color-primary)]/30 transition-colors"
        >
          <div class="flex items-center justify-between mb-2">
            <div>
              <span class="text-sm font-semibold text-[var(--color-text)]">#{order.orderNumber}</span>
              <span class="text-xs text-[var(--color-text-secondary)] ml-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Badge class={statusColors[order.status] ?? 'bg-gray-100 text-gray-700'}>
              {order.status}
            </Badge>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-[var(--color-text-secondary)]">{order.items?.length ?? 0} item(s)</span>
            <span class="font-semibold text-[var(--color-primary)]">{formatPrice(order.total)}</span>
          </div>
        </a>
      {/each}
    </div>

    <ProductPagination page={data.page} total={data.total} limit={data.limit} />
  {/if}
</div>