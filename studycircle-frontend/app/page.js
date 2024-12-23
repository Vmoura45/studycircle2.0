// studycircle-frontend/app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Bem-vindo ao StudyCircle!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Uma plataforma para compartilhar planos de aula e materiais educacionais.
        </p>
        {/* Links para Login e Cadastro */}
        <div className="flex gap-4">
          <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login
          </Link>
          <Link href="/signup" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Cadastro
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* Rodapé - Adicione conteúdo aqui se necessário */}
      </footer>
    </div>
  );
}