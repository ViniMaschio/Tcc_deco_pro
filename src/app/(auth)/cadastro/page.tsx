import Image from "next/image";

import { FormCadastro } from "@/app/modules/auth/cadastro/cadastro-form";

export default function Cadastro() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center sm:px-8">
      <title>DecoPro</title>

      <div className="flex flex-col items-center justify-center gap-4 pb-2">
        <Image
          src="/static/images/logo_collapse.png"
          alt="Imagem de autenticação"
          width={45}
          height={45}
        />

        <div className="flex flex-col items-center">
          <h2 className="pb-1 text-3xl font-bold text-gray-800">Crie uma conta</h2>
          <p className="text-gray-600">Por Favor insira os dados.</p>
        </div>
      </div>

      <FormCadastro />
    </div>
  );
}
