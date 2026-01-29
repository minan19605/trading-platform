'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { setSymbol } from '@/lib/features/tradeSlice';
import { TradingChart } from '@/components/TradingChart';
import { useCoinbaseData } from '@/hooks/useCoinbaseData';

export default function TradePage() {

  const dispatch = useDispatch()

  // Get current price
  const currentPrice = useSelector((state: RootState) => state.trade.currentPrice);
  const currentSymbol = useSelector((state: RootState) => state.trade.symbol);

  useCoinbaseData();

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-6">
        {/* <h1 className="text-2xl font-bold">BTC/USD Live Terminal</h1> */}
        <div className="flex items-center gap-2 mb-4">
            <select
              value={currentSymbol}
              onChange={(e) => dispatch(setSymbol(e.target.value))}
              className="bg-transparent text-2xl font-bold text-white cursor-pointer hover:text-blue-400 outline-none transition-colors border-none appearance-none"
            >
              <option value="BTC-USD" className="bg-slate-900 text-base">BTC/USD Live Terminal</option>
              <option value="ETH-USD" className="bg-slate-900 text-base">ETH/USD Live Terminal</option>
              <option value="SOL-USD" className="bg-slate-900 text-base">SOL/USD Live Terminal</option>
            </select>
            {/* 自定义一个小箭头图标，增强 UI 感知 */}
            <span className="text-gray-500 text-sm">▼</span>
          </div>
        <div className="text-xl font-mono text-green-400">${currentPrice}</div>
      </div>
      
      <TradingChart />
    </main>
  );
}