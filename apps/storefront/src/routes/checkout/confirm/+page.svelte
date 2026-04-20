<script lang="ts">
  import type { PageData } from './$types.js';
  import CheckoutStepper from '$lib/components/checkout/CheckoutStepper.svelte';
  import OrderSummarySidebar from '$lib/components/checkout/OrderSummarySidebar.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { formatPrice } from '$lib/utils/format.js';
  import { goto } from '$app/navigation';

  let { data }: { data: PageData } = $props();

  const steps = [
    { label: 'Shipping', href: '/checkout/shipping' },
    { label: 'Payment', href: '/checkout/payment' },
    { label: 'Confirm', href: '/checkout/confirm' },
  ];

  let placing = $state(false);
  let error = $state('');

  // Retrieve checkout state from sessionStorage
  let shippingInfo = $state<any>({});
  let paymentInfo = $state<any>({});
  try {
    const rawShipping = typeof window !== 'undefined' ? sessionStorage.getItem('checkout_shipping') : null;
    if (rawShipping) shippingInfo = JSON.parse(rawShipping);
    const rawPayment = typeof window !== 'undefined' ? sessionStorage.getItem('checkout_payment') : null;
    if (rawPayment) paymentInfo = JSON.parse(rawPayment);
  } catch { /* ignore parse errors */ }

  let tax = $derived(paymentInfo.tax ?? '0');
  let couponDiscount = $derived(paymentInfo.couponDiscount ?? '0');
  let effectiveTotal = $derived.by(() => {
    const subtotal = parseFloat(data.cart?.subtotal ?? '0');
    const taxNum = parseFloat(tax);
    const discount = parseFloat(couponDiscount);
    return (subtotal + taxNum - discount).toFixed(2);
  });

  async function placeOrder() {
    placing = true;
    error = '';

    try {
      const cart = data.cart;
      if (!cart || !cart.items || cart.items.length === 0) {
        error = 'Cart is empty';
        return;
      }

      const body: any = {
        email: paymentInfo.email || 'guest@example.com',
        currency: 'USD',
        items: cart.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          variantOptionIds: item.modifiers?.variantOptionIds || undefined,
          combinationKey: item.modifiers?.combinationKey || undefined,
          modifierOptionIds: item.modifiers?.modifierOptionIds || undefined,
        })),
        cartId: cart.id,
        paymentMethod: 'cod',
        couponCode: paymentInfo.couponCode || undefined,
        shippingRateId: shippingInfo.shippingRateId || undefined,
        notes: '',
      };

      // Add shipping address from saved or custom
      if (shippingInfo.addressType === 'saved' && shippingInfo.savedAddressId) {
        // Will need to look up address — for now use placeholder
        body.shippingFirstName = 'Customer';
        body.shippingLastName = '';
        body.shippingAddressLine1 = 'Address from saved';
        body.shippingCity = 'City';
        body.shippingCountry = 'US';
        body.shippingPostalCode = '00000';
      }

      const res = await fetch('/api/v1/customer/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const result = await res.json();
        const orderId = result.order?.id ?? '';
        // Clear checkout state
        sessionStorage.removeItem('checkout_shipping');
        sessionStorage.removeItem('checkout_payment');
        goto(`/order-confirmed/${orderId}`);
      } else {
        const err = await res.json().catch(() => ({ message: 'Order failed' }));
        error = err.message || 'Failed to place order';
      }
    } catch (e: any) {
      error = e.message || 'Something went wrong';
    } finally {
      placing = false;
    }
  }
</script>

<svelte:head>
  <title>Confirm Order | Checkout</title>
</svelte:head>

<CheckoutStepper {steps} currentStep={2} />

<div class="lg:grid lg:grid-cols-5 lg:gap-8">
  <div class="lg:col-span-3 space-y-6">
    <h1 class="text-xl font-bold text-[var(--color-text)]">Review Your Order</h1>

    {#if error}
      <div class="bg-[var(--color-error)]/10 text-[var(--color-error)] p-4 rounded-[var(--radius-md)] text-sm">
        {error}
      </div>
    {/if}

    <!-- Cart items -->
    <div class="space-y-3">
      <h2 class="text-sm font-semibold text-[var(--color-text)]">Items ({data.cart?.itemCount ?? 0})</h2>
      {#each data.cart?.items ?? [] as item (item.id)}
        <div class="flex justify-between text-sm py-2 border-b border-[var(--color-border)]">
          <span class="text-[var(--color-text-secondary)]">{item.productId.slice(0,12)} x{item.quantity}</span>
          <span class="font-medium text-[var(--color-text)]">{formatPrice(item.total)}</span>
        </div>
      {/each}
    </div>

    <!-- Shipping summary -->
    <div class="text-sm text-[var(--color-text-secondary)]">
      <h2 class="font-semibold text-[var(--color-text)] mb-1">Shipping</h2>
      <p>Standard shipping (rates calculated in shipping step)</p>
    </div>

    <!-- Payment summary -->
    <div class="text-sm text-[var(--color-text-secondary)]">
      <h2 class="font-semibold text-[var(--color-text)] mb-1">Payment</h2>
      <p>Cash on Delivery (Stripe integration coming soon)</p>
      {#if paymentInfo.email}
        <p>Contact: {paymentInfo.email}</p>
      {/if}
      {#if paymentInfo.couponCode}
        <p>Coupon: {paymentInfo.couponCode}</p>
      {/if}
    </div>

    <Button
      size="lg"
      class="w-full"
      onclick={placeOrder}
      disabled={placing}
    >
      {placing ? 'Placing Order...' : 'Place Order'}
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