'use client';

export default function TrustSection() {
  const trustPoints = [
    {
      icon: '🔒',
      title: '0 Outbound Network Bytes',
      description: 'Veil runs 100% locally in your browser. It does not send keystrokes, DOM text, or analytics to any remote cloud servers.'
    },
    {
      icon: '⚡',
      title: '0ms Pre-Paint Rasterization',
      description: 'Obfuscation rules are injected synchronously before the browser paint cycle, preventing single-frame visual leaks.'
    },
    {
      icon: '🔍',
      title: 'Verifiable in Chrome DevTools',
      description: 'Open the Network tab on any page while Veil is running. Filter by fetch/XHR/WS. You will see exactly zero outbound requests.'
    },
    {
      icon: '🛡️',
      title: 'Master Instant Kill-Switch',
      description: 'Need to see original values immediately? Toggle the extension off with a single hotkey (Cmd+Shift+V / Ctrl+Shift+V).'
    }
  ];

  return (
    <section className="trust-proof-section" id="privacy-guarantee">
      <div className="trust-proof-container">
        
        {/* Header */}
        <div className="section-head-center">
          <div className="story-badge-amber">
            <span className="pulse-dot"></span>
            <span>ZERO CLOUD RELIANCE</span>
          </div>
          <h2 className="section-h2">
            Open DevTools. <span className="serif-highlight">See For Yourself.</span>
          </h2>
          <p className="section-sub">
            Privacy tools shouldn&apos;t ask for blind trust. Veil is built to be inspectable, verifiable, and strictly local.
          </p>
        </div>

        {/* 2-Column Proof Box */}
        <div className="trust-proof-grid">
          
          {/* Left Column: 4 Proof Points */}
          <div className="trust-points-col">
            {trustPoints.map((tp, idx) => (
              <div key={idx} className="trust-point-card">
                <div className="tp-icon-wrap">{tp.icon}</div>
                <div className="tp-content">
                  <h3 className="tp-title">{tp.title}</h3>
                  <p className="tp-desc">{tp.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Simulated DevTools Network Inspector */}
          <div className="devtools-mockup-wrap">
            <div className="devtools-window">
              <div className="devtools-topbar">
                <div className="devtools-tabs">
                  <span className="devtools-tab">Elements</span>
                  <span className="devtools-tab">Console</span>
                  <span className="devtools-tab active">Network</span>
                  <span className="devtools-tab">Application</span>
                  <span className="devtools-tab">Security</span>
                </div>
                <div className="devtools-filter-status">
                  <span className="filter-active">Filter: ext:veil</span>
                </div>
              </div>

              <div className="devtools-table-body">
                <div className="devtools-table-head">
                  <span>Name</span>
                  <span>Status</span>
                  <span>Type</span>
                  <span>Initiator</span>
                  <span>Size</span>
                  <span>Time</span>
                </div>

                {/* Empty State / Zero Requests */}
                <div className="devtools-empty-log">
                  <div className="empty-shield-icon">🛡️</div>
                  <div className="empty-title">0 Requests Logged</div>
                  <div className="empty-sub">
                    Veil performed 42 DOM obfuscations locally with 0 network transactions.
                  </div>
                  <div className="devtools-metric-badge">
                    <span>Transferred: 0 B</span>
                    <span className="dot-divider">•</span>
                    <span>Resources: 0 B</span>
                    <span className="dot-divider">•</span>
                    <span>Finish: 0 ms</span>
                  </div>
                </div>
              </div>

              <div className="devtools-footer-bar">
                <span className="audit-status">✓ Security Audit: Clean (100% Client-Side Sandbox)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
