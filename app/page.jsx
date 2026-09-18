import Link from 'next/link';
import MainHero from '@/components/MainHero';
import ScrollStoryHero from '@/components/ScrollStoryHero';
import ScanDemoSection from '@/components/ScanDemoSection';
import SimpleSteps from '@/components/SimpleSteps';
import UseCaseScenes from '@/components/UseCaseScenes';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import TrustSection from '@/components/TrustSection';
import HomePricing from '@/components/HomePricing';
import FaqAccordion from '@/components/FaqAccordion';

export const metadata = {
  title: 'Veil — Real-Time Browser Screen Privacy & DOM Obfuscation',
  description: 'Instantly obfuscate customer PII, Stripe revenue, credentials, and confidential metrics before sharing screen on Zoom, Google Meet, or recording on Loom. 0ms pre-paint, 100% client-side.',
};

export default function HomePage() {
  return (
    <div className="veil-page-wrap">
      
      {/* 1. PRIMARY HERO: BOLD CINEMATIC SHOWCASE & INTERACTIVE SANDBOX */}
      <MainHero />

      {/* 2. CINEMATIC 6-STATE PINNED SCROLL STORY SEQUENCE */}
      <ScrollStoryHero />

      {/* 2. SUPPORTED ECOSYSTEM MARQUEE */}
      <div className="v-marquee-strip">
        <div className="v-marquee-label">PROTECTING SENSITIVE DATA ACROSS:</div>
        <div className="v-marquee-track">
          <span className="v-marquee-item">💳 Stripe Dashboard</span>
          <span className="v-marquee-item">👥 Salesforce CRM</span>
          <span className="v-marquee-item">🤝 HubSpot Pipeline</span>
          <span className="v-marquee-item">☁️ AWS Console</span>
          <span className="v-marquee-item">📹 Google Meet</span>
          <span className="v-marquee-item">🎥 Zoom Desktop</span>
          <span className="v-marquee-item">🎬 Loom Recordings</span>
          <span className="v-marquee-item">📑 Notion Workspaces</span>
          <span className="v-marquee-item">🎯 Linear Issues</span>
          <span className="v-marquee-item">🐙 GitHub Repos</span>
          {/* Repeat for seamless infinite marquee */}
          <span className="v-marquee-item">💳 Stripe Dashboard</span>
          <span className="v-marquee-item">👥 Salesforce CRM</span>
          <span className="v-marquee-item">🤝 HubSpot Pipeline</span>
          <span className="v-marquee-item">☁️ AWS Console</span>
          <span className="v-marquee-item">📹 Google Meet</span>
          <span className="v-marquee-item">🎥 Zoom Desktop</span>
          <span className="v-marquee-item">🎬 Loom Recordings</span>
          <span className="v-marquee-item">📑 Notion Workspaces</span>
        </div>
      </div>

      {/* 3. INTERACTIVE DOM SCANNER LAB */}
      <ScanDemoSection />

      {/* 4. BEFORE & AFTER COMPARISON SLIDER */}
      <BeforeAfterSlider />

      {/* 5. 3-STEP INSTANT WORKFLOW */}
      <SimpleSteps />

      {/* 6. REALISTIC USE CASE SCENARIOS */}
      <UseCaseScenes />

      {/* 7. VERIFIABLE TRUST & LOCAL-ONLY DEVTOOLS PROOF */}
      <TrustSection />

      {/* 8. TRANSPARENT LIFETIME PRICING */}
      <div className="v-pricing-wrapper">
        <HomePricing />
      </div>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="faq-section" id="faq">
        <div className="faq-container">
          <div className="section-head-center">
            <div className="story-badge-amber">
              <span className="pulse-dot"></span>
              <span>COMMON QUESTIONS</span>
            </div>
            <h2 className="section-h2">
              Frequently Asked <span className="serif-highlight">Questions</span>
            </h2>
            <p className="section-sub">
              Everything you need to know about how Veil protects your screen and data.
            </p>
          </div>

          <FaqAccordion />
        </div>
      </section>

    </div>
  );
}
