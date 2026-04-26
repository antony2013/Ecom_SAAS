<script lang="ts">
  import { onMount } from 'svelte';
  import { apiFetch } from '$lib/api/client';

  let show = $state(false);
  let analytics = $state(false);
  let marketing = $state(false);

  onMount(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      show = true;
    } else {
      try {
        const parsed = JSON.parse(consent);
        analytics = parsed.analytics ?? false;
        marketing = parsed.marketing ?? false;
      } catch {
        show = true;
      }
    }
  });

  async function acceptAll() {
    analytics = true;
    marketing = true;
    await saveConsent();
    show = false;
  }

  async function acceptSelected() {
    await saveConsent();
    show = false;
  }

  async function rejectAll() {
    analytics = false;
    marketing = false;
    await saveConsent();
    show = false;
  }

  async function saveConsent() {
    const consent = { essential: true, analytics, marketing };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));

    try {
      await apiFetch('/cookie-consent', {
        method: 'POST',
        body: JSON.stringify(consent),
      });
    } catch {
      // Silently fail — localStorage is the source of truth
    }
  }
</script>

{#if show}
  <div
    class="fixed bottom-0 left-0 right-0 z-50 border-t bg-[var(--color-surface)] shadow-lg p-4"
    role="dialog"
    aria-label="Cookie consent"
  >
    <div class="max-w-4xl mx-auto">
      <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div class="flex-1">
          <h3 class="font-semibold text-[var(--color-text)]">Cookie Settings</h3>
          <p class="text-sm text-[var(--color-text-secondary)] mt-1">
            We use cookies to improve your experience. Essential cookies are always enabled.
          </p>
          <div class="flex flex-wrap gap-4 mt-2">
            <label class="flex items-center gap-2 text-sm text-[var(--color-text)]">
              <input type="checkbox" checked disabled class="accent-[var(--color-primary)]">
              Essential
            </label>
            <label class="flex items-center gap-2 text-sm text-[var(--color-text)]">
              <input type="checkbox" bind:checked={analytics} class="accent-[var(--color-primary)]">
              Analytics
            </label>
            <label class="flex items-center gap-2 text-sm text-[var(--color-text)]">
              <input type="checkbox" bind:checked={marketing} class="accent-[var(--color-primary)]">
              Marketing
            </label>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            class="px-4 py-2 text-sm border rounded hover:bg-[var(--color-bg-hover)] text-[var(--color-text)] border-[var(--color-border)]"
            onclick={rejectAll}
          >
            Reject All
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm border rounded hover:bg-[var(--color-bg-hover)] text-[var(--color-text)] border-[var(--color-border)]"
            onclick={acceptSelected}
          >
            Accept Selected
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm rounded bg-[var(--color-primary)] text-[var(--color-primary-contrast)] hover:opacity-90"
            onclick={acceptAll}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
