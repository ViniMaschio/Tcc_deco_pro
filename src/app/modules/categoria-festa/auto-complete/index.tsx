"use client";

import { Check, ChevronsUpDown, Loader2, Tag } from "lucide-react";
import { memo } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { Categoria, CategoriaAutocompleteProps } from "./types";
import { useCategoriaAutocomplete } from "./use-index";

export const CategoriaAutocomplete = memo(function CategoriaAutocomplete({
  onSelect,
  categoria,
  placeholder = "Selecione uma categoria...",
  disabled = false,
  className,
}: CategoriaAutocompleteProps) {
  const {
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
  } = useCategoriaAutocomplete({
    onSelect,
    categoria,
  });

  return (
    <Popover
      open={show.openCommand}
      onOpenChange={(value) => handleShowState("openCommand", value)}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={show.openCommand}
          className={cn(
            "min-h-10 w-full justify-between",
            !categoria && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
            <Tag className="text-primary h-4 w-4 shrink-0" />
            <span className="truncate text-left">
              {categoria ? categoria.descricao : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-99999! w-full p-0 sm:w-(--radix-popover-trigger-width)"
        align="start"
        side="bottom"
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
        style={{ zIndex: 99999 }}
      >
        <Command className="w-full">
          <CommandInput
            placeholder="Pesquise uma categoria..."
            className="h-9 w-full"
            value={filter.descricao}
            onValueChange={handleFilter}
          />

          {error ? (
            <CommandEmpty>Erro ao carregar categorias</CommandEmpty>
          ) : !isLoading ? (
            <CommandEmpty>
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <Tag className="text-muted-foreground h-8 w-8" />
                  <span className="text-muted-foreground text-sm">
                    Nenhuma categoria encontrada
                  </span>
                </div>
              </div>
            </CommandEmpty>
          ) : null}

          <CommandList className="max-h-[50vh] sm:max-h-60">
            <CommandGroup className="overflow-auto" onScroll={handleScroll}>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="text-primary h-6 w-6 animate-spin" />
                    <span className="text-muted-foreground text-sm font-medium">
                      Carregando categorias...
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {categorias.map((categoriaItem: Categoria) => (
                    <CommandItem
                      key={categoriaItem.id}
                      value={categoriaItem.descricao}
                      onSelect={() => handleSelect(categoriaItem)}
                      className={cn(
                        "hover:bg-accent mb-1 flex w-full cursor-pointer items-center justify-between px-3 py-2 transition-all duration-200",
                        categoria?.id === categoriaItem.id && "bg-accent"
                      )}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <Tag className="text-primary h-4 w-4 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">
                            {categoriaItem.descricao}
                          </div>
                        </div>
                      </div>
                      {categoria?.id === categoriaItem.id && (
                        <Check className="ml-2 h-4 w-4 shrink-0" />
                      )}
                    </CommandItem>
                  ))}

                  {}
                  {isFetchingNextPage && (
                    <div className="bg-muted/30 flex items-center justify-center border-t py-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="text-primary h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </CommandGroup>
            {}
            {!isLoading && !hasNextPage && categorias.length > 0 ? (
              <div className="text-muted-foreground border-t py-2 text-center text-xs">
                Todas as categorias carregadas
              </div>
            ) : isLoading ? (
              <div className="text-muted-foreground border-t py-2 text-center text-xs">
                Carregando mais categorias...
              </div>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
