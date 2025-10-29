"use client";

import { useConfiguracoes } from "@/components/navbar/configuracao/use-modal";

export const useTema = () => {
  const { configuracoes, handleChangeConfiguracao } = useConfiguracoes();

  return {
    configuracoes,
    handleChangeConfiguracao,
  };
};
