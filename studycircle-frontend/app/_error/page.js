// studycircle-frontend/app/_error/page.js

'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Algo deu errado!</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.
      </p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => reset()}
      >
        Tentar Novamente
      </button>
    </div>
  );
}