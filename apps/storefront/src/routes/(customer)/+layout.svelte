<script lang="ts">
  let { children, data } = $props();
</script>

<div class="min-h-screen">
  <header class="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
    <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
      <a href="/account" class="text-lg font-semibold text-[var(--color-primary)]">My Account</a>
      <nav class="flex items-center gap-4">
        <a href="/account" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">Account</a>
        <a href="/account/orders" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">Orders</a>
        <a href="/account/profile" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">Profile</a>
        <a href="/account/addresses" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">Addresses</a>
        <a href="/account/wishlist" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">Wishlist</a>
        <form method="POST" action="/api/v1/customer/auth/logout">
          <button type="submit" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">Sign out</button>
        </form>
      </nav>
    </div>
  </header>

  <main class="mx-auto max-w-6xl px-4 py-8">
    {@render children()}
  </main>
</div>