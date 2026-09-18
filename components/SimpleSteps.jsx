'use client';

export default function SimpleSteps() {
  const steps = [
    {
      num: '01',
      title: 'Pin Extension to Chrome',
      subtitle: 'Zero Sign-Up Required',
      description: 'Install Veil in 1 click from the Chrome Web Store. No account creation, no credit card required to start, and zero cloud configuration.',
      tag: '1-Click Install',
      preview: (
        <div className="step-preview-box">
          <div className="step-toolbar-mock">
            <span className="step-url-tab">chrome://extensions</span>
            <div className="step-toolbar-icons">
              <span className="step-ext-pin active">🛡️ Veil (Active)</span>
              <span className="step-puzzle">🧩</span>
            </div>
          </div>
          <div className="step-popup-card">
            <div className="step-popup-header">
              <span className="popup-brand">VEIL SHIELD</span>
              <span className="popup-switch on">ON</span>
            </div>
            <div className="step-popup-stat">
              <span className="stat-sm-lbl">Protection Mode</span>
              <span className="stat-sm-val">Smart Auto-Detect Active</span>
            </div>
          </div>
        </div>
      )
    },
    {
      num: '02',
      title: 'DOM Scanned in 0.2ms',
      subtitle: 'Real-Time Heuristic Defense',
      description: 'Veil immediately inspects DOM nodes for credit cards, secret keys, emails, customer records, and financial numbers before painting to display.',
      tag: '0ms Pre-Paint',
      preview: (
        <div className="step-preview-box">
          <div className="step-code-scanner">
            <div className="scanner-line-sweep"></div>
            <div className="scanner-line">
              <span className="scan-token-type">MATCH: sk_live_...</span>
              <span className="scan-badge-amber">DETECTED</span>
            </div>
            <div className="scanner-line">
              <span className="scan-token-type">MATCH: 4111-xxxx-xxxx-9921</span>
              <span className="scan-badge-amber">DETECTED</span>
            </div>
            <div className="scanner-line">
              <span className="scan-token-type">MATCH: customer_mrr: $148k</span>
              <span className="scan-badge-amber">DETECTED</span>
            </div>
          </div>
        </div>
      )
    },
    {
      num: '03',
      title: 'Share Screen with Zero Fear',
      subtitle: 'Present, Record, Stream',
      description: 'Host your customer demo, stream to thousands, or record a Loom video. Sensitive values remain blurred on-screen in real time.',
      tag: 'Safe Broadcast',
      preview: (
        <div className="step-preview-box">
          <div className="step-meeting-mock">
            <div className="meeting-head">
              <span className="meeting-rec-pill">● REC 04:12</span>
              <span className="meeting-participants">👥 14 Attendees</span>
            </div>
            <div className="meeting-screen-sample">
              <div className="shielded-tile-sample">
                <span>Revenue ARR:</span>
                <span className="blur-sample-tag">$••••••••</span>
              </div>
              <div className="shielded-tile-sample">
                <span>Customer PII:</span>
                <span className="blur-sample-tag">•••••• ••••••</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="simple-steps-section" id="how-it-works">
      <div className="steps-container">
        
        {/* Header */}
        <div className="section-head-center">
          <div className="story-badge-amber">
            <span className="pulse-dot"></span>
            <span>THREE SIMPLE STEPS</span>
          </div>
          <h2 className="section-h2">
            From Install to Screen Share <span className="serif-highlight">in 30 Seconds</span>
          </h2>
          <p className="section-sub">
            No complex setup, no DNS routing, no team onboarding friction. Just instant, client-side peace of mind.
          </p>
        </div>

        {/* 3 Step Progression Cards */}
        <div className="steps-grid">
          {steps.map((step) => (
            <div key={step.num} className="step-card">
              
              {/* Step Number & Tag */}
              <div className="step-card-head">
                <span className="step-number-display">{step.num}</span>
                <span className="step-pill-tag">{step.tag}</span>
              </div>

              {/* Title & Description */}
              <h3 className="step-title">{step.title}</h3>
              <div className="step-subtitle">{step.subtitle}</div>
              <p className="step-desc">{step.description}</p>

              {/* Visual Preview Box */}
              <div className="step-preview-wrap">
                {step.preview}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
