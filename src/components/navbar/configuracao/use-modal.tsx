"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";

import {
  ConfiguracoesUsuario,
  ConfiguracoesTabs,
  empresaSchema,
} from "@/components/navbar/configuracao/types";
import { obterEmpresa } from "@/actions/empresa";

export const useConfiguracoes = (open?: boolean) => {
  const { data: session, update } = useSession();

  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesUsuario>({
    tema: "system",
    idioma: "pt-BR",
    notificacoes: {
      email: true,
      push: true,
      sistema: true,
    },
    privacidade: {
      perfilPublico: false,
      mostrarEmail: true,
      mostrarTelefone: false,
    },
    empresa: {
      nome: "",
      razaoSocial: "",
      email: "",
      telefone: "",
      cnpj: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
    contrato: {
      observacoes: "",
      clausulas: [],
    },
  });

  const [activeTab, setActiveTab] = useState<ConfiguracoesTabs>("empresa");

  const getEmpresa = async () => {
    if (!session?.user?.id) {
      throw new Error("Sessão não encontrada");
    }

    const empresaId = Number(session.user.id);
    const resultado = await obterEmpresa(empresaId);

    if (!resultado.ok || !resultado.data) {
      throw new Error(resultado.error || "Erro ao carregar dados da empresa");
    }

    return resultado.data;
  };

  const {
    data: empresaData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["empresa", session?.user?.id],
    queryFn: getEmpresa,
    enabled: !!open && !!session?.user?.id,
  });

  const handleChangeConfiguracao = (path: string, value: any) => {
    setConfiguracoes((prev) => {
      const keys = path.split(".");
      const newConfig = { ...prev };
      let current: any = newConfig;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  const handleSaveEmpresa = async () => {
    if (!session?.user?.id) {
      throw new Error("Sessão não encontrada!");
    }

    const empresaId = Number(session.user.id);
    const empresaData = configuracoes.empresa;

    const validationResult = empresaSchema.safeParse(empresaData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      throw new Error(firstError?.message || "Dados inválidos. Verifique os campos.");
    }

    const response = await fetch(`/api/empresa/${empresaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: empresaData.nome,
        email: empresaData.email,
        telefone: empresaData.telefone,
        cnpj: empresaData.cnpj,
        rua: empresaData.rua,
        numero: empresaData.numero,
        complemento: empresaData.complemento || null,
        bairro: empresaData.bairro,
        cidade: empresaData.cidade,
        cep: empresaData.cep,
        estado: empresaData.estado,
        razaoSocial: empresaData.razaoSocial,
      }),
    });

    const resultado = await response.json();

    if (!response.ok) {
      const errorMessage =
        resultado.message || resultado.errors?.[0]?.message || "Erro ao salvar dados da empresa!";
      throw new Error(errorMessage);
    }

    if (resultado.empresa?.nome && resultado.empresa.nome !== session?.user?.name) {
      await update({
        ...session,
        user: {
          ...session?.user,
          name: resultado.empresa.nome,
        },
      });
    }

    toast.success("Configurações salvas com sucesso!", {
      position: "top-center",
    });

    refetch();
  };

  const { mutateAsync: saveEmpresa, isPending: isSavingEmpresa } = useMutation({
    mutationFn: handleSaveEmpresa,
    mutationKey: ["saveEmpresa"],
  });

  const handleSaveConfiguracoes = async () => {
    try {
      await saveEmpresa();
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };

  useEffect(() => {
    if (empresaData) {
      setConfiguracoes((prev) => ({
        ...prev,
        empresa: {
          nome: empresaData.nome || "",
          razaoSocial: empresaData.razaoSocial || "",
          email: empresaData.email || "",
          telefone: empresaData.telefone || "",
          cnpj: empresaData.cnpj || "",
          rua: empresaData.rua || "",
          numero: empresaData.numero || "",
          complemento: empresaData.complemento || "",
          bairro: empresaData.bairro || "",
          cidade: empresaData.cidade || "",
          estado: empresaData.estado || "",
          cep: empresaData.cep || "",
        },
      }));
    }
  }, [empresaData]);

  return {
    configuracoes,
    activeTab,
    setActiveTab,
    handleChangeConfiguracao,
    handleSaveConfiguracoes,
    isLoading: isLoading || isFetching,
    isSaving: isSavingEmpresa,
  };
};
