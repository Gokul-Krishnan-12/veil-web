import Link from 'next/link';

export const metadata = {
  title: 'Documentation — Veil Screen Privacy',
  description: 'Complete guide for installing and using Veil: Element Picker, Text Blur, Automated PII Redaction, Screen Share Detection, and Supabase License Activation.',
};

export default function DocsPage() {
  return (
    <div className="docs-layout" style={{ maxWidth: '1240px', margin: '40px auto 80px', padding: '0 24px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '48px' }}>
      {/* Sticky Docs Sidebar */}
      <aside className="docs-sidebar">
        <div className="docs-nav-group">
          <div className="docs-nav-header">Getting Started</div>
          <a href="#installation" className="docs-nav-item active">Installation</a>
          <a href="#quickstart" className="docs-nav-item">Quickstart Guide</a>
        </div>

        <div className="docs-nav-group">
          <div className="docs-nav-header">Core Features</div>
          <a href="#element-picker" className="docs-nav-item">Element Picker</a>
          <a href="#blur-selection" className="docs-nav-item">Blur Selected Text</a>
          <a href="#area-blur" className="docs-nav-item">Regional Area Blur</a>
          <a href="#pii-redaction" className="docs-nav-item">Automated PII Redaction</a>
          <a href="#webrtc-detection" className="docs-nav-item">Screen Share Auto-Detect</a>
        </div>

        <div className="docs-nav-group">
          <div className="docs-nav-header">Licensing & Extension</div>
          <a href="#licensing" className="docs-nav-item">License & Activation</a>
          <a href="#admin" className="docs-nav-item">Supabase Admin Hub</a>
        </div>
      </aside>

      {/* Main Docs Content */}
      <main className="docs-content">
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>Veil Documentation</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '24px' }}>
          Everything you need to configure and master Veil for live screen sharing, product recordings, and privacy protection.
        </p>

        <div className="docs-callout" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '10px', padding: '16px', marginBottom: '32px' }}>
          💡 <strong>Interactive Sandbox:</strong> You can test all blur features right now without installing anything on our{' '}
          <Link href="/demo" style={{ textDecoration: 'underline', fontWeight: 600, color: '#a5b4fc' }}>
            Interactive Live Sandbox
          </Link>.
        </div>

        <section id="installation" style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>1. Installation & Setup</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Veil installs into any Chromium desktop browser (Chrome, Edge, Brave, Arc) or Mozilla Firefox with zero native system dependencies.
          </p>
          <div className="docs-step-card" style={{ marginTop: '16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '24px' }}>
            <ol style={{ paddingLeft: '20px', lineHeight: 2, fontSize: '14px', color: 'var(--text-muted)' }}>
              <li>Load the extension folder from your machine or install via the Chrome Web Store.</li>
              <li>Pin the <strong>Veil</strong> icon to your browser toolbar for instant 1-click access.</li>
              <li>Click the popup icon anytime to reveal the privacy controls or enter your Pro key.</li>
            </ol>
          </div>
        </section>

        <section id="licensing" style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>2. Supabase License Activation</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Purchasing a license on our website creates a cryptographic key in our Supabase database:
          </p>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '24px', marginTop: '16px' }}>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2, fontSize: '14px', color: 'var(--text-muted)' }}>
              <li><strong>Solo Pro ($29):</strong> Valid for 1 active browser. Ideal for individual creators & founders.</li>
              <li><strong>Enterprise ($199):</strong> Allows up to 20 active browsers under one shared key.</li>
              <li><strong>Offline Resilience:</strong> Once activated, the license is saved directly in Chrome extension local storage. No continuous background calls needed.</li>
            </ul>
          </div>
        </section>

        <section id="admin" style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>3. Administrator Management</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Admins can log into the secret portal at <code>/v-sec-7x92kp/admin</code> using the default credentials:
          </p>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '16px', marginTop: '12px' }}>
            <div>Email: <code>admin@veil.app</code></div>
            <div>Password: <code>admin123</code></div>
          </div>
        </section>
      </main>
    </div>
  );
}
