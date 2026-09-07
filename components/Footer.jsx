import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-brand-col">
          <div className="footer-brand-header">
            <img src="/assets/icon32.png" alt="Veil Logo" className="footer-logo" />
            <span className="footer-brand-name">Veil Privacy Suite</span>
          </div>
          <p className="footer-tagline">
            Enterprise-grade browser screen blur & real-time privacy shield. Zero recording leaks, zero post-production editing.
          </p>
          <div className="footer-status-pill">
            <span className="status-dot"></span> All Systems Operational
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Product</h4>
            <Link href="/demo">Live Interactive Demo</Link>
            <Link href="/pricing">Pricing & Licenses</Link>
            <Link href="/checkout?tier=pro">Unlock Pro Lifetime ($29)</Link>
            <Link href="/use-cases">Enterprise Workflows</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <Link href="/docs">Documentation</Link>
            <Link href="/docs#installation">Extension Setup</Link>
            <Link href="/api/health" target="_blank">API Health Status</Link>
          </div>
          <div className="footer-col">
            <h4>Security & Privacy</h4>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>AES-256 Checksummed Keys</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>Zero Telemetry Architecture</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>Local-First Privacy Shield</span>
            <Link href="/privacy" style={{ color: 'var(--accent-cyan)', fontWeight: 500, fontSize: '14px', marginTop: '4px' }}>Privacy Policy</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p>© {new Date().getFullYear()} Veil Technologies Inc. All rights reserved.</p>
        <p>Built for Chromium & Gecko desktop browsers.</p>
      </div>
    </footer>
  );
}
