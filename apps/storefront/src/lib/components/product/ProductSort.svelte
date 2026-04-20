<script lang="ts">
  interface Props {
    current?: string;
  }

  let { current = 'newest' }: Props = $props();

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Popular' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A-Z' },
  ];

  function handleChange(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    const params = new URLSearchParams(window.location.search);
    params.set('sort', value);
    params.delete('page');
    window.location.search = params.toString();
  }
</script>

<div class="flex items-center gap-2">
  <label for="sort-select" class="text-sm text-[var(--color-text-secondary)] hidden sm:inline">Sort by:</label>
  <select
    id="sort-select"
    class="px-3 py-2 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
    value={current}
    onchange={handleChange}
  >
    {#each sortOptions as opt}
      <option value={opt.value}>{opt.label}</option>
    {/each}
  </select>
</div>