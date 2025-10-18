"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import { Local, UseLocaisAutocompleteProps } from "./types";

export const useLocaisAutocomplete = ({ onSelect, local }: UseLocaisAutocompleteProps = {}) => {
  const [show, setShow] = useState({
    openCommand: false,
  });

  const [filter, setFilter] = useState({
    descricao: "",
  });

  const [debouncedFilter, setDebouncedFilter] = useState(filter);

  // Debounce inteligente do filtro
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setDebouncedFilter(filter);
      },
      filter.descricao.length > 2 ? 300 : 100
    ); // Debounce menor para buscas curtas

    return () => clearTimeout(timer);
  }, [filter]);

  // Função para buscar locais com paginação
  const fetchLocais = useCallback(
    async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      if (debouncedFilter.descricao && debouncedFilter.descricao.trim().length > 0) {
        params.append("filter", debouncedFilter.descricao);
      }
      params.append("page", pageParam.toString());
      params.append("perPage", "10"); // Reduzido para melhor performance

      const response = await fetch(`/api/local?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar locais");
      }

      const data = await response.json();
      return {
        data: data.data,
        pagination: data.pagination,
      };
    },
    [debouncedFilter.descricao]
  );

  // Query para buscar locais com infinite scroll
  const { data, isLoading, error, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["locais-autocomplete", debouncedFilter.descricao],
      queryFn: fetchLocais,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.pagination.pagesCount > lastPage.pagination.currentPage) {
          return lastPage.pagination.currentPage + 1;
        }
        return undefined;
      },
      enabled: show.openCommand, // Só executa quando o popover está aberto
      staleTime: 5 * 60 * 1000,
      retry: 1,
    });

  const locais = data?.pages.flatMap((page) => page.data) ?? [];

  const handleShowState = (key: keyof typeof show, value: boolean) => {
    setShow((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilter = (value: string) => {
    setFilter((prev) => ({ ...prev, descricao: value }));
  };

  const handleSelect = (localSelecionado: Local) => {
    onSelect?.(localSelecionado);
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
    locais,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    handleShowState,
    handleFilter,
    handleSelect,
    handleScroll,
    local,
  };
};
