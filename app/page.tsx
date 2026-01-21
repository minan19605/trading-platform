'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { TradingChart } from '@/components/TradingChart';
import { useCoinbaseData } from '@/hooks/useCoinbaseData';

export default function TradePage() {

  useCoinbaseData();

  // Get current price
  const currentPrice = useSelector((state: RootState) => state.trade.currentPrice);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">BTC/USD Live Terminal</h1>
        <div className="text-xl font-mono text-green-400">${currentPrice}</div>
      </div>
      
      <TradingChart />
    </main>
  );
}