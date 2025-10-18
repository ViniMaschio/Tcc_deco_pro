"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import { Cliente, UseClientesAutocompleteProps } from "./types";

export const useClientesAutocomplete = ({
  onSelect,
  cliente,
}: UseClientesAutocompleteProps = {}) => {
  const [show, setShow] = useState({
    openCommand: false,
  });

  const [filter, setFilter] = useState({
    nome: "",
  });

  const [debouncedFilter, setDebouncedFilter] = useState(filter);

  // Debounce inteligente do filtro
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setDebouncedFilter(filter);
      },
      filter.nome.length > 2 ? 300 : 100
    ); // Debounce menor para buscas curtas

    return () => clearTimeout(timer);
  }, [filter]);

  // Função para buscar clientes com paginação
  const fetchClientes = useCallback(
    async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      if (debouncedFilter.nome && debouncedFilter.nome.trim().length > 0) {
        params.append("filter", debouncedFilter.nome);
      }
      params.append("page", pageParam.toString());
      params.append("perPage", "10"); // Reduzido para melhor performance

      const response = await fetch(`/api/cliente?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar clientes");
      }

      const data = await response.json();
      return {
        data: data.data,
        pagination: data.pagination,
      };
    },
    [debouncedFilter.nome]
  );

  // Query para buscar clientes com infinite scroll
  const { data, isLoading, error, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["clientes-autocomplete", debouncedFilter.nome],
      queryFn: fetchClientes,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.pagination.pagesCount > lastPage.pagination.currentPage) {
          return lastPage.pagination.currentPage + 1;
        }
        return undefined;
      },
      enabled: show.openCommand, // Só executa quando o popover está aberto
      retry: 1,
    });

  const clientes = data?.pages.flatMap((page) => page.data) ?? [];

  const handleShowState = (key: keyof typeof show, value: boolean) => {
    setShow((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilter = (value: string) => {
    setFilter((prev) => ({ ...prev, nome: value }));
  };

  const handleSelect = (clienteSelecionado: Cliente) => {
    onSelect?.(clienteSelecionado);
    handleShowState("openCommand", false);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const listboxNode = event.currentTarget;
    const position = listboxNode.scrollTop + listboxNode.clientHeight;

    if (listboxNode.scrollHeight - 10 >= position) {
      if (isFetchingNextPage || !hasNextPage) return;
      fetchNextPage();
    }
  };

  // Refetch quando o filtro muda (apenas se o popover estiver aberto)
  useEffect(() => {
    if (show.openCommand) {
      refetch();
    }
  }, [debouncedFilter, refetch, show.openCommand]);

  return {
    show,
    filter,
    clientes,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    handleShowState,
    handleFilter,
    handleSelect,
    handleScroll,
    cliente,
  };
};
