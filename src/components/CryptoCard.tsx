import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Star, Bell, Share2 } from 'lucide-react';
import { CryptoData, CurrencyState } from '../types';
import { PriceChart } from './PriceChart';
import { PriceAlert } from './PriceAlert';

interface CryptoCardProps {
  crypto: CryptoData;
  color: string;
  currency: CurrencyState;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSetAlert: (symbol: string, price: number) => void;
}

export const CryptoCard: React.FC<CryptoCardProps> = ({
  crypto,
  color,
  currency,
  isFavorite,
  onToggleFavorite,
  onSetAlert,
}) => {
  const [showAlertModal, setShowAlertModal] = useState(false);
  const priceChange = crypto.predictedPrice - crypto.currentPrice;
  const changePercentage = (priceChange / crypto.currentPrice) * 100;

  const handleShare = async () => {
    try {
      const shareData = {
        title: `${crypto.name} Price Prediction`,
        text: `${crypto.name} (${crypto.symbol}) is currently at ${currency.symbol}${crypto.currentPrice.toLocaleString()} with a predicted price of ${currency.symbol}${crypto.predictedPrice.toLocaleString()}`,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        // You'll need to implement a notification system to show this message
        console.log('Copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg transition-transform hover:scale-[1.02] hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">{crypto.name}</h3>
            <button
              onClick={onToggleFavorite}
              className="p-1 hover:bg-gray-700 rounded-full transition-colors"
            >
              <Star 
                size={20} 
                className={`${isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`}
              />
            </button>
          </div>
          <p className="text-gray-400">{crypto.symbol}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAlertModal(true)}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            title="Set price alert"
          >
            <Bell size={20} className="text-gray-400" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            title="Share"
          >
            <Share2 size={20} className="text-gray-400" />
          </button>
          <div className={`flex items-center ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {crypto.change24h >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            <span className="ml-1">{Math.abs(crypto.change24h).toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {showAlertModal && (
        <PriceAlert
          symbol={crypto.symbol}
          currentPrice={crypto.currentPrice}
          onSetAlert={(price) => onSetAlert(crypto.symbol, price)}
          onClose={() => setShowAlertModal(false)}
        />
      )}

      <div className="mb-6">
        <PriceChart data={crypto.sparkline} color={color} currency={currency} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-sm">Current Price</p>
          <p className="text-white font-bold">{currency.symbol}{crypto.currentPrice.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Predicted Price</p>
          <p className="text-white font-bold">{currency.symbol}{crypto.predictedPrice.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Market Cap</p>
          <p className="text-white font-bold">{currency.symbol}{(crypto.marketCap / 1e9).toFixed(2)}B</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">24h Volume</p>
          <p className="text-white font-bold">{currency.symbol}{(crypto.volume / 1e9).toFixed(2)}B</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-700 rounded-lg">
        <p className="text-gray-300 text-sm">Prediction Analysis</p>
        <p className="text-white">
          Expected {changePercentage >= 0 ? 'increase' : 'decrease'} of{' '}
          <span className={changePercentage >= 0 ? 'text-green-500' : 'text-red-500'}>
            {Math.abs(changePercentage).toFixed(2)}%
          </span>
          {' '}in the next 24 hours
        </p>
      </div>
    </div>
  );
};