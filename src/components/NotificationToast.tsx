import React from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'warning';
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm animate-slide-up
      ${type === 'success' ? 'bg-green-500/10 border border-green-500' : 'bg-yellow-500/10 border border-yellow-500'}`}>
      {type === 'success' ? (
        <CheckCircle className="text-green-500" size={20} />
      ) : (
        <AlertTriangle className="text-yellow-500" size={20} />
      )}
      <p className={`text-sm ${type === 'success' ? 'text-green-500' : 'text-yellow-500'}`}>
        {message}
      </p>
      <button
        onClick={onClose}
        className="ml-2 p-1 rounded-full hover:bg-gray-700/50 transition-colors"
      >
        <X size={16} className="text-gray-400" />
      </button>
    </div>
  );
}