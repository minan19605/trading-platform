'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHistory, updateLastCandle, CandleData } from '@/lib/features/tradeSlice';
import { RootState } from '@/lib/store';
import { Time } from 'lightweight-charts'

export const useCoinbaseData = () => {
  const dispatch = useDispatch();
  const symbol = useSelector((state: RootState) => state.trade.symbol);

  // Typical format: [timestamp, open, high, low, close, volume, ...]
  type RawKLineData = [number, number, number, number, number, number];

  useEffect(() => {
    // 1. fetch history data (REST API)
    const fetchHistory = async () => {
    const response = await fetch(`/api/klines?symbol=${symbol.toUpperCase()}`);

      const data = await response.json();
      console.log("data: ", data)
      const formattedData: CandleData[] = data.map((d: RawKLineData) => ({
        time: d[0] as Time,
        low: (d[1]),
        high: (d[2]),
        open: (d[3]),
        close: (d[4]),
      }))
      .sort((a:CandleData, b:CandleData) => (a.time as number) - (b.time as number)); // Lightweight Charts needs ascending order
      
      dispatch(setHistory(formattedData));
    };

    fetchHistory();

    // 2. 建立 WebSocket 实时更新
    const ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');

    ws.onopen = () => {
    const subscribe = {
      type: 'subscribe',
      product_ids:[symbol], //['BTC-USD'],
      channels: ['ticker'] // 'ticker' gives us the latest price
    };
    ws.send(JSON.stringify(subscribe));
  };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      // console.log('msg is: ', msg)
      
      // Coinbase 'ticker' channel provides the latest price
      if (msg.type === 'ticker' && msg.price) {
        const price = parseFloat(msg.price);

        // 1. 将 Coinbase 的 ISO 时间转为 Unix 秒级时间戳
        const time = Math.floor(new Date(msg.time).getTime() /1000);

        // Round to the start of the current minute for the candle timestamp
        // 对齐到分钟起点 (例如 12:01:45 -> 12:01:00)
        const candleTime = Math.floor(time / 60) * 60;

        const newUpdate: CandleData = {
          time: candleTime as Time,
          open: price, // The slice logic will handle if this should be the existing open
          high: price,
          low: price,
          close: price,
        };

        dispatch(updateLastCandle(newUpdate));
      }
    };

    return () => ws.close(); // 清理连接
  }, [symbol, dispatch]);
};