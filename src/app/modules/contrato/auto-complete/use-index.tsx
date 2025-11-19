"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import { Contrato, UseContratosAutocompleteProps } from "./types";

export const useContratosAutocomplete = ({
  onSelect,
  contrato,
  clienteId,
}: UseContratosAutocompleteProps = {}) => {
  const [show, setShow] = useState({
    openCommand: false,
  });

  const [filter, setFilter] = useState({
    search: "",
  });

  const [debouncedFilter, setDebouncedFilter] = useState(filter);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setDebouncedFilter(filter);
      },
      filter.search.length > 2 ? 300 : 100
    );

    return () => clearTimeout(timer);
  }, [filter]);

  const fetchContratos = useCallback(
    async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      if (debouncedFilter.search && debouncedFilter.search.trim().length > 0) {
        params.append("search", debouncedFilter.search);
      }
      if (clienteId) {
        // Filtrar por cliente se fornecido
        params.append("clienteId", clienteId.toString());
      }
      params.append("page", pageParam.toString());
      params.append("limit", "10");

      const response = await fetch(`/api/contrato?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar contratos");
      }

      const data = await response.json();
      return {
        data: data.data,
        pagination: data.pagination,
      };
    },
    [debouncedFilter.search, clienteId]
  );

  const { data, isLoading, error, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["contratos-autocomplete", debouncedFilter.search, clienteId],
      queryFn: fetchContratos,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.pagination.totalPages > lastPage.pagination.page) {
          return lastPage.pagination.page + 1;
        }
        return undefined;
      },
      enabled: show.openCommand,
      retry: 1,
    });

  const contratos = data?.pages.flatMap((page) => page.data) ?? [];

  const handleShowState = (key: keyof typeof show, value: boolean) => {
    setShow((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilter = (value: string) => {
    setFilter((prev) => ({ ...prev, search: value }));
  };

  const handleSelect = (contratoSelecionado: Contrato) => {
    onSelect?.(contratoSelecionado);
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

  useEffect(() => {
    if (show.openCommand) {
      refetch();
    }
  }, [debouncedFilter, refetch, show.openCommand]);

  return {
    show,
    filter,
    contratos,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    handleShowState,
    handleFilter,
    handleSelect,
    handleScroll,
    contrato,
  };
};

