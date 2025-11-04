"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-2">
      <div className="bg-primary flex w-full max-w-6xl flex-col items-center justify-center rounded-lg p-4 text-center">
        <h1 className="text-[128px] font-bold text-white">404</h1>

        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl font-semibold text-white sm:text-3xl">Página não encontrada!</h2>
          <p className="mt-4 text-base text-white sm:text-lg">
            O conteúdo que você tentou acessar não existe ou ainda está em construção.
          </p>
          <img
            src="/static/images/imagem_autenticacao.png"
            alt="Imagem de autenticação"
            className="h-auto w-full max-w-[400px]"
          />
        </div>

        <Link
          href="/"
          className="bg-primary hover:bg-primary/80 mb-8 rounded-lg border border-white px-8 py-2 text-lg font-medium text-white transition-colors"
        >
          Tela Inicial
        </Link>
      </div>
    </div>
  );
}
