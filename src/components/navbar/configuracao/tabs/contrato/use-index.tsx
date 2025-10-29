"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { contratoSchema, ContratoData, Clausula } from "@/components/navbar/configuracao/types";
import { useConfiguracoes } from "@/components/navbar/configuracao/use-modal";

export const useContrato = () => {
  const { configuracoes, handleChangeConfiguracao } = useConfiguracoes();
  const [clausulas, setClausulas] = useState<Clausula[]>(configuracoes.contrato?.clausulas || []);

  // Formulário do contrato
  const contratoForm = useForm<ContratoData>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      titulo: configuracoes.contrato?.titulo || "",
      valorBase: configuracoes.contrato?.valorBase || 0,
      prazoEntrega: configuracoes.contrato?.prazoEntrega || 30,
      descontoMaximo: configuracoes.contrato?.descontoMaximo || 0,
      termos: configuracoes.contrato?.termos || "",
      observacoes: configuracoes.contrato?.observacoes || "",
      clausulas: configuracoes.contrato?.clausulas || [],
    },
  });

  const handleContratoSubmit = (data: ContratoData) => {
    const dataWithClausulas = { ...data, clausulas };
    Object.entries(dataWithClausulas).forEach(([key, value]) => {
      handleChangeConfiguracao(`contrato.${key}`, value);
    });
  };

  // Funções para gerenciar cláusulas
  const adicionarClausula = () => {
    const novaClausula: Clausula = {
      id: Date.now().toString(),
      titulo: "",
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
    // Reordenar as cláusulas restantes
    const clausulasReordenadas = novasClausulas.map((clausula, index) => ({
      ...clausula,
      ordem: index,
    }));
    setClausulas(clausulasReordenadas);
    contratoForm.setValue("clausulas", clausulasReordenadas);
  };

  const moverClausula = (id: string, direcao: "up" | "down") => {
    // Ordenar as cláusulas primeiro para encontrar o índice correto
    const clausulasOrdenadas = [...clausulas].sort((a, b) => a.ordem - b.ordem);
    const index = clausulasOrdenadas.findIndex((clausula) => clausula.id === id);

    if (
      (direcao === "up" && index === 0) ||
      (direcao === "down" && index === clausulasOrdenadas.length - 1)
    ) {
      return;
    }

    const novoIndex = direcao === "up" ? index - 1 : index + 1;

    // Trocar posições no array ordenado
    [clausulasOrdenadas[index], clausulasOrdenadas[novoIndex]] = [
      clausulasOrdenadas[novoIndex],
      clausulasOrdenadas[index],
    ];

    // Atualizar ordens baseado na nova posição
    const clausulasReordenadas = clausulasOrdenadas.map((clausula, i) => ({
      ...clausula,
      ordem: i,
    }));

    setClausulas(clausulasReordenadas);
    contratoForm.setValue("clausulas", clausulasReordenadas);
  };

  return {
    contratoForm,
    handleContratoSubmit,
    clausulas,
    adicionarClausula,
    atualizarClausula,
    removerClausula,
    moverClausula,
  };
};
