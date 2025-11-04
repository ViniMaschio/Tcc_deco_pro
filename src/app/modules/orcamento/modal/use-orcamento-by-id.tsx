"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Orcamento } from "@/app/api/orcamento/types";

interface UseOrcamentoByIdProps {
  orcamentoId: number | null;
  enabled?: boolean;
}

export const useOrcamentoById = ({ orcamentoId, enabled = true }: UseOrcamentoByIdProps) => {
  const query = useQuery({
    queryKey: ["orcamento", orcamentoId],
    queryFn: async (): Promise<Orcamento> => {
      if (!orcamentoId) {
        throw new Error("ID do orçamento é obrigatório");
      }

      const response = await fetch(`/api/orcamento/${orcamentoId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao buscar orçamento");
      }

      return response.json();
    },
    enabled: enabled && !!orcamentoId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    orcamento: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
