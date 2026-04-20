<script lang="ts">
  import '../app.css';
  import ThemeProvider from '$lib/components/theme/ThemeProvider.svelte';
  import StoreHeader from '$lib/components/layout/StoreHeader.svelte';
  import StoreFooter from '$lib/components/layout/StoreFooter.svelte';
  import { Toaster } from '$lib/components/ui/sonner';

  let { data, children } = $props();
</script>

<ThemeProvider
  themeType={data.themeType ?? 'appliances'}
  overrides={data.themeOverrides}
>
  <div class="flex flex-col min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
    <StoreHeader
      storeName={data.store?.name}
      logoUrl={data.store?.logoUrl}
      showSearch={data.store?.showSearch ?? true}
      showWishlist={data.store?.showWishlist ?? true}
      isLoggedIn={data.isLoggedIn ?? false}
    />
    <main class="flex-1">
      {@render children()}
    </main>
    <StoreFooter
      storeName={data.store?.name}
      aboutText={data.store?.footerAboutText}
      socialLinks={data.store?.socialLinks}
      copyrightText={data.store?.copyrightText}
      showPaymentIcons={data.store?.showPaymentIcons ?? true}
    />
  </div>
</ThemeProvider>
<Toaster />