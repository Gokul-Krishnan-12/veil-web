import Link from 'next/link';
import HomePricing from '@/components/HomePricing';

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
            <h3>Cryptographic License Engine</h3>
            <p>Cryptographic 3-browser personal lifetime licenses and 30-seat enterprise team license keys with automated seat claim enforcement and zero recurring calls.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <HomePricing />
    </div>
  );
}
