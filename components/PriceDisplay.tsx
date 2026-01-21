'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function PriceDisplay() {
  const { price, prevPrice, symbol } = useSelector((state: RootState) => state.trade);
  
  // 逻辑判断：价格颜色
  const priceColor = parseFloat(price) >= parseFloat(prevPrice) ? 'text-green-500' : 'text-red-500';

  return (
    <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl w-80">
      <h2 className="text-gray-400 text-sm font-semibold mb-2">{symbol} 实时报价</h2>
      <div className={`text-4xl font-mono font-bold transition-colors duration-300 ${priceColor}`}>
        ${price}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span className="text-xs text-gray-500">WebSocket 已连接 (Binance API)</span>
      </div>
    </div>
  );
}