'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

export const TradingChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  // 用于标记历史数据是否已经初次加载到图表中
  const isDataInitialized = useRef(false);
  
  // 从 Redux 获取数据
  const history = useSelector((state: RootState) => state.trade.history);
  const symbol = useSelector((state: RootState) => state.trade.symbol)

  useEffect(() => {
    isDataInitialized.current = false;
    // 可选：在这里清空图表数据，防止旧币种残留在屏幕上
    if (seriesRef.current) {
      seriesRef.current.setData([]);
    }
  }, [symbol])

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
    if (!seriesRef.current || history.length === 0) return;

    // 如果还没有加载过历史数据，使用 setData 全量渲染
    if (!isDataInitialized.current && history.length > 1) {
      seriesRef.current.setData(history);
      isDataInitialized.current = true;
      // ✅ 强制滚动到最右侧（最新的数据点）
      chartRef.current?.timeScale().scrollToRealTime();
      // 自动缩放以展示所有 K 线
      // chartRef.current?.timeScale().fitContent();
      
    } else {
      // 如果已经初始化过了，使用 update 增量更新最后一条
      const lastItem = history[history.length - 1];
      // 使用浅拷贝 {...lastItem} 解决 Redux 冻结对象报错问题
      seriesRef.current.update({ ...lastItem });
    }
  }, [history]);

  return (
    <div className="w-full bg-black p-4 rounded-lg border border-gray-800">
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};