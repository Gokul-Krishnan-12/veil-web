'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrency } from './CurrencyContext';

export default function Navbar() {
  const pathname = usePathname();
  const { formatPrice } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';

  const navLinks = [
    { href: isHome ? '#interactive-scanner' : '/#interactive-scanner', label: 'Live Lab' },
    { href: isHome ? '#how-it-works' : '/#how-it-works', label: 'How It Works' },
    { href: isHome ? '#use-cases' : '/#use-cases', label: 'Use Cases' },
    { href: isHome ? '#privacy-guarantee' : '/#privacy-guarantee', label: 'Security' },
    { href: '/demo', label: 'Sandbox' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/docs', label: 'Docs' }
  ];

  const displayPrice = mounted ? formatPrice('pro') : '$29';

  return (
    <header className={`v-navbar ${scrolled ? 'v-nav-scrolled' : ''}`}>
      <div className="v-nav-container">
        
        {/* Brand */}
        <Link href="/" className="v-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="v-brand-icon-wrap">
            <img src="/assets/icon32.png" alt="Veil Shield" className="v-brand-icon" />
          </div>
          <span className="v-brand-name">VEIL</span>
          <span className="v-brand-dot"></span>
        </Link>

        {/* Desktop Links */}
        <nav className="v-links-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`v-link ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="v-actions-desktop">
          <Link href="/demo" className="v-btn-ghost">
            <span>Live Sandbox</span>
          </Link>
          <Link href="/pricing" className="v-btn-amber">
            <span suppressHydrationWarning>Get Lifetime Access ({displayPrice})</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="v-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`v-burger-line ${mobileMenuOpen ? 'open top' : ''}`} />
          <span className={`v-burger-line ${mobileMenuOpen ? 'open mid' : ''}`} />
          <span className={`v-burger-line ${mobileMenuOpen ? 'open bot' : ''}`} />
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="v-mobile-drawer">
          <nav className="v-mobile-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="v-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="v-mobile-actions">
            <Link
              href="/demo"
              className="v-btn-ghost full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Try Live Sandbox
            </Link>
            <Link
              href="/pricing"
              className="v-btn-amber full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Lifetime Access ({displayPrice})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
