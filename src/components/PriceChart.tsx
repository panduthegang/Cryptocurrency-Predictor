import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CurrencyState } from '../types';

interface PriceChartProps {
  data: number[];
  color: string;
  currency: CurrencyState;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, color, currency }) => {
  const chartData = data.map((price, index) => ({
    timestamp: index,
    price: price
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="timestamp" 
          stroke="#9CA3AF"
          tickFormatter={(value) => `${7 - Math.floor(value / 24)}d`}
        />
        <YAxis 
          stroke="#9CA3AF"
          tickFormatter={(value) => `${currency.symbol}${value.toLocaleString()}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937',
            border: 'none',
            borderRadius: '0.375rem',
            color: '#F3F4F6'
          }}
          formatter={(value: number) => [`${currency.symbol}${value.toLocaleString()}`, 'Price']}
          labelFormatter={(value) => `${7 - Math.floor(Number(value) / 24)}d ago`}
        />
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke={color} 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};