import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-800 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-gray-400 text-sm flex items-center gap-2">
            Made with <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" /> by
          </p>
          <p className="text-gray-300 font-medium">
            Rishi • Armaan • Sushil
          </p>
        </div>
      </div>
    </footer>
  );
};