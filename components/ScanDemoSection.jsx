'use client';

import { useState } from 'react';

const SCENARIOS = [
  {
    id: 'stripe',
    name: 'Stripe Billing & Revenue',
    icon: '💳',
    url: 'dashboard.stripe.com/customers/acme',
    items: [
      { id: 1, type: 'FINANCIAL', label: 'ARR / Revenue', raw: '$1,480,290.00', masked: '$••••••••••', category: 'Financial' },
      { id: 2, type: 'EMAIL', label: 'Primary Contact', raw: 'billing@enterprise-corp.io', masked: '•••••••@•••••••••••••••.io', category: 'Email' },
      { id: 3, type: 'API_KEY', label: 'Live Secret Key', raw: 'sk_live_9a8B7c6D5e4F3g2H1j0K', masked: 'sk_live_••••••••••••••••••', category: 'Secret' },
      { id: 4, type: 'CARD', label: 'Corporate Card', raw: '4111 •••• •••• 9921', masked: '•••• •••• •••• ••••', category: 'Card' },
      { id: 5, type: 'BANK', label: 'Routing / Account', raw: 'Chase #892019842', masked: 'Chase #•••••••••', category: 'Banking' }
    ]
  },
  {
    id: 'hubspot',
    name: 'HubSpot CRM Pipeline',
    icon: '👥',
    url: 'app.hubspot.com/contacts/enterprise-deal',
    items: [
      { id: 1, type: 'NAME', label: 'Lead Full Name', raw: 'Marcus Vance (Chief Architect)', masked: '•••••• ••••• (•••••••••••••••)', category: 'PII' },
      { id: 2, type: 'PHONE', label: 'Direct Mobile', raw: '+1 (415) 892-3011', masked: '+1 (•••) •••-••••', category: 'Phone' },
      { id: 3, type: 'DEAL', label: 'Unclosed Contract', raw: '$350,000 /yr Contract Value', masked: '$••••••• /yr Contract Value', category: 'Financial' },
      { id: 4, type: 'EMAIL', label: 'Personal Email', raw: 'marcus.vance.private@gmail.com', masked: '•••••••••••••••••••@•••••.com', category: 'Email' },
      { id: 5, type: 'NOTES', label: 'Private Note', raw: 'Wants 20% discount if signed before Q3', masked: '••••••••••••••••••••••••••••••••••••', category: 'Note' }
    ]
  },
  {
    id: 'aws',
    name: 'AWS Cloud Console',
    icon: '☁️',
    url: 'us-east-1.console.aws.amazon.com/iam',
    items: [
      { id: 1, type: 'API_KEY', label: 'Access Key ID', raw: 'AKIAIOSFODNN7EXAMPLE', masked: 'AKIA••••••••••••••••', category: 'Secret' },
      { id: 2, type: 'SECRET', label: 'AWS Secret Access Key', raw: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', masked: '••••••••••••••••••••••••••••••••••••••••', category: 'Secret' },
      { id: 3, type: 'IP', label: 'Production Bastion IP', raw: '192.168.1.104 (Prod VPC)', masked: '•••.•••.•.••• (•••• •••)', category: 'Infra' },
      { id: 4, type: 'DB', label: 'Postgres DB URI', raw: 'postgres://root:p@ssw0rd1@prod-db.aws.internal', masked: 'postgres://••••:••••••••@••••••••••••••••••••', category: 'Database' }
    ]
  }
];

export default function ScanDemoSection() {
  const [selectedScenarioId, setSelectedScenarioId] = useState('stripe');
  const [maskMode, setMaskMode] = useState('blur'); // 'blur' | 'redact' | 'scramble'
  const [isShielded, setIsShielded] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  const scenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1800);
  };

  return (
    <section className="scan-demo-section" id="interactive-scanner">
      <div className="scan-demo-container">
        
        {/* Section Header */}
        <div className="section-head-center">
          <div className="story-badge-amber">
            <span className="pulse-dot"></span>
            <span>LIVE DETECTION LAB</span>
          </div>
          <h2 className="section-h2">
            Test the Shield on <span className="serif-highlight">Your Real Workflows</span>
          </h2>
          <p className="section-sub">
            Switch between real SaaS dashboards below. Toggle obfuscation on and off, switch mask styles, and trigger a live DOM sweep.
          </p>
        </div>

        {/* Interactive Control Console */}
        <div className="demo-control-bar">
          
          {/* Scenario Tabs */}
          <div className="scenario-pill-group">
            {SCENARIOS.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedScenarioId(s.id)}
                className={`scenario-btn ${selectedScenarioId === s.id ? 'active' : ''}`}
              >
                <span>{s.icon}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>

          {/* Masking Style Switcher */}
          <div className="mask-style-group">
            <span className="mask-style-label">Mask Style:</span>
            <button
              type="button"
              onClick={() => setMaskMode('blur')}
              className={`mask-style-btn ${maskMode === 'blur' ? 'active' : ''}`}
            >
              Frosted Blur
            </button>
            <button
              type="button"
              onClick={() => setMaskMode('redact')}
              className={`mask-style-btn ${maskMode === 'redact' ? 'active' : ''}`}
            >
              Redacted Bar
            </button>
            <button
              type="button"
              onClick={() => setMaskMode('scramble')}
              className={`mask-style-btn ${maskMode === 'scramble' ? 'active' : ''}`}
            >
              Scramble
            </button>
          </div>

          {/* Master Shield Toggle Button */}
          <div className="shield-toggle-group">
            <button
              type="button"
              onClick={triggerScan}
              disabled={isScanning}
              className="btn-scan-trigger"
            >
              {isScanning ? '⚡ Sweeping DOM...' : '🔍 Trigger Scan Sweep'}
            </button>

            <button
              type="button"
              onClick={() => setIsShielded(!isShielded)}
              className={`btn-shield-toggle ${isShielded ? 'shield-on' : 'shield-off'}`}
            >
              <span className="shield-icon">{isShielded ? '🛡️' : '⚠️'}</span>
              <span>{isShielded ? 'VEIL ACTIVE (0ms)' : 'UNMASKED (EXPOSED)'}</span>
            </button>
          </div>

        </div>

        {/* Live Simulator Viewport */}
        <div className="demo-viewport-card">
          
          {/* Top Browser Bar */}
          <div className="viewport-bar">
            <div className="browser-traffic-lights">
              <span className="traffic-dot red"></span>
              <span className="traffic-dot yellow"></span>
              <span className="traffic-dot green"></span>
            </div>

            <div className="viewport-url-pill">
              <span className="lock-icon">🔒</span>
              <span className="url-text">https://{scenario.url}</span>
            </div>

            <div className="viewport-benchmark-tag">
              <span>0.38ms In-Memory Latency</span>
              <span className="tag-dot"></span>
              <span>0 Cloud Sync</span>
            </div>
          </div>

          {/* Active Screen Area */}
          <div className="viewport-body">
            
            {/* Laser Scan Beam */}
            {isScanning && (
              <div className="story-scan-beam">
                <div className="scan-line-head"></div>
                <div className="scan-trail"></div>
              </div>
            )}

            {/* Simulated Dashboard Grid */}
            <div className="viewport-grid">
              {scenario.items.map((item) => {
                const isMasked = isShielded;
                return (
                  <div key={item.id} className="viewport-item-card">
                    <div className="item-meta">
                      <span className="item-label">{item.label}</span>
                      <span className={`item-badge badge-${item.category.toLowerCase()}`}>
                        {item.category}
                      </span>
                    </div>

                    <div className="item-value-box">
                      {isMasked ? (
                        <div className={`masked-token token-style-${maskMode}`}>
                          {maskMode === 'scramble' ? (
                            <span className="scramble-font">X9#8@kQ!2zL$7vP</span>
                          ) : maskMode === 'redact' ? (
                            <span className="redact-bar-solid">{item.masked}</span>
                          ) : (
                            <span className="blur-frost">{item.raw}</span>
                          )}
                        </div>
                      ) : (
                        <div className="exposed-token">
                          <span className="raw-text">{item.raw}</span>
                          <span className="leak-tag">EXPOSED</span>
                        </div>
                      )}
                    </div>

                    <div className="item-footer">
                      <span className="item-status-icon">
                        {isMasked ? '✓ Protected pre-paint' : '⚠️ Visible on screen share'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Status Ticker */}
            <div className="viewport-ticker-bar">
              <div className="ticker-item">
                <span className="ticker-dot green"></span>
                <span>Rule Engine: 14 Active Regex & DOM Heuristic Matchers</span>
              </div>
              <div className="ticker-item">
                <span className="ticker-dot green"></span>
                <span>TreeWalker Performance: 0.12ms average traversal</span>
              </div>
              <div className="ticker-item">
                <span className="ticker-dot green"></span>
                <span>Cloud Relay: Disabled (100% In-Browser)</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
