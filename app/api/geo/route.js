import { NextResponse } from 'next/server';

export async function GET(request) {
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code') ||
    '';

  const countryToCurrency = {
    IN: 'INR',
    GB: 'GBP',
    DE: 'EUR',
    FR: 'EUR',
    IT: 'EUR',
    ES: 'EUR',
    NL: 'EUR',
    BE: 'EUR',
    AT: 'EUR',
    IE: 'EUR',
    PT: 'EUR',
    FI: 'EUR',
    GR: 'EUR',
    CA: 'CAD',
    AU: 'AUD',
    BR: 'BRL',
    JP: 'JPY',
    US: 'USD'
  };

  const detectedCurrency = countryToCurrency[country.toUpperCase()] || null;

  return NextResponse.json({
    country: country.toUpperCase() || null,
    currency: detectedCurrency
  });
}
