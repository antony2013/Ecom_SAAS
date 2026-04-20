<script lang="ts">
  import type { HeroSlide } from '@repo/shared-types';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { cn } from '$lib/utils';

  interface Props {
    slides: HeroSlide[];
    heroType?: 'static' | 'slideshow';
    sectionConfig?: Record<string, unknown>;
  }

  let { slides = [], heroType = 'static', sectionConfig }: Props = $props();

  let currentSlide = $state(0);
  let isTransitioning = $state(false);

  const slidesCount = $derived(slides?.length ?? 0);

  $effect(() => {
    if (heroType !== 'slideshow' || slidesCount <= 1) return;

    const interval = setInterval(() => {
      isTransitioning = true;
      setTimeout(() => {
        currentSlide = (currentSlide + 1) % slidesCount;
        isTransitioning = false;
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  });

  function goToSlide(index: number) {
    if (index === currentSlide) return;
    isTransitioning = true;
    setTimeout(() => {
      currentSlide = index;
      isTransitioning = false;
    }, 500);
  }

  let activeSlide = $derived(slides?.[currentSlide] ?? slides?.[0] ?? null);

  // Extract prep time from sectionConfig if available
  let prepTime = $derived(
    typeof sectionConfig?.preparationTime === 'number'
      ? sectionConfig.preparationTime
      : null
  );
</script>

{#if activeSlide}
  <section class="relative w-full overflow-hidden rounded-[var(--radius-lg)] mx-4 sm:mx-6 lg:mx-8 my-6" style="min-height: 420px;">
    <!-- Background image -->
    {#each slides as slide, i}
      <div
        class="absolute inset-0 transition-opacity duration-500 ease-in-out"
        class:opacity-100={i === currentSlide && !isTransitioning}
        class:opacity-0={i !== currentSlide || isTransitioning}
      >
        <img
          src={slide.imageUrl}
          alt=""
          class="h-full w-full object-cover"
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      </div>
    {/each}

    <!-- Warm gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-secondary)]/90 via-[var(--color-primary)]/30 to-transparent"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/20 to-transparent"></div>

    <!-- Content -->
    <div
      class={cn(
        'relative z-10 flex flex-col justify-end px-6 py-10 sm:px-10 md:px-14 lg:px-20',
        'max-w-7xl mx-auto w-full',
        'min-h-[420px]'
      )}
    >
      <div
        class="transition-opacity duration-400 ease-in-out max-w-lg"
        class:opacity-0={isTransitioning}
        class:opacity-100={!isTransitioning}
      >
        {#if prepTime}
          <Badge variant="secondary" class="mb-3 bg-[var(--color-accent)]/90 text-[var(--color-bg)] border-none">
            {prepTime} min prep
          </Badge>
        {/if}

        <h1
          class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-bg)] leading-tight mb-3"
          style="font-family: var(--font-family);"
        >
          {activeSlide.title}
        </h1>
        <p class="text-base sm:text-lg text-[var(--color-bg)]/80 mb-6 leading-relaxed">
          {activeSlide.subtitle}
        </p>
        {#if activeSlide.ctaText}
          <Button
            href={activeSlide.ctaLink}
            size="lg"
            class="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-[var(--color-bg)] font-bold px-7 py-3 rounded-full shadow-lg shadow-[var(--color-primary)]/25 transition-transform hover:scale-105"
          >
            {activeSlide.ctaText || 'Order Now'}
          </Button>
        {/if}
      </div>
    </div>

    <!-- Slideshow dots -->
    {#if heroType === 'slideshow' && slidesCount > 1}
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {#each slides as _, i}
          <button
            onclick={() => goToSlide(i)}
            class={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              i === currentSlide
                ? 'bg-[var(--color-accent)] scale-125'
                : 'bg-white/50 hover:bg-white/75'
            )}
            aria-label="Go to slide {i + 1}"
            aria-current={i === currentSlide ? 'true' : undefined}
          ></button>
        {/each}
      </div>
    {/if}
  </section>
{/if}