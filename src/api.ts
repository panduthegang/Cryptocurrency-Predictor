import { CoinGeckoMarket, CurrencyState } from './types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function fetchCryptoData(currency: CurrencyState) {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=${currency.code.toLowerCase()}&order=market_cap_desc&per_page=12&page=1&sparkline=true`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }

    const data: CoinGeckoMarket[] = await response.json();
    
    return data.map(coin => ({
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      currentPrice: coin.current_price,
      predictedPrice: calculatePredictedPrice(coin.current_price, coin.price_change_percentage_24h),
      change24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume: coin.total_volume,
      sparkline: coin.sparkline_in_7d.price
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return [];
  }
}

function calculatePredictedPrice(currentPrice: number, change24h: number): number {
  const momentum = change24h > 0 ? 1.1 : 0.9;
  return currentPrice * (1 + (change24h / 100) * momentum);
}