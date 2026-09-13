'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCurrency } from '@/components/CurrencyContext';
import CurrencySelector from '@/components/CurrencySelector';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const initialTier = searchParams.get('tier') === 'enterprise' ? 'enterprise' : 'pro';

  const { formatPrice, isPpp } = useCurrency();
  const [tier, setTier] = useState(initialTier);
  const [verifyingOrder, setVerifyingOrder] = useState(false);
  const [error, setError] = useState('');
  const [purchasedKey, setPurchasedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  // Update tier if query parameter changes
  useEffect(() => {
    const qTier = searchParams.get('tier');
    if (qTier === 'enterprise') setTier('enterprise');
    else if (qTier === 'pro') setTier('pro');
  }, [searchParams]);

  // Check for return from direct checkout: ?order_id=...&status=success
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

  const copyToClipboard = () => {
    if (purchasedKey?.key) {
      navigator.clipboard.writeText(purchasedKey.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={{ maxWidth: '1040px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="pill-badge emerald">🔒 100% Lifetime Privacy Access</div>
        <h1 style={{ fontSize: '38px', fontWeight: 800, marginTop: '12px', letterSpacing: '-0.5px' }}>
          {purchasedKey ? 'Order Complete! Your License is Ready' : 'Veil Lifetime License Pricing'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '8px', maxWidth: '620px', margin: '8px auto 0' }}>
          {purchasedKey
            ? 'Your lifetime license key has been minted in our secure registry. Activate it below.'
            : 'One-time payment only. Zero monthly subscriptions. Free updates forever.'}
        </p>
      </div>

      {verifyingOrder ? (
        /* Verifying Order State */
        <div className="feature-card" style={{ maxWidth: '580px', margin: '40px auto', padding: '48px 32px', textAlign: 'center', border: '1px solid var(--card-border-glow)' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>⏳</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px', color: '#ffffff' }}>
            Confirming Order Status...
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
        /* Pricing & Plans View */
        <div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '14px 20px',
            marginBottom: '28px',
            fontSize: '13.5px',
            color: '#6ee7b7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>🎉</span>
              <span><strong>100% One-Time Lifetime Access:</strong> Pay once, own forever with <strong>0 monthly subscriptions</strong>.</span>
            </div>
            <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
              0 RECURRING CHARGES
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Display Currency:</span>
            <CurrencySelector compact />
          </div>

          {/* Pricing Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {/* Personal Pro Card */}
            <div
              onClick={() => setTier('pro')}
              style={{
                background: tier === 'pro' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                border: tier === 'pro' ? '2px solid var(--accent-violet)' : '1px solid var(--card-border)',
                borderRadius: '16px',
                padding: '28px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {tier === 'pro' && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '20px',
                  background: 'var(--accent-violet)',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 10px',
                  borderRadius: '999px',
                  letterSpacing: '0.5px'
                }}>
                  SELECTED
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0 }}>Personal Lifetime</h3>
                <span className="pill-badge emerald" style={{ fontSize: '10px', padding: '2px 8px' }}>
                  {isPpp ? 'PARITY' : 'LIFETIME'}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px', minHeight: '36px' }}>
                For individual engineers, founders, and professionals recording demos and client calls.
              </p>

              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ textDecoration: 'line-through', color: 'var(--text-dim)', fontSize: '16px', fontWeight: 600 }}>
                  {formatPrice('pro', true)}
                </span>
                <span style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff' }}>
                  {formatPrice('pro')}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>one-time</span>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, display: 'inline-block', marginBottom: '20px' }}>
                ✓ 3 Browser Seat Activations
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 2 }}>
                <li>✓ Unlimited element & text blurring</li>
                <li>✓ Automated PII masking (Cards, Emails, API Keys)</li>
                <li>✓ Live WebRTC screen share auto-detection</li>
                <li>✓ Regional drag-to-blur boxes</li>
                <li>✓ SPA persistent domain blur rules</li>
                <li>✓ Cryptographically signed lifetime key</li>
                <li>✓ Free updates forever</li>
              </ul>
            </div>

            {/* Enterprise Card */}
            <div
              onClick={() => setTier('enterprise')}
              style={{
                background: tier === 'enterprise' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                border: tier === 'enterprise' ? '2px solid var(--accent-violet)' : '1px solid var(--card-border)',
                borderRadius: '16px',
                padding: '28px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {tier === 'enterprise' && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '20px',
                  background: 'var(--accent-violet)',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 10px',
                  borderRadius: '999px',
                  letterSpacing: '0.5px'
                }}>
                  SELECTED
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0 }}>Enterprise Lifetime</h3>
                <span className="pill-badge emerald" style={{ fontSize: '10px', padding: '2px 8px' }}>
                  BEST FOR TEAMS
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px', minHeight: '36px' }}>
                For sales engineering teams, customer support hubs, and companies protecting sensitive client data.
              </p>

              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ textDecoration: 'line-through', color: 'var(--text-dim)', fontSize: '16px', fontWeight: 600 }}>
                  {formatPrice('enterprise', true)}
                </span>
                <span style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff' }}>
                  {formatPrice('enterprise')}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>one-time</span>
              </div>

              <div style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-cyan)', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, display: 'inline-block', marginBottom: '20px' }}>
                ✓ 30 Team Browser Seats
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 2 }}>
                <li>✓ Up to 30 team seats with a single key</li>
                <li>✓ Centralized team seat management</li>
                <li>✓ 1-Click Revoke & Reissue API support</li>
                <li>✓ Tab privacy disguise engine</li>
                <li>✓ Dedicated priority support</li>
                <li>✓ GDPR, HIPAA & SOC2 compliance ready</li>
                <li>✓ Free lifetime updates</li>
              </ul>
            </div>
          </div>

          {/* Selected Plan Summary & Order Action */}
          <div className="feature-card" style={{ padding: '32px', border: '1px solid var(--card-border-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--card-border)', paddingBottom: '20px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>
                  Selected Plan
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                  {tier === 'enterprise' ? 'Enterprise Lifetime License' : 'Personal Pro Lifetime License'}
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '10px' }}>
                    ({seats} Browser Seats)
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total One-Time:</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff' }}>
                  {currentFormattedPrice}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '520px' }}>
                🔒 <strong>Cryptographic License Key:</strong> Grants instant access in the Veil Chrome Extension. No recurring subscription or monthly fees.
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href={`mailto:gokulkrish80@gmail.com?subject=Veil%20${tier === 'enterprise' ? 'Enterprise' : 'Pro'}%20License%20Inquiry&body=Hi%20Veil%20Team,%0A%0AI%20would%20like%20to%20acquire%20a%20Veil%20${tier === 'enterprise' ? 'Enterprise' : 'Personal%20Pro'}%20Lifetime%20License%20(${currentFormattedPrice}).%0A%0APlease%20provide%20payment%20instructions%20and%20invoice%20details.%0A%0AThank%20you!`}
                  className="btn btn-primary"
                  style={{ padding: '12px 24px', fontSize: '14px' }}
                >
                  ✉️ Inquire / Purchase Key ({currentFormattedPrice})
                </a>
                <Link href="/pricing" className="btn btn-secondary" style={{ padding: '12px 20px', fontSize: '14px' }}>
                  Compare All Features
                </Link>
              </div>
            </div>
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
