import Link from 'next/link';

export const metadata = {
  title: 'Veil — Blur Anything on the Web in Real Time',
  description: 'Instantly blur customer PII, credit cards, passwords, and financials during screen sharing on Google Meet, Zoom, or Loom recordings.',
};

export default function HomePage() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        <div style={{ marginBottom: '24px', display: 'inline-block', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: '-20px',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.45), transparent 70%)',
              filter: 'blur(24px)',
              borderRadius: '50%',
            }}
          />
          <img
            src="/assets/logo.png"
            alt="Veil Logo"
            style={{
              position: 'relative',
              width: '104px',
              height: '104px',
              borderRadius: '26px',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.12)',
            }}
          />
        </div>

        <div>
          <div className="pill-badge emerald">
            <span>🛡️</span> Zero Post-Editing Screen Privacy
          </div>
        </div>

        <h1 className="hero-title">Blur anything on Web.</h1>
        <p className="hero-subtitle">
          Instantly blur sensitive customer data, passwords, cards, and financials while screen sharing on Google Meet, Zoom, or recording with Loom. No post-production video editing required.
        </p>

        <div className="hero-cta-group">
          <Link href="/pricing" className="btn btn-primary btn-lg">
            <span>⭐</span> Get Lifetime License
          </Link>
          <Link href="/demo" className="btn btn-secondary btn-lg">
            <span>⚡</span> Try Live Sandbox (No Install)
          </Link>
        </div>

        <div className="browser-compat-row">
          <span>Supported on:</span>
          <span className="browser-tag">🌐 Google Chrome</span>
          <span className="browser-tag">🦊 Mozilla Firefox</span>
          <span className="browser-tag">🌀 Microsoft Edge</span>
          <span className="browser-tag">🦁 Brave & Arc</span>
        </div>
      </header>

      {/* Marquee Track */}
      <div className="marquee-container">
        <div className="marquee-track">
          <div className="marquee-chip"><span>📧</span> mail.google.com</div>
          <div className="marquee-chip"><span>💳</span> billing.stripe.com</div>
          <div className="marquee-chip"><span>📊</span> analytics.google.com</div>
          <div className="marquee-chip"><span>☁️</span> console.aws.amazon.com</div>
          <div className="marquee-chip"><span>📑</span> sheets.google.com</div>
          <div className="marquee-chip"><span>🤝</span> hubspot.com</div>
          <div className="marquee-chip"><span>⚡</span> airtable.com</div>
          <div className="marquee-chip"><span>👥</span> salesforce.com</div>
          {/* Duplicate for infinite loop */}
          <div className="marquee-chip"><span>📧</span> mail.google.com</div>
          <div className="marquee-chip"><span>💳</span> billing.stripe.com</div>
          <div className="marquee-chip"><span>📊</span> analytics.google.com</div>
          <div className="marquee-chip"><span>☁️</span> console.aws.amazon.com</div>
          <div className="marquee-chip"><span>📑</span> sheets.google.com</div>
          <div className="marquee-chip"><span>🤝</span> hubspot.com</div>
          <div className="marquee-chip"><span>⚡</span> airtable.com</div>
          <div className="marquee-chip"><span>👥</span> salesforce.com</div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="features-section" id="features">
        <div className="section-header">
          <div className="pill-badge">Next-Gen Privacy Suite</div>
          <h2 className="section-title">Everything you need to share screens safely</h2>
          <p className="section-subtitle">Engineered for founders, sales teams, educators, and enterprise compliance.</p>
        </div>

        <div className="grid-3">
          <div className="feature-card">
            <div className="feature-icon-wrapper">🎯</div>
            <h3>Click-to-Blur Picker</h3>
            <p>Point and click any DOM element, card, or table row to instantly apply a frosted Gaussian blur. Shift-click snaps directly to full table rows.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">💧</div>
            <h3>Blur Selected Text</h3>
            <p>Highlight any specific word, phrase, or sentence with your mouse to instantly veil it with our floating action pill or keyboard shortcut.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">📐</div>
            <h3>Regional Area Blur Box</h3>
            <p>Click and drag floating frosted blur rectangles anywhere on the screen. Move, resize, or delete them freely during live presentations.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🤖</div>
            <h3>Automated PII Redaction</h3>
            <p>High-precision regex detection automatically scans and masks credit card numbers, email addresses, telephone numbers, ARR metrics, and API secrets.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">📡</div>
            <h3>WebRTC Screen Share Detection</h3>
            <p>Automatically detects when Zoom, Google Meet, Teams, or Loom starts capturing your display, instantly veiling sensitive data with zero manual clicks.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">⚡</div>
            <h3>Instant Clear & Restore</h3>
            <p>Single-click master switch lets you instantly clear all blurs to view data, then restore them in 0 milliseconds with 100% fidelity.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🔒</div>
            <h3>Persistent Across Reloads</h3>
            <p>Configured rules remain permanently active on your domain even after refreshing or navigating SPA routes in React, Next.js, and Vue.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🎭</div>
            <h3>Tab Privacy Cloak</h3>
            <p>Disguises your browser tab title and favicon as an innocent Google Doc to prevent colleagues or viewers from seeing what sites you have open.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🔑</div>
            <h3>Supabase License Engine</h3>
            <p>Cryptographic single-user lifetime purchases and 20-seat enterprise team license keys with automated seat claim enforcement and zero recurring calls.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="section-header">
          <div className="pill-badge emerald">Simple, Transparent Pricing</div>
          <h2 className="section-title">Pay once. Own lifetime privacy.</h2>
          <p className="section-subtitle">No monthly subscriptions. Free updates forever.</p>
        </div>

        <div className="pricing-grid">
          {/* Solo Plan */}
          <div className="pricing-card">
            <div className="pricing-tier-name">Personal Lifetime</div>
            <p className="pricing-desc">For individual founders, creators, and professionals recording videos or doing client calls.</p>
            
            <div className="pricing-price-box">
              <span className="price-currency">$</span>
              <span className="price-amount">29</span>
              <span className="price-period">one-time / lifetime</span>
            </div>

            <ul className="pricing-features-list">
              <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Single user (1 browser seat binding)</li>
              <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Unlimited element & text blurring</li>
              <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Automated PII masking (Cards, Emails, Keys)</li>
              <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Live WebRTC screen share auto-detection</li>
              <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Regional drag-to-blur boxes</li>
              <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> SPA persistent domain rules</li>
              <li className="pricing-feature-item"><span className="pricing-check-icon">✓</span> Free updates forever</li>
            </ul>

            <Link href="/checkout?tier=pro" className="btn btn-secondary" style={{ width: '100%' }}>
              Buy Personal Key ($29)
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="pricing-card featured">
            <div className="pricing-popular-badge">MOST POPULAR FOR TEAMS</div>
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
            </ul>

            <Link href="/checkout?tier=enterprise" className="btn btn-primary" style={{ width: '100%' }}>
              Buy Enterprise Key ($199 — 20 Seats)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
