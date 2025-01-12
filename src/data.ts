import { CryptoData, PriceHistory } from './types';

// Simulated data for demonstration
export const cryptoData: CryptoData[] = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    currentPrice: 65432.10,
    predictedPrice: 68750.25,
    change24h: 2.5,
    marketCap: 1285000000000,
    volume: 28500000000
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    currentPrice: 3456.78,
    predictedPrice: 3890.15,
    change24h: 1.8,
    marketCap: 415000000000,
    volume: 12500000000
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    currentPrice: 1.23,
    predictedPrice: 1.45,
    change24h: -0.5,
    marketCap: 43000000000,
    volume: 1200000000
  }
];

export const generatePriceHistory = (basePrice: number): PriceHistory[] => {
  const history: PriceHistory[] = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const randomChange = (Math.random() - 0.5) * 0.05;
    const price = basePrice * (1 + randomChange);
    
    history.push({
      timestamp: date.toISOString().split('T')[0],
      price: Number(price.toFixed(2))
    });
  }
  
  return history;
};