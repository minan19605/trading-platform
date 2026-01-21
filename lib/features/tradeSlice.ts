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
      const lastIndex = state.history.length - 1;
      if (lastIndex >= 0 && state.history[lastIndex].time === action.payload.time) {
        state.history[lastIndex] = action.payload;
      } else {
        state.history.push(action.payload);
      }
    }
  },
});

export const { setPrice, setHistory, updateLastCandle } = tradeSlice.actions;
export default tradeSlice.reducer;