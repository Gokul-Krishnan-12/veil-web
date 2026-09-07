'use client';

import React from 'react';
import Link from 'next/link';
import { useCurrency } from './CurrencyContext';
import CurrencySelector from './CurrencySelector';

export default function PricingClient() {
  const { formatPrice, currencyData, isPpp } = useCurrency();

  const proPrice = formatPrice('pro');
  const proAnchor = formatPrice('pro', true);
  const entPrice = formatPrice('enterprise');
  const entAnchor = formatPrice('enterprise', true);

  return (
    <div className="pricing-page" style={{ maxWidth: '1100px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="pill-badge emerald">100% Lifetime Access • Zero Monthly Subscriptions</div>
        <h1 className="section-title" style={{ fontSize: '42px', marginTop: '12px' }}>
          Invest once. Protect every screen share forever.
        </h1>
        <p className="section-subtitle" style={{ fontSize: '18px', maxWidth: '640px', margin: '12px auto 0' }}>
          All purchases generate cryptographic license keys tracked securely in our encrypted registry. No ongoing phone-home telemetry needed.
        </p>

        {/* Currency Selector Bar */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Display Currency:</span>
          <CurrencySelector />
        </div>
      </div>

      <div className="pricing-grid">
        {/* Solo Plan */}
        <div className="pricing-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div className="pricing-tier-name" style={{ margin: 0 }}>Personal Lifetime</div>
            <span className="pill-badge emerald" style={{ fontSize: '10px', padding: '2px 8px' }}>
              {isPpp ? 'REGIONAL PARITY' : 'SAVE 40% LAUNCH'}
            </span>
          </div>
          <p className="pricing-desc">For individual founders, software engineers, creators, and professionals recording demos.</p>
          
          <div className="pricing-price-box">
            <span style={{ textDecoration: 'line-through', color: 'var(--text-dim)', fontSize: '22px', fontWeight: 600, marginRight: '8px' }}>
              {proAnchor}
            </span>
            <span className="price-amount" style={{ fontSize: '44px', fontWeight: 800, color: '#ffffff' }}>
              {proPrice}
            </span>
            <span className="price-period" style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              one-time / lifetime
            </span>
          </div>

          <ul className="pricing-features-list">
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> <strong>Up to 3 browser seat activations</strong></li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Unlimited element & text blurring</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Automated PII masking (Cards, Emails, Keys)</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> WebRTC screen share auto-detection</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Regional drag-to-blur boxes</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Persistent across reloads & SPAs</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Revoke & Reissue self-service</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Free lifetime updates</li>
          </ul>

          <Link href="/checkout?tier=pro" className="btn btn-secondary" style={{ width: '100%' }}>
            Unlock Personal Lifetime (3 Browsers — {proPrice})
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="pricing-card featured">
          <div className="pricing-popular-badge">BEST VALUE FOR TEAMS</div>
          <div className="pricing-tier-name">Enterprise Lifetime</div>
          <p className="pricing-desc">For sales engineering teams, customer support hubs, and organizations protecting customer data.</p>
          
          <div className="pricing-price-box">
            <span style={{ textDecoration: 'line-through', color: 'var(--text-dim)', fontSize: '22px', fontWeight: 600, marginRight: '8px' }}>
              {entAnchor}
            </span>
            <span className="price-amount" style={{ fontSize: '44px', fontWeight: 800, color: '#ffffff' }}>
              {entPrice}
            </span>
            <span className="price-period" style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              one-time / lifetime
            </span>
          </div>

          <ul className="pricing-features-list">
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> <strong>Up to 30 users / browser seats</strong> with one key</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Centralized team seat management</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> 1-Click Revoke & Reissue API support</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Automated PII & screen share protection</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Tab privacy disguise engine</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Dedicated priority email support</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> GDPR, HIPAA & SOC2 compliance ready</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Multi-browser team deployment support</li>
          </ul>

          <Link href="/checkout?tier=enterprise" className="btn btn-primary" style={{ width: '100%' }}>
            Unlock Enterprise (30 Seats — {entPrice})
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ marginTop: '80px', maxWidth: '800px', margin: '80px auto 0' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, textAlign: 'center', marginBottom: '32px' }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="feature-card">
            <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>How do I activate my extension after purchasing?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Immediately upon checkout, your cryptographic license key is generated securely and displayed on screen. Open your Veil Chrome extension, paste the key into the popup, and click Activate.
            </p>
          </div>

          <div className="feature-card">
            <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>Does the extension constantly make requests to the server?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              No! Once claimed and validated, the extension saves your activated license in local Chrome storage. It operates 100% offline and locally without periodic heartbeat calls.
            </p>
          </div>

          <div className="feature-card">
            <h4 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>What happens if I get a new computer?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Use our built-in Revoke & Reissue tool in your extension options or web portal. Entering your registered billing email instantly rotates the key and transfers activation to your new machine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
