"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { Categoria, UseCategoriaAutocompleteProps } from "./types";

interface CategoriaResponse {
  data: Categoria[];
  pagination: {
    count: number;
    perPage: number;
    pagesCount: number;
    currentPage: number;
  };
}

export const useCategoriaAutocomplete = ({
  onSelect,
  categoria,
}: UseCategoriaAutocompleteProps) => {
  const [show, setShow] = useState({ openCommand: false });
  const [filter, setFilter] = useState({ descricao: "" });

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<CategoriaResponse>({
      queryKey: ["categorias-autocomplete", filter.descricao],
      queryFn: async ({ pageParam = 1 }) => {
        const params = new URLSearchParams({
          page: (pageParam as number).toString(),
          perPage: "20",
          ...(filter.descricao && { filter: filter.descricao }),
        });

        const response = await fetch(`/api/categoria-festa?${params}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar categorias");
        }
        return response.json();
      },
      getNextPageParam: (lastPage) => {
        const { currentPage, pagesCount } = lastPage.pagination;
        return currentPage < pagesCount ? currentPage + 1 : undefined;
      },
      initialPageParam: 1,
      enabled: show.openCommand,
    });

  const categorias = data?.pages.flatMap((page) => page.data) ?? [];

  const handleShowState = useCallback((key: keyof typeof show, value: boolean) => {
    setShow((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleFilter = useCallback((value: string) => {
    setFilter({ descricao: value });
  }, []);

  const handleSelect = useCallback(
    (categoriaSelecionada: Categoria) => {
      onSelect(categoriaSelecionada);
      handleShowState("openCommand", false);
    },
    [onSelect, handleShowState]
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  return {
    show,
    filter,
    categorias,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    handleShowState,
    handleFilter,
    handleSelect,
    handleScroll,
  };
};
