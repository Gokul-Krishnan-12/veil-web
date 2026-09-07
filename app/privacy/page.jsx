import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — Veil Privacy Suite',
  description: 'Official Privacy Policy for Veil Chrome Extension and Veil Web. Transparent disclosure of our zero-telemetry architecture, local processing, and permission justifications.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'September 7, 2026';

  const permissions = [
    {
      name: 'storage',
      label: 'Local Storage',
      reason: 'Saves your user settings, blur strength, custom element selectors, regional blur coordinates, and website whitelist/blacklist preferences strictly on your local device. Data is never uploaded or synced to external servers.'
    },
    {
      name: 'activeTab',
      label: 'Active Tab Interaction',
      reason: 'Allows Veil to interact with the currently focused browser tab when you click the extension icon, press a keyboard shortcut, or launch the visual element selector.'
    },
    {
      name: 'scripting',
      label: 'Dynamic CSS & Script Injection',
      reason: 'Enables Veil to inject high-performance CSS blur filters over selected elements and insert real-time masking overlays during active screen sharing sessions.'
    },
    {
      name: 'tabs',
      label: 'Tab Lifecycle Awareness',
      reason: 'Monitors tab navigation and activation events to automatically reapply your saved blur preferences when pages reload and dismiss screen-share guards when sessions end.'
    },
    {
      name: 'alarms',
      label: 'Background Alarms',
      reason: 'Schedules low-frequency background tasks (such as checking Pro license status) without keeping background service workers running continuously, preserving system resources and battery life.'
    },
    {
      name: 'contextMenus',
      label: 'Right-Click Context Menu',
      reason: 'Adds convenient right-click options (like "Blur Selection" and "Blur Element") so you can obscure sensitive text or elements directly on any page without opening the popup.'
    },
    {
      name: '<all_urls> (Host Permission)',
      label: 'Universal Host Access',
      reason: 'Required because Veil operates as a universal privacy protector across any website you visit or screen-share (CRMs, dashboards, emails, banking portals, and video meetings) to inspect the DOM and apply blur filters in real time.'
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto 90px', padding: '0 24px', color: 'var(--text-main)' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          padding: '6px 16px',
          borderRadius: '9999px',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '16px'
        }}>
          <span>🛡️</span> Zero Telemetry • 100% Client-Side Processing
        </div>
        <h1 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
          Effective Date & Last Updated: <strong>{lastUpdated}</strong>
        </p>
      </div>

      {/* Summary Highlight Box */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(14, 165, 233, 0.05) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '48px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#e0e7ff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>💡</span> The 10-Second Summary
        </h2>
        <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '15px' }}>
          <strong>Veil does not collect, record, track, sell, or transmit any of your personal data or browsing history.</strong> All text scanning, regex pattern matching (emails, credit cards, passwords, phone numbers), and visual blurring happen <strong>100% locally in your browser memory</strong>. No website contents or keystrokes ever leave your device.
        </p>
      </div>

      {/* Main Content Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* Section 1 */}
        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
            1. Single Purpose Statement
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '15px' }}>
            Veil has a single, narrow, and transparent purpose: to provide real-time, on-screen privacy protection by detecting and blurring sensitive personal data (such as emails, passwords, credit cards, and phone numbers) and allowing custom element and regional area blurring during web browsing, screen sharing, and video recordings.
          </p>
        </section>

        {/* Section 2 */}
        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
            2. Data We Do NOT Collect
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '15px', marginBottom: '20px' }}>
            In compliance with the Chrome Web Store User Data Policy, we explicitly disclose that Veil <strong>does not collect or transmit</strong> any of the following data categories:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { title: 'Personally Identifiable Information', desc: 'No names, addresses, emails, phone numbers, or government IDs are collected.' },
              { title: 'Authentication & Passwords', desc: 'No credentials, security tokens, cookies, or session data are recorded or transmitted.' },
              { title: 'Financial & Card Details', desc: 'Credit cards and banking numbers are masked locally in the DOM and never stored or uploaded.' },
              { title: 'Web Browsing History', desc: 'URLs you visit, page titles, and timestamps are never logged, tracked, or sent to any server.' },
              { title: 'Keystrokes & Activity Logging', desc: 'No keyloggers, scroll monitoring, mouse click tracking, or analytics trackers are used.' },
              { title: 'Page Text & Media Content', desc: 'Webpage text and images are processed transiently in local RAM only to render blur overlays.' }
            ].map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '14px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#ef4444' }}>✕</span> {item.title}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
            3. Extension Permissions & Justifications
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '15px', marginBottom: '24px' }}>
            Veil requests only the minimal permissions required to fulfill its single purpose. Below is our complete disclosure:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {permissions.map((perm, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                padding: '18px 20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <code style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '3px 8px', borderRadius: '6px', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                    {perm.name}
                  </code>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: '#f8fafc' }}>
                    {perm.label}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  {perm.reason}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 */}
        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
            4. Local Storage & Device Data
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '15px', marginBottom: '16px' }}>
            Veil stores configuration preferences exclusively within your browser's sandboxed <code>chrome.storage.local</code> API. These include:
          </p>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.8, fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            <li>Your toggled PII categories (e.g., enable email blur, credit card blur)</li>
            <li>Custom CSS element selectors you have chosen to blur</li>
            <li>Coordinates of regional blur boxes on specific domains</li>
            <li>Domain whitelist and blacklist preferences</li>
            <li>Pro license key token and activation status</li>
          </ul>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '15px' }}>
            This data never leaves your computer. If you clear your extension data or uninstall Veil from Chrome, all stored settings are permanently deleted immediately.
          </p>
        </section>

        {/* Section 5 */}
        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
            5. Remote Code Policy
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '15px' }}>
            Veil strictly adheres to Google Chrome Manifest V3 policies. <strong>We do not execute remote code under any circumstances.</strong> All JavaScript code, WebRTC detection listeners, and CSS stylesheets are bundled locally within the extension package reviewed and approved by the Chrome Web Store.
          </p>
        </section>

        {/* Section 6 */}
        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
            6. Purchases & License Verification
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '15px', marginBottom: '16px' }}>
            When you purchase a Veil Pro or Enterprise license through our website:
          </p>
          <ul style={{ paddingLeft: '20px', lineHeight: 1.8, fontSize: '14px', color: 'var(--text-muted)' }}>
            <li>Payments are processed securely by our certified PCI-DSS payment gateways (Stripe / ExtensionPay). Veil never sees, stores, or handles your raw credit card numbers.</li>
            <li>License key verification queries our secure encrypted verification API to validate active seats. Only the cryptographic key string and a randomized client device ID are exchanged.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
            7. Chrome Web Store Compliance Certifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              'We do not sell or transfer user data to third parties, outside of the approved use cases.',
              'We do not use or transfer user data for purposes that are unrelated to the item single purpose.',
              'We do not use or transfer user data to determine creditworthiness or for lending purposes.'
            ].map((text, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1', fontSize: '14px' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {text}
              </div>
            ))}
          </div>
        </section>

        {/* Section 8 */}
        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
            8. Contact & Inquiries
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '15px', marginBottom: '16px' }}>
            If you have any questions about this Privacy Policy, our data protection commitments, or the operation of the Veil extension, please contact us:
          </p>
          <div style={{ color: 'var(--text-main)', fontSize: '14px', lineHeight: 1.8 }}>
            <div><strong>Veil Technologies Inc.</strong></div>
            <div>Official Website:{' '}
              <Link href="/" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>
                veil-web
              </Link>
            </div>
            <div>Documentation:{' '}
              <Link href="/docs" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>
                /docs
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
