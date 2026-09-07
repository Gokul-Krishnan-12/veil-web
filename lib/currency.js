/**
 * Veil International Currency & Purchasing Power Parity (PPP) Engine
 */

export const CURRENCIES = {
  USD: {
    code: 'USD',
    symbol: '$',
    flag: '🇺🇸',
    label: 'USD ($)',
    name: 'US Dollar',
    pricing: {
      pro: { amount: 29, anchor: 49 },
      enterprise: { amount: 199, anchor: 299 }
    }
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    flag: '🇪🇺',
    label: 'EUR (€)',
    name: 'Euro',
    pricing: {
      pro: { amount: 27, anchor: 45 },
      enterprise: { amount: 189, anchor: 279 }
    }
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    flag: '🇬🇧',
    label: 'GBP (£)',
    name: 'British Pound',
    pricing: {
      pro: { amount: 23, anchor: 39 },
      enterprise: { amount: 159, anchor: 239 }
    }
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    flag: '🇨🇦',
    label: 'CAD (C$)',
    name: 'Canadian Dollar',
    pricing: {
      pro: { amount: 39, anchor: 65 },
      enterprise: { amount: 269, anchor: 399 }
    }
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    flag: '🇦🇺',
    label: 'AUD (A$)',
    name: 'Australian Dollar',
    pricing: {
      pro: { amount: 44, anchor: 75 },
      enterprise: { amount: 299, anchor: 449 }
    }
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    flag: '🇮🇳',
    label: 'INR (₹)',
    name: 'Indian Rupee',
    isPpp: true,
    pricing: {
      pro: { amount: 1499, anchor: 2999 },
      enterprise: { amount: 9999, anchor: 16999 }
    }
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    flag: '🇧🇷',
    label: 'BRL (R$)',
    name: 'Brazilian Real',
    isPpp: true,
    pricing: {
      pro: { amount: 99, anchor: 179 },
      enterprise: { amount: 699, anchor: 1199 }
    }
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    flag: '🇯🇵',
    label: 'JPY (¥)',
    name: 'Japanese Yen',
    pricing: {
      pro: { amount: 4200, anchor: 6900 },
      enterprise: { amount: 28900, anchor: 42900 }
    }
  }
};

export const DEFAULT_CURRENCY = 'USD';

/**
 * Format a price with its proper localized symbol and separators.
 */
export function formatAmount(amount, currencyCode = 'USD') {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const numStr = amount.toLocaleString('en-US');
  return `${curr.symbol}${numStr}`;
}

/**
 * Detect client currency from stored preference, geo header, or timezone.
 */
export function getInitialCurrency() {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY;

  // 1. Check user manual override in localStorage
  try {
    const saved = localStorage.getItem('veil_user_currency');
    if (saved && CURRENCIES[saved]) return saved;
  } catch (_) {}

  // 2. Fallback to timezone heuristic
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Kolkata') || tz.includes('Calcutta')) return 'INR';
    if (tz.includes('London')) return 'GBP';
    if (
      tz.includes('Berlin') ||
      tz.includes('Paris') ||
      tz.includes('Rome') ||
      tz.includes('Madrid') ||
      tz.includes('Amsterdam') ||
      tz.includes('Brussels') ||
      tz.includes('Vienna') ||
      tz.includes('Dublin')
    ) {
      return 'EUR';
    }
    if (
      tz.includes('Toronto') ||
      tz.includes('Vancouver') ||
      tz.includes('Montreal') ||
      tz.includes('Edmonton')
    ) {
      return 'CAD';
    }
    if (
      tz.includes('Sydney') ||
      tz.includes('Melbourne') ||
      tz.includes('Brisbane') ||
      tz.includes('Perth')
    ) {
      return 'AUD';
    }
    if (tz.includes('Sao_Paulo')) return 'BRL';
    if (tz.includes('Tokyo')) return 'JPY';
  } catch (_) {}

  return DEFAULT_CURRENCY;
}
