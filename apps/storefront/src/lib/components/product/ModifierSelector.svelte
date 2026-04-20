<script lang="ts">
  import type { ModifierGroup } from '@repo/shared-types';
  import { formatPrice } from '$lib/utils/format.js';

  interface Props {
    group: ModifierGroup;
    selectedIds: string[];
    onSelect: (ids: string[]) => void;
  }

  let { group, selectedIds, onSelect }: Props = $props();

  function toggle(optionId: string) {
    if (group.maxSelections === 1) {
      // Radio behavior
      if (selectedIds.includes(optionId)) {
        onSelect([]);
      } else {
        onSelect([optionId]);
      }
    } else {
      // Checkbox behavior
      if (selectedIds.includes(optionId)) {
        onSelect(selectedIds.filter((id) => id !== optionId));
      } else {
        if (selectedIds.length < group.maxSelections) {
          onSelect([...selectedIds, optionId]);
        }
      }
    }
  }
</script>

<div>
  <div class="flex items-center gap-2 mb-2">
    <h3 class="text-sm font-semibold text-[var(--color-text)]">{group.name}</h3>
    {#if group.isRequired}
      <span class="text-xs text-[var(--color-primary)] font-medium">Required</span>
    {:else}
      <span class="text-xs text-[var(--color-text-secondary)]">Optional</span>
    {/if}
    {#if group.maxSelections > 1}
      <span class="text-xs text-[var(--color-text-secondary)]">
        (max {group.maxSelections})
      </span>
    {/if}
  </div>
  <div class="space-y-2">
    {#each group.options as option}
      <button
        class="flex items-center justify-between w-full px-4 py-3 rounded-[var(--radius-md)] border transition-all text-left {selectedIds.includes(option.id)
          ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)]'
          : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50'} {!option.isAvailable
          ? 'opacity-40 cursor-not-allowed'
          : ''}"
        onclick={() => option.isAvailable && toggle(option.id)}
        disabled={!option.isAvailable}
      >
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 rounded-{group.maxSelections === 1 ? 'full' : '[var(--radius-sm)]'} border-2 flex items-center justify-center {selectedIds.includes(option.id) ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-[var(--color-border)]'}">
            {#if selectedIds.includes(option.id)}
              <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            {/if}
          </div>
          <span class="text-sm text-[var(--color-text)]">{option.nameEn}</span>
        </div>
        {#if parseFloat(option.priceAdjustment) > 0}
          <span class="text-sm text-[var(--color-text-secondary)]">
            +{formatPrice(option.priceAdjustment)}
          </span>
        {/if}
      </button>
    {/each}
  </div>
</div>