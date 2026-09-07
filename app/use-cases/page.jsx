import Link from 'next/link';

export const metadata = {
  title: 'Use Cases — Veil Privacy Suite',
  description: 'How sales engineering, streamers, founders, and healthcare organizations use Veil to eliminate post-editing and protect screen privacy in real time.',
};

export default function UseCasesPage() {
  const useCases = [
    {
      icon: '💼',
      title: 'Sales Engineering & Demos',
      desc: 'Deliver live product demonstrations to prospects without exposing real client revenue metrics, API tokens, or other customer account names.',
      features: ['Automated ARR and financial masking', 'One-click full table row obscuration', 'Zero lag during Zoom and Meet calls']
    },
    {
      icon: '📹',
      title: 'Loom & Video Content Creators',
      desc: 'Record YouTube tutorials, onboarding videos, and bug reports without spending hours in Final Cut Pro or Premiere blurring out credentials.',
      features: ['Zero post-production editing required', 'Instant Gaussian blur on selected text', 'Persistent rules across tab refreshes']
    },
    {
      icon: '🏥',
      title: 'Healthcare & HIPAA Compliance',
      desc: 'Medical receptionists and practitioners can share screens for technical support without exposing Protected Health Information (PHI).',
      features: ['Automated phone and email redaction', 'Regional area drag boxes', 'Zero network telemetry or data logging']
    },
    {
      icon: '🏦',
      title: 'Fintech & Customer Support Hubs',
      desc: 'Support agents can diagnose customer issues on live calls while masking full 16-digit credit card numbers, CVVs, and bank routing numbers.',
      features: ['Regex Luhn-algorithm card detection', 'Multi-seat team licenses with Supabase', 'Restricted access key controls']
    },
    {
      icon: '🔴',
      title: 'Twitch & YouTube Live Streamers',
      desc: 'Stream without anxiety. Prevent accidental leaks of Discord notifications, email inboxes, or stream keys if you switch windows by mistake.',
      features: ['Tab privacy disguise (disguises as Google Doc)', 'Instant hotkey blur emergency switch', 'Works seamlessly with OBS browser captures']
    },
    {
      icon: '👨‍💻',
      title: 'Software Engineers & Devs',
      desc: 'Stream code sessions or review logs in staging environments without exposing AWS secrets, Stripe webhook signing keys, or SSH credentials.',
      features: ['Automated secret & token regex mask', 'Custom element CSS selector targeting', 'High performance GPU-accelerated canvas']
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto 80px', padding: '0 24px' }}>
      <header style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
        <div className="pill-badge emerald">Enterprise & Creator Ready</div>
        <h1 className="hero-title" style={{ fontSize: '42px', marginTop: '12px' }}>
          Built for how modern teams work
        </h1>
        <p className="hero-subtitle" style={{ fontSize: '17px', color: 'var(--text-muted)' }}>
          Discover how professionals use Veil to protect company confidential data, customer records, and personal privacy across live video calls and content creation.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        {useCases.map((uc, i) => (
          <div key={i} className="feature-card" style={{ padding: '32px' }}>
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>{uc.icon}</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>{uc.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>{uc.desc}</p>
            <ul style={{ listStyle: 'none', padding: '16px 0 0', borderTop: '1px solid var(--card-border)', fontSize: '13px', color: '#cbd5e1', lineHeight: 2 }}>
              {uc.features.map((f, idx) => (
                <li key={idx}>✓ {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '64px' }}>
        <Link href="/pricing" className="btn btn-primary btn-lg">
          Get Your Lifetime License
        </Link>
      </div>
    </div>
  );
}
