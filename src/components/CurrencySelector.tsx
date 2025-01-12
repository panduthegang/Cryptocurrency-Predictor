import React from 'react';
import { Currency } from '../types';

interface CurrencySelectorProps {
  currencies: Currency[];
  selectedCurrency: string;
  onCurrencyChange: (currency: Currency) => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currencies,
  selectedCurrency,
  onCurrencyChange,
}) => {
  return (
    <div className="relative">
      <select
        className="appearance-none bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 pr-8 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedCurrency}
        onChange={(e) => {
          const currency = currencies.find(c => c.code === e.target.value);
          if (currency) onCurrencyChange(currency);
        }}
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} - {currency.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};