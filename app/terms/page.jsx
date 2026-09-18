import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — Veil Privacy Suite',
  description: 'Official Terms of Service for Veil Chrome Extension and Veil Web. Transparent software licensing, usage terms, and client-side processing warranties.',
};

export default function TermsOfServicePage() {
  const lastUpdated = 'September 18, 2026';

  const sections = [
    {
      id: 'license-grant',
      title: '1. Software License Grant',
      content: `Subject to compliance with these Terms, Veil grants you a revocable, non-exclusive, non-transferable, limited commercial license to install, download, and utilize the Veil Browser Extension and associated web tools on devices under your ownership or operational control.`
    },
    {
      id: 'local-processing',
      title: '2. Local Processing & Zero-Telemetry Warranty',
      content: `Veil operates on an uncompromising 100% client-side execution model. Redaction rules, TreeWalker DOM parsing, and CSS filter injection are computed strictly within your local browser engine. Veil does not collect, transmit, intercept, or store your unmasked web content, cookies, network traffic, or sensitive credentials on any remote server.`
    },
    {
      id: 'permitted-use',
      title: '3. Acceptable Use & Conduct',
      content: `You agree to use Veil in full compliance with all applicable local, national, and international laws. You shall not attempt to reverse engineer, decompile, or bypass the license verification mechanisms, or distribute cracked or modified binary versions of the extension.`
    },
    {
      id: 'seats-and-activations',
      title: '4. Commercial Seats & Multi-Device Activation',
      content: `Personal and Pro licenses permit active deployment on up to three personal browser profiles owned by the designated licensee. Enterprise licenses permit deployment up to the agreed seat limit. License keys may be revoked and transferred between authorized machines at any time via the Extension License Management portal.`
    },
    {
      id: 'updates-and-support',
      title: '5. Software Updates & Compatibility',
      content: `We continuously update Veil to maintain compatibility with Chromium browser updates, Manifest V3 security standards, and evolving Single Page Application frameworks. Minor bug fixes and security patches are provided free of charge for all active users.`
    },
    {
      id: 'disclaimer-and-liability',
      title: '6. Limitation of Liability',
      content: `Veil provides productivity and privacy tools to obscure visual on-screen data during recordings and video streams. While engineered for maximum fidelity and zero pre-paint flicker, users remain ultimately responsible for reviewing the visual contents of their screen shares before initiating public broadcasts.`
    }
  ];

  return (
    <div className="terms-page-wrap" style={{ backgroundColor: '#080704', minHeight: '80vh', color: '#FAF6F0', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: '#818cf8' }}>Terms of Service</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, color: '#a5b4fc', marginBottom: '14px' }}>
            <span>📜</span> Legal & Commercial Terms
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '12px' }}>
            Terms of Service
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Last revised: <strong style={{ color: '#f8fafc' }}>{lastUpdated}</strong> • Effective for all users of Veil Browser Extension & veil-blur.vercel.app
          </p>
        </div>

        {/* Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {sections.map((s) => (
            <div key={s.id} id={s.id} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px', padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '12px', letterSpacing: '-0.01em' }}>
                {s.title}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '14.5px', lineHeight: 1.7 }}>
                {s.content}
              </p>
            </div>
          ))}
        </div>

        {/* Contact & Support Box */}
        <div style={{ marginTop: '48px', padding: '28px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Have questions about licensing or enterprise terms?</h3>
            <p style={{ color: '#94a3b8', fontSize: '13.5px' }}>Our privacy and legal engineering team is available for compliance verification.</p>
          </div>
          <a href="mailto:support@veil-blur.com" style={{ background: '#6366f1', color: '#ffffff', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>✉️</span> Contact Support
          </a>
        </div>

      </div>
    </div>
  );
}
