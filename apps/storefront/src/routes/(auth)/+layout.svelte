<script lang="ts">
  let { children } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-background px-4 py-12">
  <div class="w-full max-w-md">
    {@render children()}
  </div>
</div>