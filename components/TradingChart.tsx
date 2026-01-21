'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

export const TradingChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  
  // 从 Redux 获取数据
  const history = useSelector((state: RootState) => state.trade.history);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. 初始化图表实例
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#000000' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: '#111' },
        horzLines: { color: '#111' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    console.log("chart is: ",chart)

    // 2. 添加 K 线序列
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // 3. 响应式处理：监听窗口缩放
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // 4. 当 Redux 中的数据变化时，同步到图表
  useEffect(() => {
    if (seriesRef.current && history.length > 0) {
      seriesRef.current.setData(history);
    }
  }, [history]);

  return (
    <div className="w-full bg-black p-4 rounded-lg border border-gray-800">
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};