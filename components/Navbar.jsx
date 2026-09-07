'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Overview' },
    { href: '/demo', label: 'Live Demo' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/use-cases', label: 'Use Cases' },
    { href: '/docs', label: 'Docs' }
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-brand">
          <img src="/assets/icon32.png" alt="Veil Logo" className="nav-logo-img" />
          <span>Veil</span>
        </Link>

        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href} 
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <Link href="/checkout?tier=pro" className="btn btn-primary btn-sm">
            Unlock Pro ($29)
          </Link>
        </div>
      </div>
    </nav>
  );
}
