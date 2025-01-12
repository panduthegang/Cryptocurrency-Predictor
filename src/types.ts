export interface CryptoData {
  name: string;
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  change24h: number;
  marketCap: number;
  volume: number;
  sparkline: number[];
}

export interface PriceHistory {
  timestamp: string;
  price: number;
}

export interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface CurrencyState {
  code: string;
  symbol: string;
}