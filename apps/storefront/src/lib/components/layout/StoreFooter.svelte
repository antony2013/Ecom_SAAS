<script lang="ts">
  interface Props {
    storeName?: string;
    aboutText?: string | null;
    socialLinks?: {
      instagram?: string;
      facebook?: string;
      tiktok?: string;
      whatsapp?: string;
      x?: string;
    };
    copyrightText?: string | null;
    showPaymentIcons?: boolean;
  }

  let {
    storeName = 'Store',
    aboutText,
    socialLinks = {},
    copyrightText,
    showPaymentIcons = true,
  }: Props = $props();

  const year = new Date().getFullYear();
</script>

<footer class="bg-[var(--color-secondary,#370617)] text-[var(--color-surface,#fff8ee)] mt-auto">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- About -->
      <div>
        <h3 class="text-lg font-semibold mb-3">{storeName}</h3>
        {#if aboutText}
          <p class="text-sm opacity-80 leading-relaxed">{aboutText}</p>
        {/if}
      </div>

      <!-- Quick Links -->
      <div>
        <h3 class="text-lg font-semibold mb-3">Quick Links</h3>
        <ul class="space-y-2 text-sm opacity-80">
          <li><a href="/products" class="hover:opacity-100 transition-opacity">Products</a></li>
          <li><a href="/about" class="hover:opacity-100 transition-opacity">About Us</a></li>
          <li><a href="/cart" class="hover:opacity-100 transition-opacity">Cart</a></li>
        </ul>
      </div>

      <!-- Social + Contact -->
      <div>
        <h3 class="text-lg font-semibold mb-3">Connect</h3>
        <div class="flex gap-3">
          {#if socialLinks.instagram}
            <a href={socialLinks.instagram} target="_blank" rel="noopener" class="opacity-80 hover:opacity-100 transition-opacity">Instagram</a>
          {/if}
          {#if socialLinks.facebook}
            <a href={socialLinks.facebook} target="_blank" rel="noopener" class="opacity-80 hover:opacity-100 transition-opacity">Facebook</a>
          {/if}
          {#if socialLinks.x}
            <a href={socialLinks.x} target="_blank" rel="noopener" class="opacity-80 hover:opacity-100 transition-opacity">X</a>
          {/if}
        </div>
      </div>
    </div>

    <div class="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm opacity-60">
        {copyrightText ?? `© ${year} ${storeName}. All rights reserved.`}
      </p>
      {#if showPaymentIcons}
        <div class="flex gap-3 text-sm opacity-60">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>Apple Pay</span>
        </div>
      {/if}
    </div>
  </div>
</footer>