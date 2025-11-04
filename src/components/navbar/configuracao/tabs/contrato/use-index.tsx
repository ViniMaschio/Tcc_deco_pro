"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { contratoSchema, ContratoData, Clausula } from "@/components/navbar/configuracao/types";
import { useConfiguracoes } from "@/components/navbar/configuracao/use-modal";

export const useContrato = () => {
  const { data: session } = useSession();
  const { configuracoes, handleChangeConfiguracao } = useConfiguracoes();
  const [clausulas, setClausulas] = useState<Clausula[]>([]);

  const contratoForm = useForm<ContratoData>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      observacoes: "",
      clausulas: [],
    },
  });

  // Buscar cláusulas template do banco de dados
  const getClausulasTemplate = async () => {
    if (!session?.user?.id) {
      throw new Error("Sessão não encontrada");
    }

    const response = await fetch("/api/contrato-template");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao carregar cláusulas template");
    }

    return data.clausulas;
  };

  const {
    data: clausulasData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["clausulas-template", session?.user?.id],
    queryFn: getClausulasTemplate,
    enabled: !!session?.user?.id,
  });

  // Salvar cláusulas template
  const saveClausulasTemplate = async (data: ContratoData) => {
    if (!session?.user?.id) {
      throw new Error("Sessão não encontrada");
    }

    const response = await fetch("/api/contrato-template", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clausulas: clausulas.map((clausula) => ({
          titulo: clausula.titulo,
          conteudo: clausula.conteudo,
          ordem: clausula.ordem,
          editavel: true,
          obrigatoria: false,
        })),
      }),
    });

    const resultado = await response.json();

    if (!response.ok) {
      throw new Error(resultado.message || "Erro ao salvar cláusulas template");
    }

    refetch();
    return resultado.clausulas;
  };

  const { mutateAsync: saveTemplateMutation, isPending: isSaving } = useMutation({
    mutationFn: saveClausulasTemplate,
    mutationKey: ["saveClausulasTemplate"],
  });

  const handleContratoSubmit = async (data: ContratoData) => {
    // Atualizar configurações locais
    const dataWithClausulas = { ...data, clausulas };
    Object.entries(dataWithClausulas).forEach(([key, value]) => {
      handleChangeConfiguracao(`contrato.${key}`, value);
    });

    // Salvar no banco de dados
    try {
      await saveTemplateMutation(data);
      return { ok: true };
    } catch (error) {
      console.error("Erro ao salvar template de contrato:", error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Erro ao salvar template de contrato",
      };
    }
  };

  const adicionarClausula = () => {
    const novaClausula: Clausula = {
      id: Date.now().toString(),
      titulo: `Cláusula ${clausulas.length + 1}`,
      conteudo: "",
      ordem: clausulas.length,
    };
    const novasClausulas = [...clausulas, novaClausula];
    setClausulas(novasClausulas);
    contratoForm.setValue("clausulas", novasClausulas);
  };

  const atualizarClausula = (id: string, campo: keyof Clausula, valor: string | number) => {
    const novasClausulas = clausulas.map((clausula) =>
      clausula.id === id ? { ...clausula, [campo]: valor } : clausula
    );
    setClausulas(novasClausulas);
    contratoForm.setValue("clausulas", novasClausulas);
  };

  const removerClausula = (id: string) => {
    const novasClausulas = clausulas.filter((clausula) => clausula.id !== id);
    const clausulasReordenadas = novasClausulas.map((clausula, index) => ({
      ...clausula,
      ordem: index,
    }));
    setClausulas(clausulasReordenadas);
    contratoForm.setValue("clausulas", clausulasReordenadas);
  };

  const moverClausula = (id: string, direcao: "up" | "down") => {
    const clausulasOrdenadas = [...clausulas].sort((a, b) => a.ordem - b.ordem);
    const index = clausulasOrdenadas.findIndex((clausula) => clausula.id === id);

    if (
      (direcao === "up" && index === 0) ||
      (direcao === "down" && index === clausulasOrdenadas.length - 1)
    ) {
      return;
    }

    const novoIndex = direcao === "up" ? index - 1 : index + 1;

    [clausulasOrdenadas[index], clausulasOrdenadas[novoIndex]] = [
      clausulasOrdenadas[novoIndex],
      clausulasOrdenadas[index],
    ];

    const clausulasReordenadas = clausulasOrdenadas.map((clausula, i) => ({
      ...clausula,
      ordem: i,
    }));

    setClausulas(clausulasReordenadas);
    contratoForm.setValue("clausulas", clausulasReordenadas);
  };

  // Carregar dados das cláusulas quando disponível
  useEffect(() => {
    if (clausulasData && Array.isArray(clausulasData)) {
      const clausulasCarregadas: Clausula[] = clausulasData.map((c: any) => ({
        id: c.uuid || c.id.toString(),
        titulo: c.titulo,
        conteudo: c.conteudo,
        ordem: c.ordem,
      }));

      setClausulas(clausulasCarregadas);
      contratoForm.reset({
        observacoes: configuracoes.contrato?.observacoes || "",
        clausulas: clausulasCarregadas,
      });

      // Atualizar configurações locais
      handleChangeConfiguracao("contrato.clausulas", clausulasCarregadas);
    }
  }, [clausulasData]);

  // Sincronizar com configurações locais (fallback)
  useEffect(() => {
    if (!clausulasData && configuracoes.contrato) {
      const novasClausulas = configuracoes.contrato.clausulas || [];
      if (novasClausulas.length > 0) {
        setClausulas(novasClausulas);
        contratoForm.reset({
          observacoes: configuracoes.contrato.observacoes || "",
          clausulas: novasClausulas,
        });
      }
    }
  }, [configuracoes.contrato, clausulasData]);

  return {
    contratoForm,
    handleContratoSubmit,
    clausulas,
    adicionarClausula,
    atualizarClausula,
    removerClausula,
    moverClausula,
    isLoading: isLoading || isFetching,
    isSaving,
  };
};
