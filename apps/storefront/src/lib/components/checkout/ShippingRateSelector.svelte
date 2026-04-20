<script lang="ts">
  import type { ShippingOption } from '@repo/shared-types';
  import { formatPrice } from '$lib/utils/format.js';
  import { Truck, Zap } from '@lucide/svelte';

  interface Props {
    options: ShippingOption[];
    selectedId?: string;
    onSelect: (id: string) => void;
  }

  let { options, selectedId = '', onSelect }: Props = $props();

  function getIcon(method: string) {
    if (method === 'express' || method === 'overnight') return Zap;
    return Truck;
  }

  function getEstimate(option: ShippingOption) {
    if (option.estimatedDays === 1) return 'Next day';
    if (option.estimatedDays) return `${option.estimatedDays} days`;
    return '';
  }
</script>

{#if options.length === 0}
  <p class="text-sm text-[var(--color-text-secondary)]">Enter your address to see shipping options</p>
{:else}
  <div class="space-y-2">
    {#each options as option (option.id)}
      {@const Icon = getIcon(option.method)}
      {@const estimate = getEstimate(option)}
      <button
        class="flex items-center justify-between w-full px-4 py-3 rounded-[var(--radius-md)] border transition-all {selectedId === option.id
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50'}"
        onclick={() => onSelect(option.id)}
      >
        <div class="flex items-center gap-3">
          <Icon class="size-5 text-[var(--color-primary)]" />
          <div class="text-left">
            <p class="text-sm font-medium text-[var(--color-text)]">{option.name}</p>
            {#if estimate}
              <p class="text-xs text-[var(--color-text-secondary)]">{estimate}</p>
            {/if}
          </div>
        </div>
        <span class="text-sm font-semibold {option.free ? 'text-green-600' : 'text-[var(--color-text)]'}">
          {option.free ? 'Free' : formatPrice(option.price)}
        </span>
      </button>
    {/each}
  </div>
{/if}