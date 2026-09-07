import Link from 'next/link';

export const metadata = {
  title: 'Pricing — Veil Lifetime Screen Privacy',
  description: 'One-time payment for lifetime screen privacy. Choose between Personal (1 browser) or Enterprise (20 browser seats).',
};

export default function PricingPage() {
  return (
    <div className="pricing-page" style={{ maxWidth: '1100px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div className="pill-badge emerald">100% Lifetime Access • Zero Monthly Subscriptions</div>
        <h1 className="section-title" style={{ fontSize: '42px', marginTop: '12px' }}>
          Invest once. Protect every screen share forever.
        </h1>
        <p className="section-subtitle" style={{ fontSize: '18px', maxWidth: '640px', margin: '12px auto 0' }}>
          All purchases generate cryptographic license keys tracked directly in our Supabase Cloud registry. No ongoing phone-home telemetry needed.
        </p>
      </div>

      <div className="pricing-grid">
        {/* Solo Plan */}
        <div className="pricing-card">
          <div className="pricing-tier-name">Personal Lifetime</div>
          <p className="pricing-desc">For individual founders, software engineers, creators, and professionals recording demos.</p>
          
          <div className="pricing-price-box">
            <span className="price-currency">$</span>
            <span className="price-amount">29</span>
            <span className="price-period">one-time / lifetime</span>
          </div>

          <ul className="pricing-features-list">
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Single user (1 browser seat binding)</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Unlimited element & text blurring</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Automated PII masking (Cards, Emails, Keys)</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> WebRTC screen share auto-detection</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Regional drag-to-blur boxes</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Persistent across reloads & SPAs</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Revoke & Reissue self-service</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Free lifetime updates</li>
          </ul>

          <Link href="/checkout?tier=pro" className="btn btn-secondary" style={{ width: '100%' }}>
            Unlock Personal Lifetime ($29)
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="pricing-card featured">
          <div className="pricing-popular-badge">BEST VALUE FOR TEAMS</div>
          <div className="pricing-tier-name">Enterprise Lifetime</div>
          <p className="pricing-desc">For sales engineering teams, customer support hubs, and organizations protecting customer data.</p>
          
          <div className="pricing-price-box">
            <span className="price-currency">$</span>
            <span className="price-amount">199</span>
            <span className="price-period">one-time / lifetime</span>
          </div>

          <ul className="pricing-features-list">
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> <strong>Up to 20 users / browser seats</strong> with one key</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Centralized team seat management in Supabase</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> 1-Click Revoke & Reissue API support</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Automated PII & screen share protection</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Tab privacy disguise engine</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Dedicated priority email support</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> GDPR, HIPAA & SOC2 compliance ready</li>
            <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Multi-browser team deployment support</li>
          </ul>

          <Link href="/checkout?tier=enterprise" className="btn btn-primary" style={{ width: '100%' }}>
            Unlock Enterprise (20 Seats — $199)
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
              Immediately upon checkout, your cryptographic license key is generated in our Supabase database and displayed on screen. Open your Veil Chrome extension, paste the key into the popup, and click Activate.
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
              You can use our self-service Revoke & Reissue endpoint or Admin Portal to revoke the previous binding and immediately generate a fresh replacement key.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
