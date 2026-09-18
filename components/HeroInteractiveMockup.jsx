'use client';

import { useState } from 'react';

const SCENARIOS = {
  stripe: {
    id: 'stripe',
    name: 'Stripe Billing & MRR',
    icon: '💳',
    url: 'dashboard.stripe.com/customers/cus_982bX7/invoices',
    appName: 'Stripe Dashboard — Acme Global Enterprise',
    kpis: [
      { label: 'Customer MRR', value: '$18,450.00 / mo', category: 'financials', id: 'kpi-mrr' },
      { label: 'Active Plan', value: 'Enterprise Tier (Annual)', category: 'none', id: 'kpi-plan' },
      { label: 'Primary Contact', value: 'marcus.vance@acme-global.io', category: 'pii', id: 'kpi-contact' },
      { label: 'Live Secret Key', value: 'sk_live_99482710492837482', category: 'secrets', id: 'kpi-secret' }
    ],
    headers: ['Invoice ID', 'Client Name', 'Email Address', 'Contract Size', 'Status'],
    rows: [
      { id: 'inv-1', c1: 'INV-2026-0891', c2: 'Marcus Vance', c3: 'marcus.vance@acme-global.io', c4: '$142,500.00', status: 'Paid', statusColor: '#10B981' },
      { id: 'inv-2', c1: 'INV-2026-0892', c2: 'Elena Rostova', c3: 'e.rostova@hyperion-labs.tech', c4: '$98,000.00', status: 'Processing', statusColor: '#00D2FF' },
      { id: 'inv-3', c1: 'INV-2026-0893', c2: 'David K. Sterling', c3: 'david.sterling@sterling-capital.com', c4: '$285,000.00', status: 'Paid', statusColor: '#10B981' },
      { id: 'inv-4', c1: 'INV-2026-0894', c2: 'Aisha Al-Mansoor', c3: 'aisha@qatar-fintech.org', c4: '$64,200.00', status: 'Pending', statusColor: '#FFB020' }
    ]
  },
  aws: {
    id: 'aws',
    name: 'AWS Cloud Console',
    icon: '☁️',
    url: 'console.aws.amazon.com/iam/home?region=us-east-1#security_credentials',
    appName: 'AWS Management Console — Security Credentials',
    kpis: [
      { label: 'Account ID', value: '1849-2049-8812 (Root)', category: 'secrets', id: 'kpi-aws-acc' },
      { label: 'Access Key ID', value: 'AKIAIOSFODNN7EXAMPLE', category: 'secrets', id: 'kpi-aws-key' },
      { label: 'Devops Engineer', value: 'sarah.lin@internal-infra.net', category: 'pii', id: 'kpi-aws-eng' },
      { label: 'Monthly Compute', value: '$24,890.15 MTD', category: 'financials', id: 'kpi-aws-cost' }
    ],
    headers: ['Key Identifier', 'Created By User', 'Permission Policy', 'Raw Secret / Token', 'State'],
    rows: [
      { id: 'key-1', c1: 'prod-rds-master', c2: 'sarah.lin@internal-infra.net', c3: 'AdministratorAccess', c4: 'ghp_9281h29b8c0192837482', status: 'Active', statusColor: '#10B981' },
      { id: 'key-2', c1: 's3-backup-bucket', c2: 'ci-bot@internal-staging.dev', c3: 'AmazonS3FullAccess', c4: 'eyJhGciOiJIUzI1NiIsInR5cCI6', status: 'Active', statusColor: '#10B981' },
      { id: 'key-3', c1: 'stripe-webhook-secret', c2: 'billing-service-account', c3: 'SecretsManagerReadWrite', c4: 'whsec_991823719028472918', status: 'Active', statusColor: '#10B981' },
      { id: 'key-4', c1: 'staging-k8s-cluster', c2: 'devops-lead@company.internal', c3: 'EKSClusterAdmin', c4: 'kubeconfig_token_99182a', status: 'Rotated', statusColor: '#00D2FF' }
    ]
  },
  crm: {
    id: 'crm',
    name: 'Salesforce CRM Pipeline',
    icon: '👥',
    url: 'lightning.force.com/lightning/o/Opportunity/list?filterName=Recent',
    appName: 'Salesforce Lightning — Tier 1 Enterprise Opportunities',
    kpis: [
      { label: 'Pipeline Total', value: '$1,840,000.00 ARR', category: 'financials', id: 'kpi-crm-pipe' },
      { label: 'Top Prospect', value: 'Dr. Arthur Pendelton', category: 'pii', id: 'kpi-crm-lead' },
      { label: 'Direct Phone', value: '+1 (415) 890-4122 (Direct)', category: 'pii', id: 'kpi-crm-phone' },
      { label: 'Target Close', value: 'Q3 Enterprise Signing', category: 'none', id: 'kpi-crm-close' }
    ],
    headers: ['Deal Identifier', 'Key Stakeholder', 'Personal Phone / Email', 'Contract ARR', 'Stage'],
    rows: [
      { id: 'deal-1', c1: 'OPP-BankOfAmerica', c2: 'Arthur Pendelton', c3: '+1 (415) 890-4122', c4: '$540,000.00', status: 'Procurement', statusColor: '#10B981' },
      { id: 'deal-2', c1: 'OPP-PalantirGov', c2: 'Col. Raymond Shaw', c3: 'r.shaw@defense-secure.mil', c4: '$750,000.00', status: 'Legal Review', statusColor: '#00D2FF' },
      { id: 'deal-3', c1: 'OPP-StripeRadar', c2: 'Rachel Green-Sloan', c3: 'rachel.sloan@fintech.io', c4: '$320,000.00', status: 'Proposal', statusColor: '#FFB020' },
      { id: 'deal-4', c1: 'OPP-ShopifyPlus', c2: 'Tobias Sterling', c3: '+1 (650) 412-8821', c4: '$230,000.00', status: 'Verbal Agreement', statusColor: '#10B981' }
    ]
  }
};

