import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';

interface PriceAlertProps {
  symbol: string;
  currentPrice: number;
  onSetAlert: (price: number) => void;
  onClose: () => void;
}

export const PriceAlert: React.FC<PriceAlertProps> = ({
  symbol,
  currentPrice,
  onSetAlert,
  onClose,
}) => {
  const [alertPrice, setAlertPrice] = useState(currentPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetAlert(alertPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bell size={20} className="text-blue-500" />
            Set Price Alert
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Alert me when {symbol} reaches:
            </label>
            <input
              type="number"
              step="any"
              value={alertPrice}
              onChange={(e) => setAlertPrice(Number(e.target.value))}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Set Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}