"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { empresaSchema, EmpresaData } from "@/components/navbar/configuracao/types";
import { useConfiguracoes } from "@/components/navbar/configuracao/use-modal";

export const useEmpresa = () => {
  const { configuracoes, handleChangeConfiguracao } = useConfiguracoes();

  // Formulário da empresa
  const empresaForm = useForm<EmpresaData>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      nome: configuracoes.empresa.nome,
      email: configuracoes.empresa.email,
      telefone: configuracoes.empresa.telefone || "",
      endereco: configuracoes.empresa.endereco || "",
      cidade: configuracoes.empresa.cidade || "",
      estado: configuracoes.empresa.estado || "",
      cep: configuracoes.empresa.cep || "",
    },
  });

  const handleEmpresaSubmit = (data: EmpresaData) => {
    Object.entries(data).forEach(([key, value]) => {
      handleChangeConfiguracao(`empresa.${key}`, value);
    });
  };

  return {
    empresaForm,
    handleEmpresaSubmit,
  };
};
