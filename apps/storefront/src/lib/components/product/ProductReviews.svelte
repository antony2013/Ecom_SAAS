<script lang="ts">
  import { Star } from '@lucide/svelte';
  import ReviewForm from './ReviewForm.svelte';

  interface ReviewItem {
    id: string;
    rating: number;
    title: string | null;
    content: string;
    createdAt: string;
    isVerified: boolean;
    helpfulCount: number;
    response: string | null;
    customer?: { firstName: string | null; lastName: string | null };
  }

  interface Props {
    reviews: ReviewItem[];
    reviewAvg: number;
    reviewTotal: number;
    productId: string;
    isLoggedIn: boolean;
  }

  let { reviews, reviewAvg, reviewTotal, productId, isLoggedIn }: Props = $props();
  let showForm = $state(false);
</script>

<div>
  <div class="flex items-center justify-between mb-8">
    <div>
      <h2 class="text-2xl font-bold text-[var(--color-text)]">Reviews</h2>
      <div class="flex items-center gap-2 mt-1">
        <div class="flex items-center gap-0.5">
          {#each [1, 2, 3, 4, 5] as star}
            <Star
              class="size-5 {star <= Math.round(reviewAvg)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-[var(--color-border)]'}"
            />
          {/each}
        </div>
        <span class="text-sm text-[var(--color-text-secondary)]">
          {reviewAvg.toFixed(1)} out of 5 ({reviewTotal} reviews)
        </span>
      </div>
    </div>
    {#if isLoggedIn}
      <button
        class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] text-sm font-medium hover:opacity-90 transition-opacity"
        onclick={() => (showForm = !showForm)}
      >
        Write a Review
      </button>
    {/if}
  </div>

  {#if showForm}
    <div class="mb-8">
      <ReviewForm productId={productId} onSuccess={() => (showForm = false)} />
    </div>
  {/if}

  {#if reviews.length === 0}
    <p class="text-[var(--color-text-secondary)] text-center py-8">
      No reviews yet. Be the first to review!
    </p>
  {:else}
    <div class="space-y-6">
      {#each reviews as review}
        <article class="border-b border-[var(--color-border)] pb-6 last:border-0">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-0.5">
                {#each [1, 2, 3, 4, 5] as star}
                  <Star
                    class="size-4 {star <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-[var(--color-border)]'}"
                  />
                {/each}
              </div>
              {#if review.isVerified}
                <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
              {/if}
            </div>
            <span class="text-sm text-[var(--color-text-secondary)]">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          {#if review.title}
            <h3 class="font-semibold text-[var(--color-text)] mb-1">{review.title}</h3>
          {/if}
          <p class="text-[var(--color-text-secondary)] text-sm">{review.content}</p>
          <div class="mt-2 text-xs text-[var(--color-text-secondary)]">
            By {review.customer?.firstName ?? 'Anonymous'} {review.customer?.lastName ?? ''}
          </div>
          {#if review.response}
            <div class="mt-3 bg-[var(--color-surface)] border-l-2 border-[var(--color-primary)] px-4 py-2 rounded-r-[var(--radius-md)]">
              <p class="text-xs font-medium text-[var(--color-primary)] mb-1">Merchant Response</p>
              <p class="text-sm text-[var(--color-text-secondary)]">{review.response}</p>
            </div>
          {/if}
        </article>
      {/each}
    </div>
  {/if}
</div>