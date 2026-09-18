'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCurrency } from './CurrencyContext';

const HERO_SCENARIOS = {
  stripe: {
    id: 'stripe',
    name: 'Stripe MRR & Revenue',
    icon: '💳',
    url: 'dashboard.stripe.com/v1/customers/cus_994xQ1/billing',
    orgName: 'Acme Global Technologies Inc.',
    badge: 'Enterprise Tier',
    mrr: '$148,920.00',
    traffic: '2.4M req/day',
    fields: [
      { label: 'Customer Name', raw: 'Sarah Jenkins (VP Operations)', category: 'pii' },
      { label: 'Billing Email', raw: 's.jenkins@acmeglobal.corp', category: 'pii' },
      { label: 'Direct Phone', raw: '+1 (415) 892-4109', category: 'pii' },
      { label: 'Payment Method', raw: 'Visa ending in 4921 (Exp 08/29)', category: 'financials' }
    ],
    credentials: [
      { label: 'Production Secret Key', raw: 'sk_live_9a8B7c6D5e4F3g2H1j0K_prod', category: 'secrets' },
      { label: 'Webhook Endpoint Secret', raw: 'whsec_5f6e7d8c9b0a1a2b3c4d5e6f', category: 'secrets' },
      { label: 'Payout Settlement Account', raw: 'JPMorgan Chase (Acct 8923019842)', category: 'financials' }
    ],
    tableData: [
      { id: 'tx_99182', client: 'Vortex Cloud Inc.', amount: '$42,500.00', status: 'Succeeded' },
      { id: 'tx_99183', client: 'Northstar Media Group', amount: '$19,800.00', status: 'Succeeded' }
    ]
  },
  aws: {
    id: 'aws',
    name: 'AWS Cloud Credentials',
    icon: '☁️',
    url: 'console.aws.amazon.com/iam/home#security_credentials',
    orgName: 'AWS Infrastructure Production',
    badge: 'Root Account',
    mrr: '$38,450.00 / mo',
    traffic: 'us-east-1 (N. Virginia)',
    fields: [
      { label: 'DevOps Lead', raw: 'Marcus Chen (Principal Infra)', category: 'pii' },
      { label: 'Account Root Email', raw: 'infra-root@acme-systems.cloud', category: 'pii' },
      { label: 'Account ID', raw: '9841-2094-8812-0091', category: 'secrets' },
      { label: 'MFA Status', raw: 'Hardware YubiKey (Active)', category: 'none' }
    ],
    credentials: [
      { label: 'Access Key ID', raw: 'AKIAIOSFODNN7EXAMPLE99', category: 'secrets' },
      { label: 'Secret Access Key', raw: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', category: 'secrets' },
      { label: 'Kubeconfig Auth Token', raw: 'k8s-aws-v1.eyJhGciOiJIUzI1NiIsInR5cCI6', category: 'secrets' }
    ],
    tableData: [
      { id: 'rds-master', client: 'prod-aurora-cluster.internal', amount: '$18,200.00', status: 'Healthy' },
      { id: 's3-backup', client: 'vault-encrypted-backups-2026', amount: '$4,350.00', status: 'Healthy' }
    ]
  },
  crm: {
    id: 'crm',
    name: 'HubSpot & Salesforce CRM',
    icon: '👥',
    url: 'app.hubspot.com/contacts/8920194/pipeline/deals',
    orgName: 'Global Pipeline & Deal Flow',
    badge: 'Tier-1 High Value',
    mrr: '$1,840,000.00 ARR',
    traffic: '32 Active Deals',
    fields: [
      { label: 'Key Executive Contact', raw: 'Dr. Arthur Pendelton (CTO)', category: 'pii' },
      { label: 'Direct Personal Email', raw: 'arthur.pendelton@fintech-ventures.com', category: 'pii' },
      { label: 'Direct Mobile Phone', raw: '+1 (650) 902-3811', category: 'pii' },
      { label: 'Billing Address', raw: '500 Howard St, Suite 400, SF, CA', category: 'pii' }
    ],
    credentials: [
      { label: 'Contract Signing Link', raw: 'https://docusign.net/sign/doc_991823a9b', category: 'secrets' },
      { label: 'CRM API Integration Token', raw: 'pat-na1-9821-4f12-9c12-984210', category: 'secrets' },
      { label: 'Target Deal Size', raw: '$540,000.00 / yr (Procurement)', category: 'financials' }
    ],
    tableData: [
      { id: 'OPP-892', client: 'Palantir Defense Systems', amount: '$750,000.00', status: 'Legal Review' },
      { id: 'OPP-893', client: 'Shopify Plus Expansion', amount: '$230,000.00', status: 'Procurement' }
    ]
  }
};

export default function MainHero() {
  const { formatPrice } = useCurrency();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('stripe');
  const [shieldActive, setShieldActive] = useState(true);
  const [maskPii, setMaskPii] = useState(true);
  const [maskSecrets, setMaskSecrets] = useState(true);
  const [maskFinance, setMaskFinance] = useState(true);
  const [interactiveItems, setInteractiveItems] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const scenario = HERO_SCENARIOS[activeTab] || HERO_SCENARIOS.stripe;
  const displayPrice = mounted ? formatPrice('pro') : '$29';

  const toggleItem = (key) => {
    setInteractiveItems((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const shouldMask = (category, key) => {
    if (!shieldActive) return false;
    if (interactiveItems[key] !== undefined) return interactiveItems[key];
    if (category === 'pii') return maskPii;
    if (category === 'secrets') return maskSecrets;
    if (category === 'financials') return maskFinance;
    return false;
  };

  const getMaskedText = (raw, category, key) => {
    const isHidden = shouldMask(category, key);
    if (!isHidden) return raw;

    if (raw.startsWith('$')) return '$••••••••';
    if (raw.includes('@')) return '••••••••••••••••••••';
    if (raw.startsWith('sk_live_')) return 'sk_live_••••••••••••••••••••';
    if (raw.startsWith('whsec_')) return 'whsec_••••••••••••••••••••';
    if (raw.startsWith('AKIA')) return 'AKIA••••••••••••••••';
    if (raw.startsWith('+1')) return '+1 (•••) •••-••••';
    return '•••••••• ••••••••';
  };

  return (
    <section className="v-main-hero">
      
      {/* Ambient Backdrop Highlights */}
      <div className="v-hero-glow-top"></div>
      <div className="v-hero-glow-amber"></div>

      <div className="v-hero-container">
        
        {/* Top Floating Badge */}
        <div className="v-hero-badge-wrap">
          <div className="v-hero-badge">
            <span className="v-pulse-dot"></span>
            <span>AUTOMATIC SCREEN PRIVACY • NEVER ACCIDENTALLY LEAK DATA AGAIN</span>
          </div>
        </div>

        {/* Main Display Headline */}
        <h1 className="v-hero-headline">
          Present fearlessly.{' '}
          <span className="v-headline-row">
            Hide sensitive data <span className="serif-highlight">before anyone sees it.</span>
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="v-hero-sub">
          Veil instantly obscures customer PII, Stripe MRR, API keys, and internal secrets during live Zoom calls, Google Meet, and Loom video recordings.
          <strong> 0ms latency. Zero telemetry. 100% client-side.</strong>
        </p>

        {/* Hero Actions Bar */}
        <div className="v-hero-actions">
          <Link href="/pricing" className="v-btn-primary-hero">
            <span className="btn-sparkle">🛡️</span>
            <span suppressHydrationWarning>Get Lifetime Access — {displayPrice}</span>
            <span className="btn-arrow">&rarr;</span>
          </Link>
          <Link href="/demo" className="v-btn-secondary-hero">
            <span className="btn-icon">⚡</span>
            <span>Try Live Sandbox</span>
          </Link>
        </div>

        {/* Value Micro-Points */}
        <div className="v-hero-trust-points">
          <div className="trust-point">
            <span className="check-icon">✓</span>
            <span>Zero Data Collection / 100% Local</span>
          </div>
          <div className="trust-point">
            <span className="check-icon">✓</span>
            <span>One-Time Payment • Lifetime Updates</span>
          </div>
          <div className="trust-point">
            <span className="check-icon">✓</span>
            <span>30-Day Money-Back Guarantee</span>
          </div>
        </div>

        {/* Interactive Centerpiece Showcase Stage */}
        <div className="v-hero-showcase">
          
          {/* Controls Bar Above Showcase */}
          <div className="v-showcase-controls">
            
            {/* Scenario Tabs */}
            <div className="v-scenario-tabs">
              {Object.values(HERO_SCENARIOS).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(s.id);
                    setInteractiveItems({});
                  }}
                  className={`v-scenario-tab ${activeTab === s.id ? 'active' : ''}`}
                >
                  <span>{s.icon}</span>
                  <span>{s.name}</span>
                </button>
              ))}
            </div>

            {/* Master Shield Toggle */}
            <div className="v-master-toggle-slot">
              <button
                type="button"
                onClick={() => setShieldActive(!shieldActive)}
                className={`v-shield-toggle-btn ${shieldActive ? 'shield-on' : 'shield-off'}`}
                title="Click to toggle live protection"
              >
                <span className="toggle-indicator-dot"></span>
                <span>{shieldActive ? '🛡️ VEIL SHIELD: ACTIVE' : '⚠️ RAW / EXPOSED'}</span>
              </button>
            </div>

          </div>

          {/* Realistic Window Container */}
          <div className={`v-browser-stage-window ${shieldActive ? 'protected-glow' : 'exposed-glow'}`}>
            
            {/* Window Header Chrome */}
            <div className="v-window-header">
              <div className="v-traffic-group">
                <span className="v-dot red"></span>
                <span className="v-dot yellow"></span>
                <span className="v-dot green"></span>
              </div>

              <div className="v-url-display">
                <span className="url-lock-icon">🔒</span>
                <span className="url-text">{scenario.url}</span>
              </div>

              {/* Live WebRTC Detected HUD Badge */}
              <div className="v-hud-status">
                {shieldActive ? (
                  <div className="v-hud-shielded-pill">
                    <span className="v-shield-dot-green"></span>
                    <span>0ms PRE-PAINT SHIELD ACTIVE</span>
                  </div>
                ) : (
                  <div className="v-hud-danger-pill">
                    <span className="v-danger-dot-red"></span>
                    <span>17 SENSITIVE TOKENS EXPOSED</span>
                  </div>
                )}
              </div>
            </div>

            {/* Category Quick Filters */}
            <div className="v-filter-toolbar">
              <span className="toolbar-label">SHIELD FILTER TOGGLES:</span>
              <button
                type="button"
                onClick={() => setMaskPii(!maskPii)}
                className={`v-filter-pill ${maskPii && shieldActive ? 'active' : ''}`}
              >
                <span>👤</span> Customer PII ({maskPii && shieldActive ? 'Veiled' : 'Raw'})
              </button>
              <button
                type="button"
                onClick={() => setMaskSecrets(!maskSecrets)}
                className={`v-filter-pill ${maskSecrets && shieldActive ? 'active' : ''}`}
              >
                <span>🔑</span> API Secrets ({maskSecrets && shieldActive ? 'Veiled' : 'Raw'})
              </button>
              <button
                type="button"
                onClick={() => setMaskFinance(!maskFinance)}
                className={`v-filter-pill ${maskFinance && shieldActive ? 'active' : ''}`}
              >
                <span>💰</span> Financials ({maskFinance && shieldActive ? 'Veiled' : 'Raw'})
              </button>
              <span className="interactive-hint">💡 Click any masked token below to test real-time reveal</span>
            </div>

            {/* Window Body Application UI */}
            <div className="v-app-body">
              
              {/* App Header Row */}
              <div className="v-app-header-row">
                <div className="v-app-title-group">
                  <span className="v-app-badge">{scenario.badge}</span>
                  <h3 className="v-app-name">{scenario.orgName}</h3>
                </div>

                <div className="v-app-kpi-group">
                  <div className="v-kpi-card">
                    <span className="v-kpi-label">Monthly Metric / MRR</span>
                    <div
                      onClick={() => toggleItem('header-mrr')}
                      className={`v-kpi-value ${shouldMask('financials', 'header-mrr') ? 'veil-masked-item' : ''}`}
                    >
                      {getMaskedText(scenario.mrr, 'financials', 'header-mrr')}
                    </div>
                  </div>
                  <div className="v-kpi-card hide-mobile">
                    <span className="v-kpi-label">Telemetry Status</span>
                    <span className="v-kpi-value safe-text">{scenario.traffic}</span>
                  </div>
                </div>
              </div>

              {/* Two-Column Details Grid */}
              <div className="v-dashboard-grid">
                
                {/* Left Card: Customer Details */}
                <div className="v-data-card">
                  <div className="v-card-title">Primary Account & Stakeholder Details</div>
                  
                  {scenario.fields.map((f, i) => {
                    const key = `field-${i}`;
                    const isMasked = shouldMask(f.category, key);
                    return (
                      <div key={i} className="v-field-row">
                        <span className="v-field-label">{f.label}</span>
                        <span
                          onClick={() => toggleItem(key)}
                          className={`v-field-value ${isMasked ? 'veil-masked-item' : ''}`}
                          title="Click to toggle inspection"
                        >
                          {getMaskedText(f.raw, f.category, key)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Right Card: Production Credentials */}
                <div className="v-data-card">
                  <div className="v-card-title">Security & Production Credentials</div>
                  
                  {scenario.credentials.map((c, i) => {
                    const key = `cred-${i}`;
                    const isMasked = shouldMask(c.category, key);
                    return (
                      <div key={i} className="v-field-row">
                        <span className="v-field-label">{c.label}</span>
                        <div
                          onClick={() => toggleItem(key)}
                          className={`v-field-code ${isMasked ? 'veil-masked-item' : ''}`}
                          title="Click to toggle inspection"
                        >
                          {getMaskedText(c.raw, c.category, key)}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Recent Transactions Table */}
              <div className="v-data-card mt-3">
                <div className="v-card-title">Recent High-Value Payouts & Transfers</div>
                <div className="v-table-wrap">
                  <div className="v-table-head">
                    <span>Identifier</span>
                    <span>Beneficiary / Endpoint</span>
                    <span>Settlement Value</span>
                    <span>Status</span>
                  </div>
                  {scenario.tableData.map((row, i) => {
                    const key = `row-${i}`;
                    const isMasked = shouldMask('financials', key);
                    return (
                      <div key={i} className="v-table-row">
                        <span className="v-row-mono">{row.id}</span>
                        <span
                          onClick={() => toggleItem(key)}
                          className={`v-row-text ${shouldMask('pii', key + '-client') ? 'veil-masked-item' : ''}`}
                        >
                          {getMaskedText(row.client, 'pii', key + '-client')}
                        </span>
                        <span
                          onClick={() => toggleItem(key)}
                          className={`v-row-amount ${isMasked ? 'veil-masked-item' : ''}`}
                        >
                          {getMaskedText(row.amount, 'financials', key)}
                        </span>
                        <span className="v-status-badge">{row.status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Showcase Footer Status Bar */}
            <div className="v-showcase-footer">
              <div className="v-footer-info">
                <span className="v-shield-check-icon">🛡️</span>
                <span>
                  {shieldActive
                    ? 'All sensitive customer records and credentials masked before layout render. Zero risk on screen share.'
                    : '17 sensitive data points visible in plain text. Vulnerable to screen share capture.'}
                </span>
              </div>
              <Link href="/pricing" className="v-btn-cta-micro">
                Lock Your Browser Now &rarr;
              </Link>
            </div>

          </div>

        </div>

        {/* 4-Stat Telemetry Strip */}
        <div className="v-hero-metrics-strip">
          <div className="v-metric-item">
            <span className="v-metric-val">0.0 ms</span>
            <span className="v-metric-lbl">Pre-Paint Redaction Speed</span>
          </div>
          <div className="v-metric-divider"></div>
          <div className="v-metric-item">
            <span className="v-metric-val">0 Bytes</span>
            <span className="v-metric-lbl">Sent to External Servers</span>
          </div>
          <div className="v-metric-divider"></div>
          <div className="v-metric-item">
            <span className="v-metric-val">100%</span>
            <span className="v-metric-lbl">Local Browser Memory</span>
          </div>
          <div className="v-metric-divider"></div>
          <div className="v-metric-item">
            <span className="v-metric-val">5.0 ★</span>
            <span className="v-metric-lbl">Chrome Web Store Certified</span>
          </div>
        </div>

      </div>

    </section>
  );
}
