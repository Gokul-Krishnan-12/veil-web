'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENCIES, DEFAULT_CURRENCY, getInitialCurrency, formatAmount } from '@/lib/currency';

const CurrencyContext = createContext({
  currency: DEFAULT_CURRENCY,
  currencyData: CURRENCIES.USD,
  setCurrency: () => {},
  formatPrice: () => '$29',
  getPrice: () => 29,
  currencies: CURRENCIES,
  isPpp: false,
  isLoaded: false
});

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Instant local detection (localStorage or timezone)
    const initial = getInitialCurrency();
    setCurrencyState(initial);
    setIsLoaded(true);

    // 2. Fetch IP Geolocation in background if user hasn't explicitly saved a choice
    const saved = typeof window !== 'undefined' ? localStorage.getItem('veil_user_currency') : null;
    if (!saved) {
      fetch('/api/geo')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.currency && CURRENCIES[data.currency]) {
            setCurrencyState(data.currency);
          }
        })
        .catch(() => {});
    }
  }, []);

  const setCurrency = (code) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      try {
        localStorage.setItem('veil_user_currency', code);
      } catch (_) {}
    }
  };

  const currencyData = CURRENCIES[currency] || CURRENCIES.USD;

  const getPrice = (tier = 'pro', isAnchor = false) => {
    const tierData = currencyData.pricing[tier] || currencyData.pricing.pro;
    return isAnchor ? tierData.anchor : tierData.amount;
  };

  const formatPrice = (tier = 'pro', isAnchor = false) => {
    const amount = getPrice(tier, isAnchor);
    return formatAmount(amount, currency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyData,
        setCurrency,
        formatPrice,
        getPrice,
        currencies: CURRENCIES,
        isPpp: Boolean(currencyData.isPpp),
        isLoaded
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
