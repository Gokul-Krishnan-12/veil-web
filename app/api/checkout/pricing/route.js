import { NextResponse } from 'next/server';
import { CURRENCIES, DEFAULT_CURRENCY } from '@/lib/currency';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedCurrency = (searchParams.get('currency') || DEFAULT_CURRENCY).toUpperCase();
    const currencyData = CURRENCIES[requestedCurrency] || CURRENCIES.USD;

    const proPrice = currencyData.pricing.pro;
    const entPrice = currencyData.pricing.enterprise;

    return NextResponse.json({
      success: true,
      currency: currencyData.code,
      symbol: currencyData.symbol,
      pricing: {
        pro: {
          amount: proPrice.amount,
          formatted: `${currencyData.symbol}${proPrice.amount.toLocaleString('en-US')}`,
          anchor: proPrice.anchor,
          anchorFormatted: `${currencyData.symbol}${proPrice.anchor.toLocaleString('en-US')}`
        },
        enterprise: {
          amount: entPrice.amount,
          formatted: `${currencyData.symbol}${entPrice.amount.toLocaleString('en-US')}`,
          anchor: entPrice.anchor,
          anchorFormatted: `${currencyData.symbol}${entPrice.anchor.toLocaleString('en-US')}`
        }
      },
      currencies: CURRENCIES
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });
  } catch (err) {
    console.error('[Pricing API Error]', err);
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}
