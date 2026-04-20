<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { ChevronLeft, ChevronRight } from '@lucide/svelte';

  interface Props {
    page: number;
    total: number;
    limit: number;
  }

  let { page, total, limit }: Props = $props();

  let totalPages = $derived(Math.ceil(total / limit));
  let hasPrev = $derived(page > 1);
  let hasNext = $derived(page < totalPages);

  function goTo(p: number) {
    const params = new URLSearchParams(window.location.search);
    if (p <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(p));
    }
    window.location.search = params.toString();
  }
</script>

{#if totalPages > 1}
  <div class="flex items-center justify-center gap-2 mt-8 pb-4">
    <Button
      variant="outline"
      size="sm"
      disabled={!hasPrev}
      onclick={() => goTo(page - 1)}
    >
      <ChevronLeft class="size-4" />
      Previous
    </Button>

    <div class="flex items-center gap-1">
      {#each Array(Math.min(totalPages, 7)) as _, i}
        {@const pageNum = page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i}
        {#if pageNum >= 1 && pageNum <= totalPages}
          <Button
            variant={pageNum === page ? 'default' : 'ghost'}
            size="sm"
            class="min-w-[36px]"
            onclick={() => goTo(pageNum)}
          >
            {pageNum}
          </Button>
        {/if}
      {/each}
    </div>

    <Button
      variant="outline"
      size="sm"
      disabled={!hasNext}
      onclick={() => goTo(page + 1)}
    >
      Next
      <ChevronRight class="size-4" />
    </Button>

    <span class="text-sm text-[var(--color-text-secondary)] ml-2">
      {total} products
    </span>
  </div>
{/if}