import { NextResponse } from 'next/server';

let cachedPricing = null;
let cacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds cache

export async function GET() {
  try {
    const now = Date.now();
    if (cachedPricing && now - cacheTime < CACHE_TTL_MS) {
      return NextResponse.json(cachedPricing, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
        }
      });
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const proId = process.env.LEMONSQUEEZY_PRO_VARIANT_ID;
    const entId = process.env.LEMONSQUEEZY_ENTERPRISE_VARIANT_ID;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;

    if (!apiKey || !proId) {
      return NextResponse.json({
        success: false,
        source: 'static_fallback',
        pricing: {
          pro: { amount: 999, formatted: '₹999', anchor: 1499, anchorFormatted: '₹1,499' },
          enterprise: { amount: 5999, formatted: '₹5,999', anchor: 8999, anchorFormatted: '₹8,999' }
        }
      });
    }

    // Fetch variant and store data in parallel
    const fetches = [
      fetch(`https://api.lemonsqueezy.com/v1/variants/${proId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.api+json'
        }
      })
    ];

    if (entId) {
      fetches.push(
        fetch(`https://api.lemonsqueezy.com/v1/variants/${entId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/vnd.api+json'
          }
        })
      );
    }

    if (storeId) {
      fetches.push(
        fetch(`https://api.lemonsqueezy.com/v1/stores/${storeId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/vnd.api+json'
          }
        })
      );
    }

    const responses = await Promise.all(fetches);
    const proData = await responses[0].json();
    const entData = entId && responses[1] ? await responses[1].json() : null;
    const storeData = storeId && responses[2] ? await responses[2].json() : null;

    const currencyCode = storeData?.data?.attributes?.currency || 'INR';
    const currencySymbol = currencyCode === 'INR' ? '₹' : currencyCode === 'USD' ? '$' : currencyCode === 'EUR' ? '€' : '£';

    // In Lemon Squeezy, price is in subunits (paise or cents)
    const proRawPrice = proData?.data?.attributes?.price;
    const proAmount = typeof proRawPrice === 'number' ? Math.round(proRawPrice / 100) : 999;
    const proAnchor = Math.round(proAmount * 1.5);

    const entRawPrice = entData?.data?.attributes?.price;
    const entAmount = typeof entRawPrice === 'number' ? Math.round(entRawPrice / 100) : 5999;
    const entAnchor = Math.round(entAmount * 1.5);

    const result = {
      success: true,
      source: 'lemonsqueezy_live',
      currency: currencyCode,
      symbol: currencySymbol,
      pricing: {
        pro: {
          amount: proAmount,
          formatted: `${currencySymbol}${proAmount.toLocaleString('en-US')}`,
          anchor: proAnchor,
          anchorFormatted: `${currencySymbol}${proAnchor.toLocaleString('en-US')}`
        },
        enterprise: {
          amount: entAmount,
          formatted: `${currencySymbol}${entAmount.toLocaleString('en-US')}`,
          anchor: entAnchor,
          anchorFormatted: `${currencySymbol}${entAnchor.toLocaleString('en-US')}`
        }
      },
      updatedAt: new Date().toISOString()
    };

    cachedPricing = result;
    cacheTime = now;

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (err) {
    console.error('[Pricing API Error]', err);
    return NextResponse.json({
      success: false,
      error: err.message,
      pricing: {
        pro: { amount: 999, formatted: '₹999', anchor: 1499, anchorFormatted: '₹1,499' },
        enterprise: { amount: 5999, formatted: '₹5,999', anchor: 8999, anchorFormatted: '₹8,999' }
      }
    }, { status: 500 });
  }
}
