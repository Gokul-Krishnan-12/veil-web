'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { useCurrency } from '@/components/CurrencyContext';
import CurrencySelector from '@/components/CurrencySelector';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const initialTier = searchParams.get('tier') === 'enterprise' ? 'enterprise' : 'pro';

  const { formatPrice, isPpp } = useCurrency();
  const [tier, setTier] = useState(initialTier);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [lsLoading, setLsLoading] = useState(false);
  const [verifyingOrder, setVerifyingOrder] = useState(false);
  const [error, setError] = useState('');
  const [purchasedKey, setPurchasedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  // Initialize Lemon.js event listener for overlay checkout completion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.createLemonSqueezy?.();
      window.LemonSqueezy?.Setup({
        eventHandler: (event) => {
          if (event?.event === 'Checkout.Success') {
            const orderId = event?.data?.order?.id || event?.data?.id;
            if (orderId) {
              setVerifyingOrder(true);
              fetch(`/api/checkout/order-status?order_id=${orderId}&tier=${tier}&email=${encodeURIComponent(email)}`)
                .then(r => r.json())
                .then(data => {
                  if (data?.success) setPurchasedKey(data);
                })
                .catch(console.error)
                .finally(() => setVerifyingOrder(false));
            }
          }
        }
      });
    }
  }, [tier, email]);

  // Update tier if query parameter changes
  useEffect(() => {
    const qTier = searchParams.get('tier');
    if (qTier === 'enterprise') setTier('enterprise');
    else if (qTier === 'pro') setTier('pro');
  }, [searchParams]);

  // Check for return from Lemon Squeezy checkout: ?order_id=...&status=success
  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const status = searchParams.get('status');
    const returnEmail = searchParams.get('email');
    const returnTier = searchParams.get('tier');
    const returnName = searchParams.get('name');
    const simulated = searchParams.get('simulated');

    if (orderId && status === 'success') {
      setVerifyingOrder(true);
      setError('');

      const fetchOrderStatus = async () => {
        try {
          const query = new URLSearchParams({
            order_id: orderId,
            ...(returnTier ? { tier: returnTier } : {}),
            ...(returnEmail ? { email: returnEmail } : {}),
            ...(returnName ? { name: returnName } : {}),
            ...(simulated ? { simulated: 'true' } : {})
          });

          const res = await fetch(`/api/checkout/order-status?${query.toString()}`);
          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.error || data.message || 'Unable to confirm order status.');
          }

          setPurchasedKey(data);
        } catch (err) {
          setError(err.message || 'Failed to verify payment status. If payment went through, your key will be emailed to you.');
        } finally {
          setVerifyingOrder(false);
        }
      };

      fetchOrderStatus();
    }
  }, [searchParams]);

  const seats = tier === 'enterprise' ? 30 : 3;
  const currentFormattedPrice = formatPrice(tier);

  // Handle Lemon Squeezy Checkout
  const handleLemonSqueezyCheckout = async (e) => {
    if (e) e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address where your lifetime license key will be dispatched.');
      return;
    }

    setLsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout/lemonsqueezy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          customerEmail: email,
          customerName: name || email.split('@')[0]
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.checkoutUrl) {
        throw new Error(data.error || 'Failed to initiate Lemon Squeezy checkout.');
      }

      // Check if Lemon.js overlay modal is available
      if (typeof window !== 'undefined' && window.LemonSqueezy?.Url?.Open) {
        window.LemonSqueezy.Url.Open(data.checkoutUrl);
        setLsLoading(false);
      } else {
        // Fallback to hosted redirect
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err.message || 'An error occurred while launching Lemon Squeezy checkout.');
      setLsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (purchasedKey?.key) {
      navigator.clipboard.writeText(purchasedKey.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={{ maxWidth: '980px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="pill-badge emerald">🔒 Bank-Grade 256-Bit SSL Checkout</div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginTop: '12px' }}>
          {purchasedKey ? 'Order Complete! Your License is Ready' : 'Complete Your Veil Lifetime Purchase'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '6px' }}>
          {purchasedKey
            ? 'Your lifetime license key has been minted in our secure registry. Activate it below.'
            : 'One-time payment only. Zero monthly fees. Instant cryptographic key generation.'}
        </p>
      </div>

      {verifyingOrder ? (
        /* Verifying Order State */
        <div className="feature-card" style={{ maxWidth: '580px', margin: '40px auto', padding: '48px 32px', textAlign: 'center', border: '1px solid var(--card-border-glow)' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>⏳</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px', color: '#ffffff' }}>
            Confirming Payment with Lemon Squeezy...
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            Settling your one-time payment and minting your cryptographic lifetime license key into the registry.
          </p>
          <div style={{ marginTop: '24px', display: 'inline-block', width: '36px', height: '36px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--accent-violet)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : purchasedKey ? (
        /* Success Screen */
        <div className="feature-card" style={{ maxWidth: '640px', margin: '0 auto', padding: '40px', textAlign: 'center', border: '1px solid var(--card-border-glow)' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#34d399', marginBottom: '8px' }}>
            Payment Successful!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            We've minted your lifetime license key for <strong>{purchasedKey.customerEmail}</strong> with <strong>0 monthly fees</strong>.
          </p>

          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px dashed var(--accent-violet)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Your {purchasedKey.tier.toUpperCase()} Lifetime License ({purchasedKey.maxSeats} Seat{purchasedKey.maxSeats > 1 ? 's' : ''})
            </span>
            <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#ffffff', letterSpacing: '1.5px', margin: '10px 0' }}>
              {purchasedKey.key}
            </div>
            <button onClick={copyToClipboard} className="btn btn-primary btn-sm" style={{ marginTop: '6px' }}>
              {copied ? '✓ Copied to Clipboard!' : '📋 Copy License Key'}
            </button>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', padding: '16px', textAlign: 'left', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '6px' }}>How to activate in your Chrome Extension:</h4>
            <ol style={{ paddingLeft: '18px', lineHeight: 1.8 }}>
              <li>Open your <strong>Veil Chrome Extension</strong> popup in the browser toolbar.</li>
              <li>Paste your key <code>{purchasedKey.key}</code> into the license key input field.</li>
              <li>Click <strong>Activate License</strong>. Your lifetime features unlock immediately!</li>
            </ol>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/demo" className="btn btn-primary">
              ⚡ Try in Live Sandbox
            </Link>
            <Link href="/docs" className="btn btn-secondary">
              📖 Extension Setup Guide
            </Link>
          </div>
        </div>
      ) : (
        /* Checkout Form */
        <div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '12px 18px',
            marginBottom: '24px',
            fontSize: '13px',
            color: '#6ee7b7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎉</span>
              <span><strong>100% One-Time Lifetime Access:</strong> Pay once, own forever with <strong>0 monthly subscriptions</strong>.</span>
            </div>
            <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
              0 RECURRING CHARGES
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Currency:</span>
              <CurrencySelector compact />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {/* Plan Selector & Details */}
            <div className="form-panel" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>1. Select Your License Tier</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <button
                  type="button"
                  onClick={() => setTier('pro')}
                  style={{
                    background: tier === 'pro' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: tier === 'pro' ? '2px solid var(--accent-violet)' : '1px solid var(--card-border)',
                    borderRadius: '10px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'inherit'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>PERSONAL PRO</div>
                    <span className="pill-badge emerald" style={{ fontSize: '9px', padding: '1px 5px' }}>
                      {isPpp ? 'PARITY' : 'LIFETIME'}
                    </span>
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: '6px 0', display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', textDecoration: 'line-through', color: 'var(--text-dim)', fontWeight: 600 }}>
                      {formatPrice('pro', true)}
                    </span>
                    <span>{formatPrice('pro')}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--accent-emerald)' }}>3 Browser Seats</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTier('enterprise')}
                  style={{
                    background: tier === 'enterprise' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: tier === 'enterprise' ? '2px solid var(--accent-violet)' : '1px solid var(--card-border)',
                    borderRadius: '10px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'inherit'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>ENTERPRISE</div>
                    <span className="pill-badge emerald" style={{ fontSize: '9px', padding: '1px 5px' }}>
                      {isPpp ? 'PARITY' : 'LIFETIME'}
                    </span>
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', margin: '6px 0', display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', textDecoration: 'line-through', color: 'var(--text-dim)', fontWeight: 600 }}>
                      {formatPrice('enterprise', true)}
                    </span>
                    <span>{formatPrice('enterprise')}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--accent-cyan)' }}>30 Team Seats</div>
                </button>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', padding: '16px', border: '1px solid var(--card-border)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: '#ffffff' }}>What is included:</h4>
                <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 2 }}>
                  <li>✓ Cryptographically signed lifetime key</li>
                  <li>✓ Bound to {seats} seat{seats > 1 ? 's' : ''} in encrypted registry</li>
                  <li>✓ Zero monthly fees or recurring subscription renewals</li>
                  <li>✓ Global tax / VAT handled automatically via Merchant of Record</li>
                  <li>✓ Free updates forever</li>
                </ul>
              </div>
            </div>

            {/* Payment Form (Lemon Squeezy) */}
            <div className="form-panel" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>2. Customer & Payment Details</h3>
                <span className="pill-badge emerald" style={{ fontSize: '10px', padding: '3px 8px' }}>
                  🔒 256-Bit SSL
                </span>
              </div>

              <div style={{
                background: 'rgba(250, 204, 21, 0.08)',
                border: '1px solid rgba(250, 204, 21, 0.25)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#fef08a',
                marginBottom: '20px',
                lineHeight: 1.5
              }}>
                <span>🍋 <strong>Secure Checkout by Lemon Squeezy:</strong> Global Merchant of Record handling sales tax, cards, PayPal, and Apple Pay. Instant lifetime license delivery.</span>
              </div>

              <form onSubmit={handleLemonSqueezyCheckout}>
                <div style={{ marginBottom: '16px' }}>
                  <label className="input-label" htmlFor="ls-customer-email">Email Address (Key dispatched here)</label>
                  <input
                    type="email"
                    id="ls-customer-email"
                    className="input-field"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="input-label" htmlFor="ls-customer-name">Full Name / Organization</label>
                  <input
                    type="text"
                    id="ls-customer-name"
                    className="input-field"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {error && (
                  <div style={{ color: 'var(--accent-rose)', fontSize: '13px', marginBottom: '16px' }}>
                    ⚠️ {error}
                  </div>
                )}

                <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Total due today:</div>
                    <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 600 }}>One-time payment • Lifetime access</div>
                  </div>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>{currentFormattedPrice}</span>
                </div>

                <button
                  type="submit"
                  disabled={lsLoading}
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '15px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                    color: '#18181b',
                    border: 'none',
                    cursor: lsLoading ? 'not-allowed' : 'pointer',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {lsLoading ? 'Launching Lemon Squeezy...' : `🍋 Pay ${currentFormattedPrice} with Lemon Squeezy`}
                </button>

                <p style={{ textAlign: 'center', fontSize: '11.5px', color: 'var(--text-dim)', marginTop: '12px', marginBottom: 0 }}>
                  Zero monthly subscriptions. 100% money-back guarantee.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
      <Script
        src="https://assets.lemonsqueezy.com/lemon.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.createLemonSqueezy) {
            window.createLemonSqueezy();
          }
        }}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
