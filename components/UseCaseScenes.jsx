'use client';

import { useState } from 'react';

const SCENES = [
  {
    id: 'sales-demo',
    title: 'Sales Engineers & Account Execs',
    roleTag: 'Live Customer Demos',
    icon: '💼',
    headline: 'Never leak Client A’s contract value while demoing to Client B.',
    problem: 'You share your screen to show your analytics suite. If a real client’s name or high ARR pops up, you’ve broken your NDA and torpedoed the deal.',
    solution: 'Veil automatically anonymizes customer names, transaction volumes, and company domains across your staging and production environments.',
    previewTitle: 'app.salesforce.com / Opportunity Pipeline',
    items: [
      { label: 'Client Name', raw: 'Globex Holdings Inc.', masked: '•••••••••••••••••' },
      { label: 'ACV / Annual Value', raw: '$420,000 / year', masked: '$•••••••• / year' },
      { label: 'Key Stakeholder Email', raw: 'cfo@globex-corp.com', masked: '••••@•••••••••••••••' }
    ]
  },
  {
    id: 'loom-creators',
    title: 'Loom & Video Creators',
    roleTag: 'Zero Post-Production Blur',
    icon: '🎬',
    headline: 'Record 10-minute tutorials without 2 hours of After Effects blur keyframing.',
    problem: 'One leaked API key or personal email in a 15-minute product walkthrough means re-recording the entire take or keyframing Gaussian blurs in Premiere.',
    solution: 'Record clean on take one. Veil masks all sensitive strings in the browser viewport prior to the screen recording stream capturing the frame.',
    previewTitle: 'loom.com/share / Product Architecture Deep Dive',
    items: [
      { label: 'Environment Variable', raw: 'DATABASE_URL="postgres://..."', masked: 'DATABASE_URL="postgres://••••••"' },
      { label: 'Auth Header', raw: 'Bearer eyJhbGciOiJIUzI1Ni...', masked: 'Bearer •••••••••••••••••••••••••' },
      { label: 'Personal Workspace', raw: 'gokul@private-domain.me', masked: '•••••@••••••••••••••' }
    ]
  },
  {
    id: 'support-engineers',
    title: 'Support & Success Teams',
    roleTag: 'GDPR & SOC2 Compliance',
    icon: '🎧',
    headline: 'Troubleshoot live customer accounts without violating GDPR.',
    problem: 'When jumping on screen shares with customers to debug issues, internal admin dashboards frequently display personal phone numbers, physical addresses, and IP logs.',
    solution: 'Veil automatically shields user PII with smart regex detectors, keeping your team strictly SOC2 & GDPR compliant during live screen share sessions.',
    previewTitle: 'admin.intercom.com / Customer Ticket #49102',
    items: [
      { label: 'User Home Address', raw: '742 Evergreen Terr, Springfield', masked: '••••••••••••••••••••••••••••••' },
      { label: 'Direct Cell Phone', raw: '+1 (555) 019-2831', masked: '+1 (•••) •••-••••' },
      { label: 'User IP Address', raw: '198.51.100.42 (ISP: Comcast)', masked: '•••.••.•••.•• (ISP: •••••••)' }
    ]
  },
  {
    id: 'founders-investors',
    title: 'Founders & Execs',
    roleTag: 'Board & Investor Decks',
    icon: '📊',
    headline: 'Pitch investors live metrics without displaying sensitive cap table data.',
    problem: 'Walking an angel investor through your live Stripe charts or Mercury bank balance shouldn’t expose exact payroll sums or confidential runway accounts.',
    solution: 'Toggle custom blur masks with 1 click so you can show revenue trajectory charts without revealing raw banking credentials or vendor names.',
    previewTitle: 'app.mercury.com / Treasury & Operating Accounts',
    items: [
      { label: 'Operating Checking', raw: '$842,109.50', masked: '$••••••••••' },
      { label: 'Routing / Wire Number', raw: '021000021 / Acct 9812401', masked: '••••••••• / Acct •••••••' },
      { label: 'Payroll Outflow', raw: '$64,200 / semi-monthly', masked: '$•••••• / semi-monthly' }
    ]
  }
];

export default function UseCaseScenes() {
  const [activeTab, setActiveTab] = useState('sales-demo');
  const scene = SCENES.find(s => s.id === activeTab) || SCENES[0];

  return (
    <section className="use-cases-section" id="use-cases">
      <div className="use-cases-container">
        
        {/* Header */}
        <div className="section-head-center">
          <div className="story-badge-amber">
            <span className="pulse-dot"></span>
            <span>BUILT FOR HIGH-STAKES TEAMS</span>
          </div>
          <h2 className="section-h2">
            Who Needs Veil? <span className="serif-highlight">Anyone Who Shares Screens</span>
          </h2>
          <p className="section-sub">
            Whether you&apos;re closing enterprise deals, recording video guides, or debugging live customer issues.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="usecase-tab-bar">
          {SCENES.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveTab(s.id)}
              className={`usecase-tab-btn ${activeTab === s.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{s.icon}</span>
              <span className="tab-label">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Immersive Scene Card */}
        <div className="scene-display-card">
          
          {/* Left Narrative Column */}
          <div className="scene-narrative-col">
            <div className="scene-role-badge">
              <span>{scene.icon}</span>
              <span>{scene.roleTag}</span>
            </div>

            <h3 className="scene-headline">{scene.headline}</h3>

            <div className="scene-pain-box">
              <div className="pain-label">⚠️ The Dangerous Risk</div>
              <p className="pain-desc">{scene.problem}</p>
            </div>

            <div className="scene-solution-box">
              <div className="solution-label">🛡️ How Veil Protects You</div>
              <p className="solution-desc">{scene.solution}</p>
            </div>
          </div>

          {/* Right Simulated Dashboard Viewport */}
          <div className="scene-viewport-col">
            <div className="scene-browser-frame">
              <div className="scene-browser-bar">
                <div className="browser-traffic-lights">
                  <span className="traffic-dot red"></span>
                  <span className="traffic-dot yellow"></span>
                  <span className="traffic-dot green"></span>
                </div>
                <div className="scene-url-pill">
                  <span>🔒</span>
                  <span>{scene.previewTitle}</span>
                </div>
              </div>

              <div className="scene-browser-body">
                <div className="scene-shield-status">
                  <span className="status-shield-icon">🛡️</span>
                  <span>Veil Active · 3 Rules Injected</span>
                </div>

                <div className="scene-items-list">
                  {scene.items.map((item, idx) => (
                    <div key={idx} className="scene-item-row">
                      <div className="scene-item-meta">
                        <span className="scene-item-label">{item.label}</span>
                        <span className="scene-item-shielded-tag">Protected</span>
                      </div>
                      <div className="scene-token-preview">
                        <span className="token-masked-amber">{item.masked}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
