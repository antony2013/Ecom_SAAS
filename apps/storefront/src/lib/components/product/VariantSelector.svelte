<script lang="ts">
  import type { ProductVariant } from '@repo/shared-types';

  interface Props {
    variant: ProductVariant;
    selectedIds: string[];
    onSelect: (ids: string[]) => void;
  }

  let { variant, selectedIds, onSelect }: Props = $props();

  function toggle(optionId: string) {
    if (selectedIds.includes(optionId)) {
      onSelect(selectedIds.filter((id) => id !== optionId));
    } else {
      onSelect([optionId]); // Single selection per variant group
    }
  }
</script>

<div>
  <h3 class="text-sm font-semibold text-[var(--color-text)] mb-2">{variant.nameEn}</h3>
  <div class="flex flex-wrap gap-2">
    {#each variant.options as option}
      <button
        class="px-4 py-2 text-sm rounded-[var(--radius-md)] border transition-all {selectedIds.includes(option.id)
          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] font-medium'
          : 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-primary)]'} {!option.isAvailable
          ? 'opacity-40 cursor-not-allowed'
          : ''}"
        onclick={() => option.isAvailable && toggle(option.id)}
        disabled={!option.isAvailable}
      >
        {option.nameEn}
        {#if parseFloat(option.priceAdjustment) > 0}
          <span class="ml-1 text-xs opacity-75">+{option.priceAdjustment}</span>
        {/if}
      </button>
    {/each}
  </div>
</div>