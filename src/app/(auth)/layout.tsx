import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-[#F1F5F9]">
      <title>DecoPro</title>

      <div className="flex w-full max-w-[80dvw] flex-col bg-white md:flex-row xl:max-w-[60dvw]">
        <div className="bg-primary hidden w-full items-center justify-center rounded-md p-8 lg:flex lg:flex-col">
          <div className="flex w-full flex-col items-center gap-6">
            <h2 className="text-3xl font-semibold text-nowrap text-white">
              Organize, encante, realize.
            </h2>
          </div>
          <img
            src="/static/images/imagem_autenticacao.png"
            alt="Imagem de autenticação"
          />
          <p className="max-w-[350px] text-center text-gray-100">
            Transforme a organização dos seus eventos em uma experiência prática
            e sem imprevistos.
          </p>
        </div>

        <div className="w-full rounded-md p-8">{children}</div>
      </div>
    </div>
  );
}
