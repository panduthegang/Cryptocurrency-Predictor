import React, { useEffect, useState } from 'react';
import { CryptoCard } from './components/CryptoCard';
import { CurrencySelector } from './components/CurrencySelector';
import { SearchBar } from './components/SearchBar';
import { NotificationToast } from './components/NotificationToast';
import { Footer } from './components/Footer';
import { Coins, RefreshCw, Star } from 'lucide-react';
import { fetchCryptoData } from './api';
import { CryptoData, Currency, CurrencyState } from './types';
import { currencies } from './currencies';

const colors = [
  '#10B981', '#6366F1', '#F59E0B', '#EC4899', 
  '#8B5CF6', '#14B8A6', '#F43F5E', '#8B5CF6',
  '#06B6D4', '#22C55E', '#A855F7', '#F97316'
];

function App() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [filteredData, setFilteredData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('cryptoFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [currency, setCurrency] = useState<CurrencyState>(() => {
    const saved = localStorage.getItem('preferredCurrency');
    return saved ? JSON.parse(saved) : { code: 'USD', symbol: '$' };
  });
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'warning';
  }>>([]);
  const [priceAlerts, setPriceAlerts] = useState<Array<{
    symbol: string;
    targetPrice: number;
  }>>(() => {
    const saved = localStorage.getItem('priceAlerts');
    return saved ? JSON.parse(saved) : [];
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchCryptoData(currency);
      setCryptoData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load cryptocurrency data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 120000); // Refresh every 2 minutes
    return () => clearInterval(interval);
  }, [currency]);

  useEffect(() => {
    let filtered = cryptoData;
    
    if (searchTerm) {
      filtered = filtered.filter(crypto => 
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (showOnlyFavorites) {
      filtered = filtered.filter(crypto => favorites.includes(crypto.symbol));
    }
    
    setFilteredData(filtered);
  }, [cryptoData, searchTerm, showOnlyFavorites, favorites]);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency({
      code: newCurrency.code,
      symbol: newCurrency.symbol
    });
    localStorage.setItem('preferredCurrency', JSON.stringify({
      code: newCurrency.code,
      symbol: newCurrency.symbol
    }));
  };

  const toggleFavorite = (symbol: string) => {
    const newFavorites = favorites.includes(symbol)
      ? favorites.filter(f => f !== symbol)
      : [...favorites, symbol];
    setFavorites(newFavorites);
    localStorage.setItem('cryptoFavorites', JSON.stringify(newFavorites));
  };

  const addNotification = (message: string, type: 'success' | 'warning') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleSetAlert = (symbol: string, targetPrice: number) => {
    const newAlert = { symbol, targetPrice };
    setPriceAlerts(prev => [...prev, newAlert]);
    localStorage.setItem('priceAlerts', JSON.stringify([...priceAlerts, newAlert]));
    addNotification(`Price alert set for ${symbol} at ${currency.symbol}${targetPrice}`, 'success');
  };

  useEffect(() => {
    priceAlerts.forEach(alert => {
      const crypto = cryptoData.find(c => c.symbol === alert.symbol);
      if (crypto) {
        if (
          (crypto.currentPrice >= alert.targetPrice && crypto.change24h > 0) ||
          (crypto.currentPrice <= alert.targetPrice && crypto.change24h < 0)
        ) {
          addNotification(
            `${alert.symbol} has reached your target price of ${currency.symbol}${alert.targetPrice}!`,
            'warning'
          );
          setPriceAlerts(prev => prev.filter(a => a.symbol !== alert.symbol));
          localStorage.setItem(
            'priceAlerts',
            JSON.stringify(priceAlerts.filter(a => a.symbol !== alert.symbol))
          );
        }
      }
    });
  }, [cryptoData]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75 border-b border-gray-800 px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Coins size={32} className="text-blue-500" />
              <h1 className="text-2xl font-bold">Crypto Predictor</h1>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              <CurrencySelector
                currencies={currencies}
                selectedCurrency={currency.code}
                onCurrencyChange={handleCurrencyChange}
              />
              <button 
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showOnlyFavorites 
                    ? 'bg-yellow-500 hover:bg-yellow-600' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Star size={20} className={showOnlyFavorites ? 'fill-current' : ''} />
                <span className="hidden sm:inline">Favorites</span>
              </button>
              <button 
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {error ? (
            <div className="bg-red-500/10 border border-red-500 rounded-xl p-4 mb-6">
              <p className="text-red-500">{error}</p>
            </div>
          ) : null}

          {loading && filteredData.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-48 bg-gray-700 rounded mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j}>
                        <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {searchTerm 
                  ? 'No cryptocurrencies found matching your search.'
                  : showOnlyFavorites 
                    ? 'No favorite cryptocurrencies yet. Click the star icon to add some!'
                    : 'No cryptocurrencies available.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((crypto, index) => (
                <CryptoCard 
                  key={crypto.symbol} 
                  crypto={crypto} 
                  color={colors[index % colors.length]}
                  currency={currency}
                  isFavorite={favorites.includes(crypto.symbol)}
                  onToggleFavorite={() => toggleFavorite(crypto.symbol)}
                  onSetAlert={handleSetAlert}
                />
              ))}
            </div>
          )}

          <div className="mt-8 bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Disclaimer</h2>
            <p className="text-gray-400">
              This cryptocurrency predictor uses real-time data from CoinGecko API.
              The predictions are based on simple trend analysis and should not be used as financial advice.
              Cryptocurrency markets are highly volatile and unpredictable.
              Never invest more than you can afford to lose and always do your own research.
            </p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {notifications.map(notification => (
          <NotificationToast
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default App;