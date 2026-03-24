import Stripe from "stripe";

// Enforce one canonical Stripe mode
// Priority: STRIPE_LIVE_SECRET_KEY (production) > STRIPE_SECRET_KEY (test/dev)
let stripeInstance: Stripe | null = null;
let stripeMode: 'live' | 'test' = 'test';
let keyName: string = '';

function initializeStripe() {
  if (stripeInstance) return stripeInstance;

  const liveKey = process.env.STRIPE_LIVE_SECRET_KEY;
  const testKey = process.env.STRIPE_SECRET_KEY;

  if (liveKey) {
    stripeMode = 'live';
    keyName = 'STRIPE_LIVE_SECRET_KEY';
    stripeInstance = new Stripe(liveKey, {
      apiVersion: '2025-08-27.basil',
    });
  } else if (testKey) {
    stripeMode = 'test';
    keyName = 'STRIPE_SECRET_KEY';
    stripeInstance = new Stripe(testKey, {
      apiVersion: '2025-08-27.basil',
    });
  } else {
    throw new Error("Missing Stripe secret key. Set STRIPE_LIVE_SECRET_KEY (production) or STRIPE_SECRET_KEY (test)");
  }

  // Startup log (no secrets)
  console.log(`[Stripe] Initialized in ${stripeMode} mode using ${keyName}`);
  
  return stripeInstance;
}

export function getStripe() {
  return initializeStripe();
}

// Export mode for logging
export function getStripeMode(): 'live' | 'test' {
  if (!stripeInstance) initializeStripe();
  return stripeMode;
}
