import {createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TradeState {
    price: string;
    prevPrice: string;
    symbol: string;
}

const initialState: TradeState = {
    price: '0.00',
    prevPrice: '0.00',
    symbol: 'BTC/USDT',
}

const tradeSlice = createSlice( {
    name: 'trade',
    initialState,
    reducers: {
        updatePrice: (state, action: PayloadAction<string>) => {
            state.prevPrice = state.price;
            state.price = action.payload;
        },
    }
})

export const {updatePrice} = tradeSlice.actions;
export default tradeSlice.reducer;