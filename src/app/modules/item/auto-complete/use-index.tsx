"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import { Item, UseItensAutocompleteProps } from "./types";

export const useItensAutocomplete = ({ onSelect, item }: UseItensAutocompleteProps = {}) => {
  const [show, setShow] = useState({
    openCommand: false,
  });

  const [filter, setFilter] = useState({
    nome: "",
  });

  const [debouncedFilter, setDebouncedFilter] = useState(filter);


  useEffect(() => {
    const timer = setTimeout(
      () => {
        setDebouncedFilter(filter);
      },
      filter.nome.length > 2 ? 300 : 100
    ); // Debounce menor para buscas curtas

    return () => clearTimeout(timer);
  }, [filter]);


  const fetchItens = useCallback(
    async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      if (debouncedFilter.nome && debouncedFilter.nome.trim().length > 0) {
        params.append("filter", debouncedFilter.nome);
      }
      params.append("page", pageParam.toString());
      params.append("perPage", "10"); // Reduzido para melhor performance

      const response = await fetch(`/api/item?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar itens");
      }

      const data = await response.json();
      return {
        data: data.data,
        pagination: data.pagination,
      };
    },
    [debouncedFilter.nome]
  );


  const { data, isLoading, error, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["itens-autocomplete", debouncedFilter.nome],
      queryFn: fetchItens,
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

  const itens = data?.pages.flatMap((page) => page.data) ?? [];

  const handleShowState = (key: keyof typeof show, value: boolean) => {
    setShow((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilter = (value: string) => {
    setFilter((prev) => ({ ...prev, nome: value }));
  };

  const handleSelect = (itemSelecionado: Item) => {
    onSelect?.(itemSelecionado);
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
    itens,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    handleShowState,
    handleFilter,
    handleSelect,
    handleScroll,
    item,
  };
};
