<script lang="ts">
  import type { PageData } from './$types.js';
  import CheckoutStepper from '$lib/components/checkout/CheckoutStepper.svelte';
  import OrderSummarySidebar from '$lib/components/checkout/OrderSummarySidebar.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { goto } from '$app/navigation';

  let { data }: { data: PageData } = $props();

  const steps = [
    { label: 'Shipping', href: '/checkout/shipping' },
    { label: 'Payment', href: '/checkout/payment' },
    { label: 'Confirm', href: '/checkout/confirm' },
  ];

  let couponCode = $state('');
  let couponError = $state('');
  let couponDiscount = $state('0');
  let tax = $state('0');
  let calculatingTax = $state(false);
  let email = $state('');
  let phone = $state('');

  // Retrieve shipping state
  let shippingState: any = {};
  try {
    const raw = typeof window !== 'undefined' ? sessionStorage.getItem('checkout_shipping') : null;
    if (raw) shippingState = JSON.parse(raw);
  } catch { /* ignore parse errors */ }

  // Calculate tax on mount
  $effect(() => {
    calculateTax();
  });

  async function calculateTax() {
    if (!data.cart) return;
    calculatingTax = true;
    try {
      const shippingInfo = JSON.parse(sessionStorage.getItem('checkout_shipping') ?? '{}');
      // We need country from address — use a simplified approach
      const res = await fetch('/api/v1/public/tax/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          country: 'US',
          subtotal: data.cart.subtotal,
          shipping: '0',
        }),
      });
      if (res.ok) {
        const result = await res.json();
        tax = String(result.totalTax ?? 0);
      }
    } catch {
      // tax calc failed
    } finally {
      calculatingTax = false;
    }
  }

  let effectiveTotal = $derived.by(() => {
    const subtotal = parseFloat(data.cart?.subtotal ?? '0');
    const taxNum = parseFloat(tax);
    const discount = parseFloat(couponDiscount);
    return (subtotal + taxNum - discount).toFixed(2);
  });

  async function applyCoupon() {
    couponError = '';
    try {
      const res = await fetch('/api/v1/merchant/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          code: couponCode,
          orderAmount: data.cart?.subtotal ?? '0',
        }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.valid && result.coupon) {
          // Calculate discount
          const coupon = result.coupon;
          const subtotal = parseFloat(data.cart?.subtotal ?? '0');
          if (coupon.type === 'Percent') {
            couponDiscount = (subtotal * parseFloat(coupon.value) / 100).toFixed(2);
          } else {
            couponDiscount = coupon.value;
          }
        } else {
          couponError = 'Invalid coupon code';
        }
      } else {
        couponError = 'Invalid coupon code';
      }
    } catch {
      couponError = 'Failed to validate coupon';
    }
  }

  function proceedToConfirm() {
    const paymentState = {
      email,
      phone,
      couponCode: couponCode || undefined,
      couponDiscount,
      tax,
    };
    sessionStorage.setItem('checkout_payment', JSON.stringify(paymentState));
    goto('/checkout/confirm');
  }
</script>

<svelte:head>
  <title>Payment | Checkout</title>
</svelte:head>

<CheckoutStepper {steps} currentStep={1} />

<div class="lg:grid lg:grid-cols-5 lg:gap-8">
  <div class="lg:col-span-3 space-y-8">
    <!-- Contact info -->
    <div>
      <h2 class="text-lg font-semibold text-[var(--color-text)] mb-4">Contact Information</h2>
      <div class="space-y-4">
        <div>
          <Label for="email" class="text-sm font-medium">Email</Label>
          <Input id="email" type="email" bind:value={email} required class="mt-1" />
        </div>
        <div>
          <Label for="phone" class="text-sm font-medium">Phone (optional)</Label>
          <Input id="phone" type="tel" bind:value={phone} class="mt-1" />
        </div>
      </div>
    </div>

    <!-- Coupon code -->
    <div>
      <h2 class="text-lg font-semibold text-[var(--color-text)] mb-4">Coupon Code</h2>
      <div class="flex gap-2">
        <Input
          bind:value={couponCode}
          placeholder="Enter coupon code"
          class="flex-1"
          onkeydown={(e) => e.key === 'Enter' && applyCoupon()}
        />
        <Button variant="outline" onclick={applyCoupon} disabled={!couponCode}>Apply</Button>
      </div>
      {#if couponError}
        <p class="text-sm text-[var(--color-error)] mt-1">{couponError}</p>
      {/if}
      {#if parseFloat(couponDiscount) > 0}
        <p class="text-sm text-green-600 mt-1">Discount applied: -${couponDiscount}</p>
      {/if}
    </div>

    <!-- Payment method placeholder -->
    <div>
      <h2 class="text-lg font-semibold text-[var(--color-text)] mb-4">Payment Method</h2>
      <div class="p-6 border border-dashed border-[var(--color-border)] rounded-[var(--radius-md)] text-center text-[var(--color-text-secondary)]">
        <p class="text-sm">Payment integration (Stripe) coming soon</p>
        <p class="text-xs mt-1">Orders will be placed as "Cash on Delivery" for now</p>
      </div>
    </div>

    <Button onclick={proceedToConfirm} size="lg" class="w-full">
      Review Order
    </Button>
  </div>

  <!-- Order summary -->
  <div class="mt-8 lg:mt-0 lg:col-span-2">
    <div class="sticky top-24">
      <OrderSummarySidebar
        items={data.cart?.items ?? []}
        subtotal={data.cart?.subtotal ?? '0'}
        tax={tax}
        discount={couponDiscount}
        total={effectiveTotal}
      />
    </div>
  </div>
</div>