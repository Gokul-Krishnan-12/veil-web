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
  const [dynamicPricing, setDynamicPricing] = useState(null);

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

    // 3. Fetch live dynamic pricing from Lemon Squeezy
    fetch('/api/checkout/pricing')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.pricing) {
          setDynamicPricing(data);
          // If store currency is configured (e.g. INR) and user has no manual override, align to store currency
          if (!saved && data.currency && CURRENCIES[data.currency]) {
            setCurrencyState(data.currency);
          }
        }
      })
      .catch(() => {});
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
    // If selected display currency matches live Lemon Squeezy store currency, use live variant price
    if (dynamicPricing?.pricing && dynamicPricing.currency === currency) {
      const liveTier = dynamicPricing.pricing[tier] || dynamicPricing.pricing.pro;
      if (liveTier) {
        return isAnchor ? liveTier.anchor : liveTier.amount;
      }
    }
    const tierData = currencyData.pricing[tier] || currencyData.pricing.pro;
    return isAnchor ? tierData.anchor : tierData.amount;
  };

  const formatPrice = (tier = 'pro', isAnchor = false) => {
    if (dynamicPricing?.pricing && dynamicPricing.currency === currency) {
      const liveTier = dynamicPricing.pricing[tier] || dynamicPricing.pricing.pro;
      if (liveTier) {
        return isAnchor ? liveTier.anchorFormatted : liveTier.formatted;
      }
    }
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
        isLoaded,
        dynamicPricing,
        isLiveLemonSqueezy: Boolean(dynamicPricing?.success)
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
