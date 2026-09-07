import Link from 'next/link';

export const metadata = {
  title: 'Documentation — Veil Screen Privacy',
  description: 'Complete guide for installing and using Veil: Element Picker, Text Blur, Automated PII Redaction, Screen Share Detection, and Instant License Activation.',
};

export default function DocsPage() {
  return (
    <div className="docs-layout">
      {/* Docs Sidebar / Mobile Sticky Navigation Bar */}
      <aside className="docs-sidebar">
        <div className="docs-mobile-nav-header">
          <span>Jump to Section</span>
          <span>⇄ Swipe</span>
        </div>

        <div className="docs-sidebar-nav-container">
          <div className="docs-nav-group">
            <div className="docs-nav-header">Getting Started</div>
            <a href="#installation" className="docs-nav-item">Installation</a>
            <a href="#quickstart" className="docs-nav-item">Quickstart</a>
          </div>

          <div className="docs-nav-group">
            <div className="docs-nav-header">Core Features</div>
            <a href="#element-picker" className="docs-nav-item">Element Picker</a>
            <a href="#blur-selection" className="docs-nav-item">Text Blur</a>
            <a href="#area-blur" className="docs-nav-item">Area Blur</a>
            <a href="#pii-redaction" className="docs-nav-item">Auto PII</a>
            <a href="#webrtc-detection" className="docs-nav-item">Screen Share</a>
          </div>

          <div className="docs-nav-group">
            <div className="docs-nav-header">Licensing & Extension</div>
            <a href="#licensing" className="docs-nav-item">Licensing</a>
          </div>
        </div>
      </aside>

      {/* Main Docs Content */}
      <main className="docs-content">
        <h1>Veil Documentation</h1>
        <p>
          Everything you need to configure and master Veil for live screen sharing, product recordings, and privacy protection.
        </p>

        <div className="docs-callout">
          💡 <strong>Interactive Sandbox:</strong> You can test all blur features right now without installing anything on our{' '}
          <Link href="/demo" style={{ textDecoration: 'underline', fontWeight: 600, color: '#a5b4fc' }}>
            Interactive Live Sandbox
          </Link>.
        </div>

        {/* 1. Installation */}
        <section id="installation">
          <h2>1. Installation & Setup</h2>
          <p>
            Veil installs into any Chromium desktop browser (Chrome, Edge, Brave, Arc) or Mozilla Firefox with zero native system dependencies.
          </p>
          <div className="docs-step-card">
            <ol style={{ paddingLeft: '20px', lineHeight: 1.9, fontSize: '14px', color: 'var(--text-muted)' }}>
              <li>Load the extension folder from your machine or install via the Chrome Web Store.</li>
              <li>Pin the <strong>Veil</strong> icon to your browser toolbar for instant 1-click access.</li>
              <li>Click the popup icon anytime to reveal the privacy controls or enter your Pro key.</li>
            </ol>
          </div>
        </section>

        {/* 2. Quickstart */}
        <section id="quickstart">
          <h2>2. Quickstart Guide</h2>
          <p>
            Once installed, Veil injects a lightweight, draggable pill dock at the bottom of your browser window. You can drag it anywhere on your screen or use dedicated global keyboard shortcuts:
          </p>
          <div className="docs-step-card">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <span className="shortcut-kbd">Alt + Shift + B</span>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Toggle Element Picker</div>
              </div>
              <div>
                <span className="shortcut-kbd">Alt + Shift + A</span>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Draw Regional Blur Box</div>
              </div>
              <div>
                <span className="shortcut-kbd">Alt + Shift + S</span>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Blur Highlighted Text</div>
              </div>
              <div>
                <span className="shortcut-kbd">Space</span>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>0ms Master Kill Switch</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Element Picker */}
        <section id="element-picker">
          <h2>3. Element Picker</h2>
          <p>
            Click the target icon on the floating toolbar or press <kbd className="shortcut-kbd">Alt + Shift + B</kbd>. Hover over any DOM element (cards, table rows, avatars, headers) to preview an indigo selection ring. Click to apply a permanent 6.5px Gaussian veil.
          </p>
          <div className="docs-callout">
            🔥 <strong>Shift + Click Tip:</strong> When hovering over table cells, holding <kbd className="shortcut-kbd">Shift</kbd> expands the selection ring to instantly veil the entire table row.
          </div>
        </section>

        {/* 4. Blur Selected Text */}
        <section id="blur-selection">
          <h2>4. Blur Selected Text</h2>
          <p>
            Highlight any specific words, sentences, or numbers across arbitrary DOM elements. A floating pill dock will appear near your cursor. Click <strong>Blur Selection</strong> to mask the highlighted text without disturbing neighboring content or page layout.
          </p>
        </section>

        {/* 5. Regional Area Blur */}
        <section id="area-blur">
          <h2>5. Regional Area Blur Box</h2>
          <p>
            Click the rectangular box icon or press <kbd className="shortcut-kbd">Alt + Shift + A</kbd>. Click and drag anywhere on your screen to draw a high-performance regional blur box with dynamic backdrop filters. Each box can be repositioned or closed via its top-right button.
          </p>
        </section>

        {/* 6. Automated PII Redaction */}
        <section id="pii-redaction">
          <h2>6. Automated PII Redaction</h2>
          <p>
            Click the shield icon to run instantaneous regex-based pattern detection across the active tab DOM. Veil automatically scans and masks:
          </p>
          <div className="docs-step-card">
            <ul style={{ paddingLeft: '20px', lineHeight: 1.9, fontSize: '14px', color: 'var(--text-muted)' }}>
              <li><strong>API Keys & Secrets:</strong> Stripe keys (<code>sk_live_*</code>), GitHub tokens (<code>ghp_*</code>), AWS keys (<code>AKIA*</code>).</li>
              <li><strong>Financial Data:</strong> Visa, MasterCard, Amex credit card numbers and high-value ARR figures.</li>
              <li><strong>Customer Contact PII:</strong> Email addresses and phone numbers.</li>
            </ul>
          </div>
        </section>

        {/* 7. Screen Share Auto-Detect */}
        <section id="webrtc-detection">
          <h2>7. WebRTC Screen Share Auto-Detect</h2>
          <p>
            Veil hooks into the browser WebRTC capture API (`getDisplayMedia`). When a presentation or screen share starts on Google Meet, Zoom, Slack Huddles, or Microsoft Teams, Veil automatically activates your saved blur rules and displays a top status bar to prevent accidental confidential leaks.
          </p>
        </section>

        {/* 8. Licensing */}
        <section id="licensing">
          <h2>8. License & Device Activation</h2>
          <p>
            Purchasing a license creates a cryptographic key stored securely in our encrypted cloud registry:
          </p>
          <div className="docs-step-card">
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.9, fontSize: '14px', color: 'var(--text-muted)' }}>
              <li><strong>Personal Lifetime:</strong> Valid for up to 3 active browser seats with full lifetime access. Ideal for individual creators & founders across their laptop and workstations.</li>
              <li><strong>Enterprise:</strong> Allows up to 30 active team browser seats under one shared cryptographic key.</li>
              <li><strong>Offline Resilience:</strong> Once activated, the license is saved directly in Chrome extension local storage. No continuous background calls needed.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
