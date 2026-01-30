import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // Coinbase format is BTC-USD, not BTCUSDT
    const symbol = searchParams.get('symbol') || 'BTC-USD';

    // Coinbase API: /products/{id}/candles
    // granularity: 60 = 1 minute, 300 = 5 minutes, etc.
    const res = await fetch(
      `https://api.exchange.coinbase.com/products/${symbol}/candles?granularity=86400`,
      { 
        headers: { 'User-Agent': 'NextJS-Demo-App' }, // Coinbase requires a User-Agent header
        next: { revalidate: 0 } 
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Coinbase API error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}