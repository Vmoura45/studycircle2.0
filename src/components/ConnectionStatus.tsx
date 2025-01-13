import React from 'react';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  error: string | null;
  details?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export default function ConnectionStatus({ error, details, onRetry, isRetrying }: ConnectionStatusProps) {
  if (!error) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900">Erro de Conexão</h2>
        </div>

        <p className="text-gray-600 mb-2">{error}</p>
        {details && (
          <p className="text-sm text-gray-500 mb-4">{details}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Tentando novamente...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5" />
                Tentar Novamente
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}