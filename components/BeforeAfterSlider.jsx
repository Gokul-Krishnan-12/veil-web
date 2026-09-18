'use client';

import { useState } from 'react';

export default function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeTab, setActiveTab] = useState('slider'); // 'slider' | 'before' | 'after'

  return (
    <section className="before-after-section" id="comparison-slider">
      <div className="before-after-container">
        
        {/* Section Header */}
        <div className="section-head-center">
          <div className="story-badge-amber">
            <span className="pulse-dot"></span>
            <span>BEFORE & AFTER COMPARISON</span>
          </div>
          <h2 className="section-h2">
            The Split-Second Difference: <span className="serif-highlight">Exposed vs Shielded</span>
          </h2>
          <p className="section-sub">
            Drag the slider to see how Veil transforms raw sensitive variables into clean, camera-ready redacted UI.
          </p>

          {/* Quick View Switcher */}
          <div className="slider-mode-pill-bar">
            <button
              type="button"
              className={`slider-mode-pill ${activeTab === 'slider' ? 'active' : ''}`}
              onClick={() => { setActiveTab('slider'); setSliderPos(50); }}
            >
              ↔️ Interactive Split
            </button>
            <button
              type="button"
              className={`slider-mode-pill ${activeTab === 'before' ? 'active' : ''}`}
              onClick={() => { setActiveTab('before'); setSliderPos(100); }}
            >
              🚨 Raw Unmasked (100% Exposed)
            </button>
            <button
              type="button"
              className={`slider-mode-pill ${activeTab === 'after' ? 'active' : ''}`}
              onClick={() => { setActiveTab('after'); setSliderPos(0); }}
            >
              🛡️ Veil Masked (0ms Safe)
            </button>
          </div>
        </div>

        {/* Comparison Canvas */}
        <div className="comparison-viewport-wrap">
          <div className="comparison-box">
            
            {/* AFTER LAYER: PROTECTED (Background) */}
            <div className="comp-layer layer-safe">
              <div className="comp-tag-banner safe">
                <span>🛡️ VEIL SHIELD ACTIVE — 0ms Pre-Paint</span>
              </div>
              
              <div className="comp-screen-grid">
                <div className="comp-card-item">
                  <span className="card-item-title">Enterprise Customer</span>
                  <div className="comp-data-field">
                    <span className="data-lbl">Account:</span>
                    <span className="veil-masked">•••••••••••• Corp.</span>
                  </div>
                  <div className="comp-data-field">
                    <span className="data-lbl">Primary Email:</span>
                    <span className="veil-masked">•••••••@••••••••••••.com</span>
                  </div>
                  <div className="comp-data-field">
                    <span className="data-lbl">Direct Mobile:</span>
                    <span className="veil-masked">+1 (•••) •••-••••</span>
                  </div>
                </div>

                <div className="comp-card-item">
                  <span className="card-item-title">Financials & Billing</span>
                  <div className="comp-data-field">
                    <span className="data-lbl">Annual ARR:</span>
                    <span className="veil-masked font-bold">$•••••••• /yr</span>
                  </div>
                  <div className="comp-data-field">
                    <span className="data-lbl">Corporate Card:</span>
                    <span className="veil-masked">Visa ending in ••••</span>
                  </div>
                  <div className="comp-data-field">
                    <span className="data-lbl">Bank Routing:</span>
                    <span className="veil-masked">Chase #•••••••••</span>
                  </div>
                </div>

                <div className="comp-card-item">
                  <span className="card-item-title">API & Production Keys</span>
                  <div className="comp-data-field">
                    <span className="data-lbl">Stripe Secret:</span>
                    <span className="veil-masked font-mono">sk_live_••••••••••••••••••••••••</span>
                  </div>
                  <div className="comp-data-field">
                    <span className="data-lbl">Webhook Token:</span>
                    <span className="veil-masked font-mono">whsec_•••••••••••••••••••••••••</span>
                  </div>
                  <div className="comp-data-field">
                    <span className="data-lbl">OAuth Client:</span>
                    <span className="veil-masked font-mono">sec_auth_••••••••••••••••••••••</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BEFORE LAYER: UNPROTECTED (Clipped by Slider Pos) */}
            <div
              className="comp-layer layer-exposed"
              style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
            >
              <div className="comp-tag-banner exposed">
                <span>⚠️ RAW BROWSER SCREEN — DATA LEAK RISK</span>
              </div>

              <div className="comp-screen-grid">
                <div className="comp-card-item danger">
                  <span className="card-item-title">Enterprise Customer</span>
                  <div className="comp-data-field">
                    <span className="data-lbl">Account:</span>
                    <span className="token-danger">Globex Aerospace Corp.</span>
                  </div>
                  <div className="comp-data-field">
                    <span className="data-lbl">Primary Email:</span>
                    <span className="token-danger">cfo.contact@globex.aero</span>
                  </div>
                  <div className="comp-data-field">
                    <span className="data-lbl">Direct Mobile:</span>
                    <span className="token-danger">+1 (415) 892-4109</span>
                  </div>
                </div>

                <div className="comp-card-item danger">
                  <span className="card-item-title">Financials & Billing</span>
                  <div className="comp-data-field">
                    <span className="data-lbl">Annual ARR:</span>
                    <span className="token-danger font-bold">$240,000.00 /yr</span>
                  </div>
                  <div className="comp-data-field">
                    <span className="data-lbl">Corporate Card:</span>
                    <span className="token-danger">Visa 4111 8821 9912 0019</span>
                  </div>
                  <div className="comp-data-field">
                    <span className="data-lbl">Bank Routing:</span>
                    <span className="token-danger">Chase #892019842</span>
                  </div>
                </div>

                <div className="comp-card-item danger">
                  <span className="card-item-title">API & Production Keys</span>
                  <div className="comp-data-field">
                    <span className="data-lbl">Stripe Secret:</span>
                    <span className="token-danger font-mono">sk_live_9a8B7c6D5e4F3g2H1j0K</span>
                  </div>
                  <div className="comp-data-field">
                    <span className="data-lbl">Webhook Token:</span>
                    <span className="token-danger font-mono">whsec_5f6e7d8c9b0a1a2b3c4d</span>
                  </div>
                  <div className="comp-data-field">
                    <span className="data-lbl">OAuth Client:</span>
                    <span className="token-danger font-mono">sec_auth_981290312389127391</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Divider Line */}
            {activeTab === 'slider' && (
              <div
                className="comp-slider-line"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="comp-slider-button">
                  <span>‹ ›</span>
                </div>
              </div>
            )}

            {/* Hidden native input for touch / dragging */}
            {activeTab === 'slider' && (
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="comp-range-input"
                aria-label="Comparison slider between exposed and shielded data"
              />
            )}

          </div>
        </div>

        {/* 2 Bottom Callouts */}
        <div className="comp-callouts-grid">
          <div className="comp-callout red">
            <div className="callout-icon">✕</div>
            <div>
              <h4 className="callout-title">Without Veil: Manual Panic</h4>
              <p className="callout-desc">
                One accidental screen switch reveals customer NDA data or private revenue. Post-production video editing requires hours of tedious keyframing.
              </p>
            </div>
          </div>

          <div className="comp-callout green">
            <div className="callout-icon">✓</div>
            <div>
              <h4 className="callout-title">With Veil: Automated Peace of Mind</h4>
              <p className="callout-desc">
                Sensitive tokens are obfuscated synchronously in-memory before video frames are captured. Present freely on Google Meet, Zoom, or Loom.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
