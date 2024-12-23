// studycircle-frontend/app/page.js
"use client"; 
import { useEffect } from 'react';

export default function Home() {

  useEffect(() => {
    console.log("Renderizando Home no CLIENTE");
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Bem-vindo ao StudyCircle!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Uma plataforma para compartilhar planos de aula e materiais educacionais.
        </p>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}