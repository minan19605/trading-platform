import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定义单根 K 线的数据结构 (OHLC)
export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface TradeState {
  currentPrice: number;
  history: CandleData[];
}

const initialState: TradeState = {
  currentPrice: 0,
  history: [],
};

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    // 更新当前价格
    setPrice: (state, action: PayloadAction<number>) => {
      state.currentPrice = action.payload;
    },
    // 更新历史 K 线数据
    setHistory: (state, action: PayloadAction<CandleData[]>) => {
      state.history = action.payload;
    },

    // 实时推入/更新最后一根 K 线
    updateLastCandle: (state, action: PayloadAction<CandleData>) => {
      const incoming = action.payload;
      const history = state.history;
      
      if (history.length === 0) {
        state.history.push(incoming);
        return;
      }

      const lastCandle = history[history.length - 1];

      // 判断时间戳是否一致 (假设我们是以 1 分钟为单位)
      if (lastCandle.time === incoming.time) {
        // 1. 更新当前 K 线
        lastCandle.close = incoming.close;
        lastCandle.high = Math.max(lastCandle.high, incoming.close);
        lastCandle.low = Math.min(lastCandle.low, incoming.close);
      } else if (incoming.time > (lastCandle.time as number)) {
        // 2. 开启新 K 线 (进入了下一分钟)
        // 新 K 线的 open 应该是上一根的 close
        const newCandle: CandleData = {
          ...incoming,
          open: lastCandle.close 
        };
        state.history.push(newCandle);
        
        // 为了性能，通常我们会保持数组长度，比如只保留最近 1000 根
        if (state.history.length > 1000) {
          state.history.shift();
        }
      }

      state.currentPrice = incoming.close;
    }
  },
});

export const { setPrice, setHistory, updateLastCandle } = tradeSlice.actions;
export default tradeSlice.reducer;