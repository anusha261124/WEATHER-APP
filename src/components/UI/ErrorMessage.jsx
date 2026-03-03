import React from 'react';
import { AlertCircle, RefreshCw, Clock } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  const isRateLimit = message?.toLowerCase().includes('limit') || message?.toLowerCase().includes('rate');
  
  return (
    <div className="glass-card p-6 text-center">
      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
        isRateLimit ? 'bg-amber-500/10' : 'bg-red-500/10'
      }`}>
        {isRateLimit ? (
          <Clock className="w-8 h-8 text-amber-400" />
        ) : (
          <AlertCircle className="w-8 h-8 text-red-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        {isRateLimit ? 'Rate Limit Reached' : 'Error'}
      </h3>
      <p className="text-slate-400 mb-4">{message}</p>
      {isRateLimit && (
        <p className="text-sm text-slate-500 mb-4">
          Cached data is available for 10 minutes. Please wait before making new requests.
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="glass-button px-4 py-2 inline-flex items-center gap-2"
          disabled={isRateLimit}
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
