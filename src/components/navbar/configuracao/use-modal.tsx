"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import {
  ConfiguracoesUsuario,
  ConfiguracoesState,
  ConfiguracoesTabs,
} from "@/components/navbar/configuracao/types";

export const useConfiguracoes = () => {
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
      nome: session?.user?.name || "",
      email: session?.user?.email || "",
      telefone: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
    },
    contrato: {
      titulo: "Contrato de Prestação de Serviços",
      valorBase: 0,
      prazoEntrega: 30,
      descontoMaximo: 0,
      termos: "",
      observacoes: "",
      clausulas: [],
    },
  });

  const [showState, setShowState] = useState<ConfiguracoesState>({
    loading: false,
    saving: false,
  });

  const [activeTab, setActiveTab] = useState<ConfiguracoesTabs>("tema");

  // Funções de mudança de estado
  const changeShowState = (name: keyof ConfiguracoesState, value: boolean) => {
    setShowState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleSaveConfiguracoes = async () => {
    try {
      changeShowState("saving", true);

      // Simular salvamento das configurações
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Atualizar sessão se necessário
      if (configuracoes.empresa.nome !== session?.user?.name) {
        await update({
          ...session,
          user: {
            ...session?.user,
            name: configuracoes.empresa.nome,
          },
        });
      }

      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações!");
    } finally {
      changeShowState("saving", false);
    }
  };

  return {
    configuracoes,
    showState,
    activeTab,
    setActiveTab,
    changeShowState,
    handleChangeConfiguracao,
    handleSaveConfiguracoes,
  };
};
