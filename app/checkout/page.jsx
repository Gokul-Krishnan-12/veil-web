'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const initialTier = searchParams.get('tier') === 'enterprise' ? 'enterprise' : 'pro';

  const [tier, setTier] = useState(initialTier);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [purchasedKey, setPurchasedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const qTier = searchParams.get('tier');
    if (qTier === 'enterprise') setTier('enterprise');
    else if (qTier === 'pro') setTier('pro');
  }, [searchParams]);

  const price = tier === 'enterprise' ? 199 : 29;
  const seats = tier === 'enterprise' ? 20 : 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address to receive your license key.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          customerEmail: email,
          customerName: name || email.split('@')[0]
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process purchase.');
      }

      setPurchasedKey(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during checkout.');
    } finally {
      setLoading(false);
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
            ? 'Your license key has been minted in the Supabase registry. Activate it in your extension below.'
            : 'One-time payment. Instant cryptographic key generation stored in Supabase.'}
        </p>
      </div>

      {purchasedKey ? (
        /* Success Screen */
        <div className="feature-card" style={{ maxWidth: '640px', margin: '0 auto', padding: '40px', textAlign: 'center', border: '1px solid var(--card-border-glow)' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#34d399', marginBottom: '8px' }}>
            Payment Successful!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            We've generated your lifetime license key for <strong>{purchasedKey.customerEmail}</strong>.
          </p>

          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px dashed var(--accent-violet)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Your {purchasedKey.tier.toUpperCase()} License Key ({purchasedKey.maxSeats} Seat{purchasedKey.maxSeats > 1 ? 's' : ''})
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
              <li>Click <strong>Activate License</strong>. Your Pro features unlock immediately!</li>
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
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>SOLO PRO</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>$29</div>
                <div style={{ fontSize: '12px', color: 'var(--accent-emerald)' }}>1 Browser Seat</div>
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
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>ENTERPRISE</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>$199</div>
                <div style={{ fontSize: '12px', color: 'var(--accent-cyan)' }}>20 Team Seats</div>
              </button>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', padding: '16px', border: '1px solid var(--card-border)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: '#ffffff' }}>What is included:</h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 2 }}>
                <li>✓ Cryptographically signed lifetime key</li>
                <li>✓ Bound to {seats} seat{seats > 1 ? 's' : ''} in Supabase Cloud registry</li>
                <li>✓ Automated PII & screen share detection</li>
                <li>✓ Free updates forever with zero ongoing subscriptions</li>
              </ul>
            </div>
          </div>

          {/* Payment Details Form */}
          <div className="form-panel" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>2. Customer & Payment Details</h3>

            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px dashed rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#34d399', marginBottom: '20px' }}>
              <span>🧪 <strong>Instant Demo Payment</strong> (Pre-filled test card ready)</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label className="input-label" htmlFor="customer-email">Email Address (Key dispatched here)</label>
                <input
                  type="email"
                  id="customer-email"
                  className="input-field"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="input-label" htmlFor="customer-name">Full Name / Organization</label>
                <input
                  type="text"
                  id="customer-name"
                  className="input-field"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="input-label">Card Number (Simulated)</label>
                <input
                  type="text"
                  className="input-field"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>

              {error && (
                <div style={{ color: 'var(--accent-rose)', fontSize: '13px', marginBottom: '16px' }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Total due today:</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>${price}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '15px' }}
              >
                {loading ? 'Generating Key in Supabase...' : `Pay $${price} & Receive Lifetime Key`}
              </button>
            </form>
          </div>
        </div>
      )}
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
