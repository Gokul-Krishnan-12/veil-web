'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ScrollStoryHero() {
  const containerRef = useRef(null);
  const [activePhase, setActivePhase] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [detectedCount, setDetectedCount] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const phases = [
    {
      id: 0,
      label: '01. Raw Screen',
      title: 'The Unfiltered Dashboard',
      subtitle: 'Real customer data, API keys, and MRR exposed in plain sight.',
      tag: '100% EXPOSED'
    },
    {
      id: 1,
      label: '02. Live Scan',
      title: 'Sweeping the DOM Tree',
      subtitle: 'Analyzing text nodes, inputs, and attributes locally at 0ms latency.',
      tag: '0ms SCANNING'
    },
    {
      id: 2,
      label: '03. 17 Items Found',
      title: 'Vulnerabilities Identified',
      subtitle: 'Customer emails, Stripe secret keys, MRR, and bank routing numbers.',
      tag: '17 LEAKS FOUND'
    },
    {
      id: 3,
      label: '04. Screen Share Trigger',
      title: 'The High-Stakes Moment',
      subtitle: 'About to hit "Share Screen" on Zoom or record a Loom video.',
      tag: 'ZOOM / LOOM ACTIVE'
    },
    {
      id: 4,
      label: '05. Shield Activated',
      title: 'Instant Pre-Paint Redaction',
      subtitle: 'Pre-paint CSS injection replaces sensitive tokens with frosted veils.',
      tag: '0.0ms SHIELD'
    },
    {
      id: 5,
      label: '06. Safe to Share',
      title: 'Zero Outbound Bytes. Total Peace of Mind.',
      subtitle: 'You present freely. Your clients and auditors never see sensitive data.',
      tag: '100% PROTECTED'
    }
  ];

  // Scroll listener for true scroll-driven forward & backward step progression
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const navOffset = 58;
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      // Distance scrolled through the pinned track
      const scrolled = -rect.top + navOffset;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      setScrollPercent(Math.round(progress * 100));

      // Calculate phase index (0 to 5)
      const phaseIndex = Math.min(5, Math.floor(progress * 6));
      setActivePhase(phaseIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Jump directly to phase on button click
  const jumpToPhase = (phaseIndex) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const totalScrollable = rect.height - window.innerHeight;
    const targetScroll = containerTop - 58 + ((phaseIndex + 0.1) / 6) * totalScrollable;
    window.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
  };

  // Handle counter animation based on phase
  useEffect(() => {
    if (activePhase >= 2 && activePhase < 4) {
      let count = 0;
      const interval = setInterval(() => {
        count += 1;
        if (count >= 17) {
          setDetectedCount(17);
          clearInterval(interval);
        } else {
          setDetectedCount(count);
        }
      }, 25);
      return () => clearInterval(interval);
    } else if (activePhase >= 4) {
      setDetectedCount(0);
    } else {
      setDetectedCount(0);
    }
  }, [activePhase]);

  // Trigger scan line animation on phase 1
  useEffect(() => {
    if (activePhase === 1) {
      setIsScanning(true);
      const timer = setTimeout(() => setIsScanning(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [activePhase]);

  const currentPhaseData = phases[activePhase] || phases[0];

  return (
    <div ref={containerRef} className="scroll-story-track">
      <div className="scroll-story-viewport">
        
        {/* Compact Pinned Header */}
        <div className="story-compact-header">
          <div className="story-badge-amber">
            <span className="pulse-dot"></span>
            <span>INTERACTIVE PROTECTION SEQUENCE</span>
          </div>

          <h2 className="story-pinned-title">
            What if your browser knew <span className="serif-highlight">what not to share?</span>
          </h2>

          <p className="story-pinned-sub">
            Scroll down to advance through the live security sequence. Scroll up to reverse.
          </p>

          {/* Stepper Pills with Progress Line */}
          <div className="story-stepper-wrap">
            <div className="story-phase-nav">
              {phases.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => jumpToPhase(p.id)}
                  className={`story-phase-btn ${activePhase === p.id ? 'active' : activePhase > p.id ? 'passed' : ''}`}
                >
                  <span className="btn-phase-num">{p.id + 1}</span>
                  <span className="btn-phase-name">{p.label.split('. ')[1]}</span>
                </button>
              ))}
            </div>

            {/* Micro Progress Bar */}
            <div className="story-progress-track">
              <div
                className="story-progress-fill"
                style={{ width: `${Math.max(8, ((activePhase + 1) / 6) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Cinematic Browser Stage */}
        <div className="story-browser-stage">
          
          {/* Ambient Glow */}
          <div className={`story-stage-glow ${activePhase >= 4 ? 'safe' : activePhase >= 2 ? 'warning' : 'amber'}`}></div>

          <div className="story-browser-window">
            
            {/* Window Chrome Bar */}
            <div className="story-browser-bar">
              <div className="browser-traffic-lights">
                <span className="traffic-dot red"></span>
                <span className="traffic-dot yellow"></span>
                <span className="traffic-dot green"></span>
              </div>

              <div className="browser-url-pill">
                <span className="url-lock">🔒</span>
                <span className="url-host">dashboard.stripe.com</span>
                <span className="url-path">/v1/customers/cus_98xN2</span>
              </div>

              {/* Status Indicator */}
              <div className="browser-status-slot">
                {activePhase === 3 && (
                  <div className="screen-share-alert-pill animate-pulse">
                    <span className="rec-dot"></span>
                    <span>LIVE SCREEN SHARE ACTIVE</span>
                  </div>
                )}
                {activePhase >= 4 && (
                  <div className="veil-active-badge">
                    <span className="veil-shield-icon">🛡️</span>
                    <span>VEIL SHIELD 0ms ACTIVE</span>
                  </div>
                )}
                {activePhase < 3 && (
                  <div className="veil-idle-badge">
                    <span className="amber-idle-dot"></span>
                    <span>DOM MONITOR READY</span>
                  </div>
                )}
              </div>
            </div>

            {/* Browser Content Viewport */}
            <div className="story-browser-content">
              
              {/* Animated Scan Sweep Line */}
              {(activePhase === 1 || isScanning) && (
                <div className="story-scan-beam">
                  <div className="scan-line-head"></div>
                  <div className="scan-trail"></div>
                </div>
              )}

              {/* HUD Banner */}
              <div className="story-hud-banner">
                <div className="hud-left">
                  <span className="hud-phase-label">STATE {activePhase + 1}/6:</span>
                  <strong className="hud-phase-title">{currentPhaseData.title}</strong>
                  <span className="hud-phase-sub">{currentPhaseData.subtitle}</span>
                </div>

                <div className="hud-right">
                  {activePhase >= 2 && activePhase < 4 && (
                    <div className="hud-counter-box danger">
                      <span className="counter-num">{detectedCount}</span>
                      <span className="counter-lbl">LEAKS DETECTED</span>
                    </div>
                  )}
                  {activePhase >= 4 && (
                    <div className="hud-counter-box safe">
                      <span className="counter-num">0</span>
                      <span className="counter-lbl">EXPOSED (100% SHIELDED)</span>
                    </div>
                  )}
                  {activePhase < 2 && (
                    <div className="hud-counter-box neutral">
                      <span className="counter-num">SCAN</span>
                      <span className="counter-lbl">STANDBY</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Realistic Stripe Dashboard UI */}
              <div className="mock-stripe-app">
                
                {/* Header Row */}
                <div className="mock-header-row">
                  <div>
                    <span className="mock-badge">Enterprise Customer</span>
                    <h3 className="mock-org-name">Acme Global Technologies Inc.</h3>
                  </div>
                  <div className="mock-header-stats">
                    <div className="stat-card">
                      <span className="stat-label">Monthly Recurring Revenue</span>
                      <div className={`token-val ${activePhase >= 4 ? 'veil-masked' : activePhase >= 2 ? 'token-danger' : ''}`}>
                        {activePhase >= 4 ? '$••••••••' : '$148,920.00'}
                      </div>
                    </div>
                    <div className="stat-card hide-mobile-stat">
                      <span className="stat-label">Live API Requests</span>
                      <div className="stat-val">2.4M req/day</div>
                    </div>
                  </div>
                </div>

                {/* Main Data Grid */}
                <div className="mock-grid">
                  
                  {/* Customer Details Box */}
                  <div className="mock-box">
                    <div className="mock-box-title">Primary Billing & Contact</div>
                    
                    <div className="mock-field-group">
                      <span className="field-lbl">Customer Name</span>
                      <span className={`field-val ${activePhase >= 4 ? 'veil-masked' : activePhase >= 2 ? 'token-danger' : ''}`}>
                        {activePhase >= 4 ? '•••••••• ••••••••' : 'Sarah Jenkins (VP Ops)'}
                      </span>
                    </div>

                    <div className="mock-field-group">
                      <span className="field-lbl">Billing Email Address</span>
                      <span className={`field-val ${activePhase >= 4 ? 'veil-masked' : activePhase >= 2 ? 'token-danger' : ''}`}>
                        {activePhase >= 4 ? '••••••••••••••••••••' : 's.jenkins@acmeglobal.corp'}
                      </span>
                    </div>

                    <div className="mock-field-group">
                      <span className="field-lbl">Direct Phone & Card</span>
                      <span className={`field-val ${activePhase >= 4 ? 'veil-masked' : activePhase >= 2 ? 'token-danger' : ''}`}>
                        {activePhase >= 4 ? '•••-•••-•••• · Visa ••••' : '+1 (415) 892-4109 · Visa 4921 (08/29)'}
                      </span>
                    </div>
                  </div>

                  {/* Secret Keys & Infrastructure Box */}
                  <div className="mock-box">
                    <div className="mock-box-title">Security & Production Credentials</div>
                    
                    <div className="mock-field-group">
                      <span className="field-lbl">Production Secret Key</span>
                      <div className={`token-code ${activePhase >= 4 ? 'veil-masked' : activePhase >= 2 ? 'token-danger' : ''}`}>
                        {activePhase >= 4 ? 'sk_live_••••••••••••••••••••' : 'sk_live_9a8B7c6D5e4F3g2H1j0K'}
                      </div>
                    </div>

                    <div className="mock-field-group">
                      <span className="field-lbl">Webhook Endpoint Secret</span>
                      <div className={`token-code ${activePhase >= 4 ? 'veil-masked' : activePhase >= 2 ? 'token-danger' : ''}`}>
                        {activePhase >= 4 ? 'whsec_••••••••••••••••••••' : 'whsec_5f6e7d8c9b0a1a2b3c4d'}
                      </div>
                    </div>

                    <div className="mock-field-group">
                      <span className="field-lbl">Payout Settlement Account</span>
                      <span className={`field-val ${activePhase >= 4 ? 'veil-masked' : activePhase >= 2 ? 'token-danger' : ''}`}>
                        {activePhase >= 4 ? 'JPMorgan Chase (Acct ••••••••)' : 'JPMorgan Chase (Acct 8923019842)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent High Value Payouts */}
                <div className="mock-box mt-2">
                  <div className="mock-box-title">Recent High-Value Payouts & Transfers</div>
                  <div className="mock-table">
                    <div className="mock-table-row header">
                      <span>Transaction ID</span>
                      <span>Recipient</span>
                      <span>Amount</span>
                      <span>Status</span>
                    </div>
                    <div className="mock-table-row">
                      <span className="mono-sub">tx_89127491</span>
                      <span className={activePhase >= 4 ? 'veil-masked' : activePhase >= 2 ? 'token-danger' : ''}>
                        {activePhase >= 4 ? '•••••• LLC' : 'Vortex Cloud Inc.'}
                      </span>
                      <span className={activePhase >= 4 ? 'veil-masked font-bold' : activePhase >= 2 ? 'token-danger font-bold' : 'font-bold'}>
                        {activePhase >= 4 ? '$••••••' : '$42,500.00'}
                      </span>
                      <span className="badge-paid">Succeeded</span>
                    </div>
                    <div className="mock-table-row">
                      <span className="mono-sub">tx_89127492</span>
                      <span className={activePhase >= 4 ? 'veil-masked' : activePhase >= 2 ? 'token-danger' : ''}>
                        {activePhase >= 4 ? '••••••••••••••••' : 'Northstar Media Group'}
                      </span>
                      <span className={activePhase >= 4 ? 'veil-masked font-bold' : activePhase >= 2 ? 'token-danger font-bold' : 'font-bold'}>
                        {activePhase >= 4 ? '$••••••' : '$19,800.00'}
                      </span>
                      <span className="badge-paid">Succeeded</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Actions Bar */}
            <div className="story-browser-footer">
              <div className="footer-mode-text">
                {activePhase >= 4 ? (
                  <span className="text-safe-glow">🛡️ All sensitive PII & credentials obfuscated in 0.0ms. Safe for public screen-sharing.</span>
                ) : activePhase >= 2 ? (
                  <span className="text-danger-glow">⚠️ 17 PII, Secret Key, and Revenue tokens exposed in plain DOM text.</span>
                ) : (
                  <span>Scroll down to step through the live DOM protection sequence.</span>
                )}
              </div>

              <div className="footer-actions">
                <Link href="/pricing" className="btn-amber-sm">
                  Get Veil for Chrome &rarr;
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

