

# Crypto Real-Time Live Terminal

A high-performance, real-time cryptocurrency charting terminal built with **Next.js**. This project features interactive candlestick charts, live data streaming via **WebSockets**, and robust state management using **Redux Toolkit**.

---

## 🚀 Key Features

* **Real-Time Data Streaming**: Leverages **WebSockets** for sub-second price updates, capturing market volatility without page refreshes.
* **Interactive Candlestick Charts**: Integrated with `lightweight-charts` for smooth zooming, panning, and high-performance rendering.
* **Dynamic Symbol Switching**: Seamlessly toggle between BTC-USD, ETH-USD, and other pairs with automatic timeline resetting and data re-subscription.
* **Reactive UI**: Built with **Tailwind CSS** for a professional, dark-themed financial interface.
* **Predictable State Management**: Utilizes **Redux Toolkit** to maintain a "Single Source of Truth," ensuring the UI and charts remain perfectly synchronized.
* **Full Type Safety**: Developed with **TypeScript** to ensure rigorous data structures for K-line data and API interactions.

---

## 🛠️ Tech Stack

| Domain | Technology |
| --- | --- |
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript |
| **State Management** | Redux Toolkit (RTK) |
| **Styling** | Tailwind CSS |
| **Charting Library** | Lightweight Charts (TradingView) |
| **Data Protocol** | WebSocket API (Coinbase/Binance) |

---

## 🏗️ Architecture & Data Flow

The project follows a unidirectional data flow to ensure stability and performance:

1. **Ingestion Layer**: A custom `useCoinbaseData` hook tracks the `symbol` state in Redux.
2. **State Layer**:
* WebSocket messages are dispatched to the Redux Store.
* The **Trade Slice** manages the `history` array, implementing a "sliding window" to prevent memory leaks by limiting the number of stored candles.


3. **Rendering Layer**:
* The `TradingChart` component subscribes to the `history` slice.
* It uses `useRef` to maintain the chart instance, performing **incremental updates** (`.update()`) instead of expensive full re-renders.



---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/minan19605/trading-platform.git
cd trading-platform

```

### 2. Install dependencies

```bash
npm install
# or
yarn install

```

### 3. Run the development server

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view the live terminal.

---

## 💡 Technical Highlights

### Incremental Chart Updates

To maximize performance, the chart distinguishes between the initial history load and real-time ticks using a `Ref` flag. This prevents the "Cannot update oldest data" error and ensures smooth transitions.

```typescript
if (!isDataInitialized.current) {
  series.setData(history); // Bulk load
  isDataInitialized.current = true;
} else {
  series.update({ ...lastItem }); // Real-time tick
}

```

### Memory Management

The Redux store automatically prunes old data when the history exceeds a defined threshold (e.g., 1000 candles), ensuring the browser remains responsive even during long-running sessions.

---

## 📄 License

MIT License

---