export default function HeroInteractiveMockup() {
  const [activeScenario, setActiveScenario] = useState('stripe');
  const [shieldActive, setShieldActive] = useState(true);
  const [piiMasked, setPiiMasked] = useState(true);
  const [secretsMasked, setSecretsMasked] = useState(true);
  const [financialsMasked, setFinancialsMasked] = useState(true);
  const [columnMasked, setColumnMasked] = useState(false);
  const [manualBlurs, setManualBlurs] = useState({});

  const scenario = SCENARIOS[activeScenario];

  const toggleManual = (id) => {
    setManualBlurs((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const isBlurred = (category, id) => {
    if (!shieldActive) return false;
    if (manualBlurs[id] !== undefined) return manualBlurs[id];
    if (category === 'pii') return piiMasked;
    if (category === 'secrets') return secretsMasked;
    if (category === 'financials') return financialsMasked;
    if (category === 'column') return columnMasked;
    return false;
  };

  return (
    <div className="hero-mockup-wrapper">
      {/* Scenario Selector Bar */}
      <div className="scenario-nav-bar">
        <div className="scenario-nav-label">
          <span className="scenario-pulse-dot" />
          <span>Interactive Live Simulator — Select Real-World Stack:</span>
        </div>
        <div className="scenario-buttons">
          {Object.values(SCENARIOS).map((sc) => (
            <button
              key={sc.id}
              onClick={() => setActiveScenario(sc.id)}
              className={`scenario-btn ${activeScenario === sc.id ? 'active' : ''}`}
            >
              <span>{sc.icon}</span>
              <span>{sc.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Browser Frame */}
      <div className="browser-window">
        {/* Browser Top Bar */}
        <div className="browser-header">
          <div className="browser-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>

          <div className="browser-tabs">
            <div className="browser-tab active">
              <span className="tab-icon">{scenario.icon}</span>
              <span className="tab-title">{scenario.appName}</span>
              <span className="tab-close">✕</span>
            </div>
            <div className="browser-tab inactive">
              <span className="tab-icon">📹</span>
              <span className="tab-title">Google Meet — Screen Share Live</span>
            </div>
          </div>

          <div className="browser-address-bar">
            <span className="address-lock">🔒</span>
            <span className="address-protocol">https://</span>
            <span className="address-host">{scenario.url}</span>
          </div>

          <div className="browser-header-tools">
            <span className="browser-tool-icon">⟳</span>
            <span className="browser-tool-icon">⋮</span>
          </div>
        </div>

        {/* Browser Inner Viewport with Floating Veil Dock */}
        <div className="browser-viewport">
          
          {/* FLOATING VEIL IN-PAGE DOCK (Interactive Controller) */}
          <div className={`mockup-veil-dock ${!shieldActive ? 'dock-paused' : ''}`}>
            <div className="mockup-dock-handle">⋮⋮</div>
            
            <div className="mockup-dock-brand">
              <div className="dock-logo-dot" />
              <span className="dock-brand-name">VEIL</span>
              <span className="dock-brand-badge">SHIELD</span>
            </div>

            <div className="mockup-dock-actions">
              {/* Master Toggle */}
              <button
                onClick={() => setShieldActive(!shieldActive)}
                className={`mockup-dock-btn ${shieldActive ? 'active' : 'paused'}`}
                title="Toggle Master Shield (Alt+Shift+X)"
              >
                <span>{shieldActive ? '🛡️ Active' : '⏸️ Paused'}</span>
              </button>

              {/* PII Mask Toggle */}
              <button
                onClick={() => setPiiMasked(!piiMasked)}
                className={`mockup-dock-btn ${piiMasked && shieldActive ? 'active' : ''}`}
                title="Auto-Mask Emails & Names"
              >
                <span>👥 PII</span>
              </button>

              {/* Secrets Toggle */}
              <button
                onClick={() => setSecretsMasked(!secretsMasked)}
                className={`mockup-dock-btn ${secretsMasked && shieldActive ? 'active' : ''}`}
                title="Auto-Mask API Keys & Secrets"
              >
                <span>🔑 Secrets</span>
              </button>

              {/* Financials Toggle */}
              <button
                onClick={() => setFinancialsMasked(!financialsMasked)}
                className={`mockup-dock-btn ${financialsMasked && shieldActive ? 'active' : ''}`}
                title="Auto-Mask Revenue & ARR"
              >
                <span>💰 Financials</span>
              </button>

              {/* Column Mask Toggle */}
              <button
                onClick={() => setColumnMasked(!columnMasked)}
                className={`mockup-dock-btn ${columnMasked && shieldActive ? 'active' : ''}`}
                title="Blur Entire Contract Size Column"
              >
                <span>📊 Column</span>
              </button>
            </div>

            <div className="mockup-dock-undo" onClick={() => setManualBlurs({})}>
              <span>↩ Reset</span>
            </div>
          </div>

          {/* Webpage Content */}
          <div className="dashboard-content">
            
            {/* Dashboard Header Bar */}
            <div className="dashboard-header-bar">
              <div>
                <h3 className="dashboard-title">{scenario.appName}</h3>
                <p className="dashboard-subtitle">
                  Click any value below to test real-time Click-to-Blur, or use the floating Veil dock above!
                </p>
              </div>
              <div className="dashboard-status-tag">
                <span className="tag-pulse" />
                <span>Live Call Stream Detected</span>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="dashboard-kpi-grid">
              {scenario.kpis.map((kpi) => {
                const blurred = isBlurred(kpi.category, kpi.id);
                return (
                  <div
                    key={kpi.id}
                    className={`kpi-card ${blurred ? 'is-masked' : ''}`}
                    onClick={() => toggleManual(kpi.id)}
                    title="Click to toggle blur"
                  >
                    <span className="kpi-label">{kpi.label}</span>
                    <span className={`kpi-value ${blurred ? 'blur-mask' : ''}`}>
                      {kpi.value}
                    </span>
                    {blurred && <span className="peek-tooltip">Hover to Peek</span>}
                  </div>
                );
              })}
            </div>

            {/* Data Table */}
            <div className="dashboard-table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    {scenario.headers.map((h, idx) => (
                      <th
                        key={idx}
                        className={idx === 3 && columnMasked && shieldActive ? 'column-header-blurred' : ''}
                      >
                        {h} {idx === 3 && columnMasked && shieldActive && <span className="col-shield-badge">SHIELDED</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scenario.rows.map((row) => {
                    const c2Blur = isBlurred('pii', `${row.id}-c2`);
                    const c3Blur = isBlurred(activeScenario === 'aws' ? 'secrets' : 'pii', `${row.id}-c3`);
                    const c4Blur = isBlurred(activeScenario === 'aws' ? 'secrets' : (columnMasked ? 'column' : 'financials'), `${row.id}-c4`);

                    return (
                      <tr key={row.id}>
                        <td className="font-mono text-muted">{row.c1}</td>
                        <td onClick={() => toggleManual(`${row.id}-c2`)} className="clickable-cell">
                          <span className={c2Blur ? 'blur-mask' : ''}>{row.c2}</span>
                        </td>
                        <td onClick={() => toggleManual(`${row.id}-c3`)} className="clickable-cell">
                          <span className={c3Blur ? 'blur-mask' : ''}>{row.c3}</span>
                        </td>
                        <td onClick={() => toggleManual(`${row.id}-c4`)} className="clickable-cell">
                          <span className={c4Blur ? 'blur-mask' : ''}>{row.c4}</span>
                        </td>
                        <td>
                          <span className="status-pill" style={{ color: row.statusColor, borderColor: `${row.statusColor}40`, background: `${row.statusColor}15` }}>
                            ● {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
