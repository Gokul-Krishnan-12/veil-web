'use client';

import React from 'react';
import Link from 'next/link';
import { useCurrency } from './CurrencyContext';
import CurrencySelector from './CurrencySelector';

export default function HomePricing() {
  const { formatPrice, isPpp } = useCurrency();

  const proPrice = formatPrice('pro');
  const proAnchor = formatPrice('pro', true);
  const entPrice = formatPrice('enterprise');
  const entAnchor = formatPrice('enterprise', true);

  return (
    <section className="pricing-section" id="pricing">
      <div className="section-header">
        <div className="pill-badge emerald">Simple, Transparent Pricing</div>
        <h2 className="section-title">Pay once. Own lifetime privacy.</h2>
        <p className="section-subtitle">No monthly subscriptions. Free updates forever.</p>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Currency:</span>
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
          <p className="pricing-desc">For individual founders, creators, and professionals recording videos or doing client calls.</p>
          
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
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Live WebRTC screen share auto-detection</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Regional drag-to-blur boxes</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> SPA persistent domain rules</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Free updates forever</li>
          </ul>

          <Link href="/checkout?tier=pro" className="btn btn-secondary" style={{ width: '100%' }}>
            Buy Personal Key (3 Browsers — {proPrice})
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="pricing-card featured">
          <div className="pricing-popular-badge">MOST POPULAR FOR TEAMS</div>
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
          </ul>

          <Link href="/checkout?tier=enterprise" className="btn btn-primary" style={{ width: '100%' }}>
            Buy Enterprise Key ({entPrice} — 30 Seats)
          </Link>
        </div>
      </div>
    </section>
  );
}
