import { configureStore } from '@reduxjs/toolkit';
import tradeReducer from './features/tradeSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      trade: tradeReducer,
    },
  });
};

// 类型导出供 Hooks 使用
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];