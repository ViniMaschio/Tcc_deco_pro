"use client";

import { useQuery } from "@tanstack/react-query";

interface DashboardData {
  metrics: {
    clientes: {
      total: number;
      esteMes: number;
      variacao: string;
    };
    contratosAtivos: {
      total: number;
      eventos: number;
      label: string;
    };
    receita: {
      valor: string;
      variacao: string;
    };
    contasPendentes: {
      total: number;
      label: string;
    };
  };
  cards: {
    itens: number;
    locais: number;
    fornecedores: number;
    orcamentosPendentes: number;
  };
  orcamentos: Array<{
    id: number;
    cliente: string;
    valor: string;
    status: string;
  }>;
  eventos: Array<{
    id: number;
    titulo: string;
    local: string;
    data: string;
    dataEvento: string;
  }>;
}

const fetchDashboard = async (): Promise<DashboardData> => {
  const response = await fetch("/api/dashboard", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || "Erro ao buscar dados do dashboard!");
  }

  return response.json();
};

export const usePage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    refetchInterval: 30000, // Refetch a cada 30 segundos
  });

  return {
    data,
    isLoading,
    error,
  };
};

