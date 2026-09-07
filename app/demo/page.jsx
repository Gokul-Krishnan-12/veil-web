'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { initDemoSandbox } from '@/components/demo-engine';

export default function DemoPage() {
  useEffect(() => {
    const cleanup = initDemoSandbox();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Simulated WebRTC Screen Sharing Status Bar */}
      <div id="screenshare-status-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '16px', animation: 'pulse 1.5s infinite' }}>🔴</span>
          <span><strong>Live Screen Sharing Active</strong> (Google Meet / Zoom presentation simulated) — All sensitive PII automatically veiled.</span>
        </div>
        <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.3)', padding: '3px 8px', borderRadius: '4px' }}>
          Click 📡 on toolbar to Stop
        </span>
      </div>

      {/* Interactive Sandbox Notification Toast */}
      <div id="sandbox-toast">Notification</div>

      {/* Selection Ring & Tag Badge for Element Picker */}
      <div id="screenshield-selection-ring">
        <div id="screenshield-tag-badge">Click to Blur</div>
      </div>

      {/* Area Drag Preview Box */}
      <div id="screenshield-drag-preview"></div>

      {/* Floating Text Selection Blur Pill */}
      <div id="screenshield-text-blur-pill">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
        <span>Blur Selection</span>
      </div>

      {/* High-Precision Floating Tooltip Container */}
      <div id="screenshield-dock-tooltip"></div>

      {/* Floating Draggable Control Dock (Identical to Chrome Extension) */}
      <div id="screenshield-floating-dock">
        {/* Drag Handle */}
        <div className="dock-drag-handle" id="dock-drag-handle" title="Drag toolbar anywhere">
          <svg viewBox="0 0 24 24">
            <circle cx="8" cy="6" r="1.5"/><circle cx="16" cy="6" r="1.5"/>
            <circle cx="8" cy="12" r="1.5"/><circle cx="16" cy="12" r="1.5"/>
            <circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/>
          </svg>
        </div>

        {/* Dock Brand */}
        <div className="dock-brand" title="Veil Live Sandbox">
          <img className="dock-logo-img" src="/assets/icon32.png" alt="Veil" />
          <span className="dock-title">Veil</span>
          <span className="dock-badge">PRO EXTENSION</span>
        </div>

        {/* 1. Element Picker Button */}
        <button
          className="dock-btn"
          id="dock-btn-picker"
          data-title="Element Picker"
          data-shortcut="Alt+Shift+B"
          data-desc="Click any element, card, or Shift+click table row to blur"
          title="Element Picker"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="22" y1="12" x2="18" y2="12"/>
            <line x1="6" y1="12" x2="2" y2="12"/>
            <line x1="12" y1="6" x2="12" y2="2"/>
            <line x1="12" y1="22" x2="12" y2="18"/>
          </svg>
        </button>

        {/* 2. Blur Selected Text Button */}
        <button
          className="dock-btn"
          id="dock-btn-select-blur"
          data-title="Blur Selected Text"
          data-shortcut="Alt+Shift+S"
          data-desc="Highlight text and click floating pill to blur"
          title="Blur Selected Text"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 7V4h16v3"/>
            <path d="M12 4v16"/>
            <path d="M8 20h8"/>
            <circle cx="18" cy="16" r="3.5" fill="currentColor" fillOpacity="0.35"/>
          </svg>
        </button>

        {/* 3. Regional Area Blur Box Button */}
        <button
          className="dock-btn"
          id="dock-btn-area"
          data-title="Area Blur Box"
          data-shortcut="Alt+Shift+A"
          data-desc="Click & drag to draw a regional blur rectangle anywhere"
          title="Area Blur Box"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 4"/>
          </svg>
        </button>

        {/* 4. Automated PII Masking Button */}
        <button
          className="dock-btn"
          id="dock-btn-pii"
          data-title="Automated PII Masking"
          data-shortcut="PRO"
          data-desc="Auto-masks emails, cards, ARR, and sk_live_* secrets"
          title="Automated PII Masking"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </button>

        {/* 5. WebRTC Screen Share Simulator Button */}
        <button
          className="dock-btn"
          id="dock-btn-screenshare"
          data-title="Simulate Screen Share"
          data-shortcut="Meet/Zoom"
          data-desc="Simulates sharing display to test auto-masking"
          title="Simulate Screen Share"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4.93 19.07A10 10 0 0 1 12 2a10 10 0 0 1 7.07 17.07"/>
            <path d="M7.76 16.24A6 6 0 0 1 12 6a6 6 0 0 1 4.24 10.24"/>
            <circle cx="12" cy="14" r="2" fill="currentColor"/>
          </svg>
        </button>

        <div className="dock-divider"></div>

        {/* Active Blur Counter */}
        <span className="dock-counter" id="dock-blur-counter" style={{ display: 'none' }}>0</span>

        {/* Master Shield Clear All Button */}
        <button
          className="dock-btn dock-btn-clear"
          id="dock-btn-clear"
          data-title="Clear All Blurs"
          data-shortcut="Space"
          data-desc="Instant 0ms unblur to view screen, click again to restore"
          title="Clear / Restore All"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        </button>

        {/* Close Button */}
        <button className="dock-close" id="dock-btn-close" title="Minimize Toolbar">
          &times;
        </button>
      </div>

      {/* Main Sandbox Dashboard Layout */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 140px', padding: '0 24px' }}>
        {/* Dashboard Header */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '24px 32px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src="/assets/icon48.png" alt="Veil Logo" style={{ width: '44px', height: '44px', borderRadius: '12px' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Veil — Live Extension Sandbox</h1>
                <span className="pill-badge emerald" style={{ fontSize: '11px' }}>Extension Simulator</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                Synthetic customer data, PCI-DSS credentials, and WebRTC streaming test triggers.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button id="btn-simulate-screenshare" className="btn btn-secondary btn-sm">
              <span>📡</span> Test Screen Share Detection
            </button>
            <Link href="/checkout?tier=pro" className="btn btn-primary btn-sm">
              Unlock Pro ($29)
            </Link>
          </div>
        </div>

        {/* Workflow Instructions Banner */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '28px',
          fontSize: '13px',
          color: '#c7d2fe',
          lineHeight: 1.7
        }}>
          <div style={{ fontWeight: 700, marginBottom: '6px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚡</span> Interactive Testing Guide:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '8px' }}>
            <div>
              <strong>1. Floating Toolbar:</strong> Drag the pill dock at the bottom anywhere on your screen.
            </div>
            <div>
              <strong>2. Element Picker:</strong> Click the target icon on the toolbar. Hover any element to see the selection ring. Hold <kbd>Shift</kbd> to blur a whole table row!
            </div>
            <div>
              <strong>3. Automated PII:</strong> Click the shield icon on the toolbar to auto-mask emails, cards, and secrets.
            </div>
            <div>
              <strong>4. Master Switch:</strong> Click the eye-slash icon to instantly clear all blurs, then click again to restore.
            </div>
          </div>
        </div>

        {/* Confidential Credentials Strip */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '12px',
          padding: '16px 24px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🔐</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confidential Staging Environment</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Contains production Stripe API secret keys and live billing credentials</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#f87171', textTransform: 'uppercase' }}>Production API Secret</div>
              <div className="pii-sample" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff', fontSize: '13px', marginTop: '2px' }}>
                sk_live_99a8x003b7194f
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div className="sandbox-card">
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', fontBold: 600 }}>Total ARR Under Management</div>
            <div className="pii-sample" style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0', color: '#34d399' }}>$4,890,250</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>+24.8% YoY Enterprise Growth</div>
          </div>

          <div className="sandbox-card">
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', fontBold: 600 }}>Lead Compliance Officer</div>
            <div className="pii-sample" style={{ fontSize: '18px', fontWeight: 700, margin: '8px 0', color: '#ffffff' }}>sarah.connor@acme-corp.com</div>
            <div className="pii-sample" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Direct Desk: +1 (415) 890-3321</div>
          </div>

          <div className="sandbox-card">
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', fontBold: 600 }}>Settlement Payout Card</div>
            <div className="pii-sample" style={{ fontSize: '20px', fontWeight: 700, margin: '8px 0', fontFamily: 'var(--font-mono)', color: '#ffffff' }}>4532 •••• •••• 9812</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Exp: 09/29 • Visa Signature Commercial</div>
          </div>
        </div>

        {/* Customer Records Table */}
        <div className="table-wrapper" style={{ marginBottom: '32px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Confidential Enterprise Customer Registry</h2>
                <span className="status-pill active" style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
                  <span className="status-dot"></span> 4 Accounts
                </span>
              </div>
              <p style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '3px' }}>
                Live production account ledger. Click any cell to test Element Picker, or hold <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>Shift</kbd> to blur the entire row.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="text"
                id="demo-table-search"
                placeholder="Search accounts or emails..."
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '999px',
                  padding: '7px 16px',
                  color: '#fff',
                  fontSize: '12.5px',
                  outline: 'none',
                  width: '220px'
                }}
              />
              <span className="pill-badge" style={{ fontSize: '11px' }}>Shift+Click: Whole Row</span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" id="sandbox-customer-table">
              <thead>
                <tr>
                  <th>Customer Organization</th>
                  <th>Billing Contact</th>
                  <th>Payment Method</th>
                  <th>Contract Deal Value</th>
                  <th>Account Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>GX</div>
                      <div>
                        <strong style={{ color: '#ffffff', fontSize: '13px' }}>Globex Corporation</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>globex-corp.io</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#818cf8', fontSize: '12px' }}>✉</span>
                      <span className="pii-sample">finance@globex-corp.io</span>
                    </div>
                  </td>
                  <td>
                    <span className="pii-sample" style={{ fontFamily: 'var(--font-mono)' }}>
                      💳 5424 •••• •••• 1092
                    </span>
                  </td>
                  <td>
                    <span className="pii-sample" style={{ color: '#34d399', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                      $180,000 / yr
                    </span>
                  </td>
                  <td>
                    <span className="status-badge active">Active</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>IN</div>
                      <div>
                        <strong style={{ color: '#ffffff', fontSize: '13px' }}>Initech Systems</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>initech.com</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#818cf8', fontSize: '12px' }}>✉</span>
                      <span className="pii-sample">peter.gibbons@initech.com</span>
                    </div>
                  </td>
                  <td>
                    <span className="pii-sample" style={{ fontFamily: 'var(--font-mono)' }}>
                      💳 4111 •••• •••• 8820
                    </span>
                  </td>
                  <td>
                    <span className="pii-sample" style={{ color: '#34d399', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                      $95,000 / yr
                    </span>
                  </td>
                  <td>
                    <span className="status-badge active">Active</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.2)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>UB</div>
                      <div>
                        <strong style={{ color: '#ffffff', fontSize: '13px' }}>Umbrella Bio Labs</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>umbrellalabs.org</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#818cf8', fontSize: '12px' }}>✉</span>
                      <span className="pii-sample">security@umbrellalabs.org</span>
                    </div>
                  </td>
                  <td>
                    <span className="pii-sample" style={{ fontFamily: 'var(--font-mono)' }}>
                      💳 3782 •••••• 49102
                    </span>
                  </td>
                  <td>
                    <span className="pii-sample" style={{ color: '#34d399', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                      $320,000 / yr
                    </span>
                  </td>
                  <td>
                    <span className="status-badge active">Active</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>WE</div>
                      <div>
                        <strong style={{ color: '#ffffff', fontSize: '13px' }}>Wayne Enterprises</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>wayneenterprises.com</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#818cf8', fontSize: '12px' }}>✉</span>
                      <span className="pii-sample">bwayne@wayneenterprises.com</span>
                    </div>
                  </td>
                  <td>
                    <span className="pii-sample" style={{ fontFamily: 'var(--font-mono)' }}>
                      💳 4000 •••• •••• 1234
                    </span>
                  </td>
                  <td>
                    <span className="pii-sample" style={{ color: '#34d399', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                      $540,000 / yr
                    </span>
                  </td>
                  <td>
                    <span className="status-badge active">Active</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Multi-Div Hierarchy Text Selection Test Card */}
        <div className="sandbox-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>DOM Hierarchy Integrity Test (Multi-Div Text Selection)</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Highlight any text across the boxes below to test text selection blur. A floating pill will appear allowing you to blur just the highlighted words without altering surrounding layout.
          </p>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px', padding: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '8px', fontSize: '13px', lineHeight: 1.6 }}>
                <strong style={{ color: '#a5b4fc', display: 'block', marginBottom: '6px' }}>Internal Security Audit Log</strong>
                Security Token <span className="pii-sample">sk_live_99a8x003b7194f</span> was rotated on 2026-09-01 by <span className="pii-sample">devops@acme-corp.com</span>. Verified zero leaks during Google Meet client demo.
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '8px', fontSize: '13px', lineHeight: 1.6 }}>
                <strong style={{ color: '#a5b4fc', display: 'block', marginBottom: '6px' }}>Settlement Wire Instructions</strong>
                Wiring account routing <span className="pii-sample">021000021</span> account <span className="pii-sample">992837102</span> at Silicon Valley Reserve Bank. Destination verified for Acme Financial Technologies.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
