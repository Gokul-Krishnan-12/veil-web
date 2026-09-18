'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="v-footer">
      <div className="v-footer-container">
        
        {/* Top Callout Box */}
        <div className="footer-cta-banner">
          <div className="cta-banner-content">
            <span className="story-badge-amber">
              <span className="pulse-dot"></span>
              <span>LIFETIME ACCESS AVAILABLE</span>
            </span>
            <h2 className="cta-banner-title">
              Ready to stop worrying about <span className="serif-highlight">screen leaks?</span>
            </h2>
            <p className="cta-banner-sub">
              Install Veil today. Protect your customer data, confidential revenue numbers, and production API credentials live.
            </p>
          </div>
          <div className="cta-banner-actions">
            <Link href="/pricing" className="v-btn-amber-lg">
              <span>Get Veil for Chrome &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="v-footer-grid">
          
          {/* Brand Column */}
          <div className="v-footer-brand-col">
            <div className="v-footer-brand-row">
              <img src="/assets/icon32.png" alt="Veil Logo" className="v-footer-logo" />
              <span className="v-footer-brand-name">VEIL</span>
            </div>
            <p className="v-footer-desc">
              Real-time in-browser screen privacy engine. Mask sensitive PII, Stripe revenue, and credentials live on Zoom, Google Meet, and Loom with 0ms latency.
            </p>
            <div className="v-footer-audit-tag">
              <span className="audit-dot"></span>
              <span>100% Client-Side · 0 Outbound Cloud Relays</span>
            </div>
          </div>

          {/* Links 1: Product */}
          <div className="v-footer-col">
            <h4 className="v-footer-head">Product</h4>
            <Link href="/demo">Live Interactive Sandbox</Link>
            <Link href="/pricing">Pricing & Lifetime License</Link>
            <Link href="/use-cases">Use Cases & Workflows</Link>
            <Link href="/#interactive-scanner">DOM Scanner Lab</Link>
          </div>

          {/* Links 2: Resources */}
          <div className="v-footer-col">
            <h4 className="v-footer-head">Resources</h4>
            <Link href="/docs">Documentation</Link>
            <Link href="/docs#installation">Installation Guide</Link>
            <Link href="/docs#shortcuts">Keyboard Shortcuts</Link>
            <a href="mailto:gokulkrish80@gmail.com">Contact Founder</a>
          </div>

          {/* Links 3: Trust & Privacy */}
          <div className="v-footer-col">
            <h4 className="v-footer-head">Trust & Security</h4>
            <span className="v-footer-static-item">✓ 0ms Pre-Paint Rasterizer</span>
            <span className="v-footer-static-item">✓ 0 Telemetry / 0 Tracking</span>
            <span className="v-footer-static-item">✓ TreeWalker DOM Sandbox</span>
            <Link href="/privacy" className="v-footer-link-amber">Privacy Policy & Guarantees &rarr;</Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="v-footer-bottom">
          <p>© {new Date().getFullYear()} Veil Technologies. Built for founders, sales engineers, and creators.</p>
          <div className="v-footer-browsers">
            <span>Chrome · Brave · Arc · Edge · Firefox</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
