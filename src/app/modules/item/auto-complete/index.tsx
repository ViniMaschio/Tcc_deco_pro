"use client";

import { PlusCircleIcon } from "@phosphor-icons/react";
import { Check, ChevronsUpDown, Loader2, Package } from "lucide-react";
import { memo, useState } from "react";

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

import { Item, ItemAutocompleteProps } from "./types";
import { useItensAutocomplete } from "./use-index";

export const ItemAutocomplete = memo(function ItemAutocomplete({
  onSelect,
  item,
  placeholder = "Selecione um item...",
  disabled = false,
  className,
  onAddItem,
  itensAdicionados = [],
}: ItemAutocompleteProps) {

  const [itemSelecionado, setItemSelecionado] = useState<Item | null>(null);


  const itemAtual = item || itemSelecionado;

  const {
    show,
    filter,
    itens,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    handleShowState,
    handleFilter,
    handleSelect: handleSelectOriginal,
    handleScroll,
  } = useItensAutocomplete({
    onSelect: onSelect || ((item) => setItemSelecionado(item || null)),
    item: itemAtual || undefined,
  });

  const handleAddItem = (itemParaAdicionar: Item) => {
    onAddItem?.(itemParaAdicionar);
    handleShowState("openCommand", false);

    if (!onSelect) {
      setItemSelecionado(null);
    }
  };

  const isItemAdicionado = (itemId: number) => {
    return itensAdicionados.some((item) => item.itemId === itemId);
  };

  return (
    <div className="flex w-full">
      <Popover
        open={show.openCommand}
        onOpenChange={(value) => handleShowState("openCommand", value)}
      >
        <div className="flex w-full">
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              aria-expanded={show.openCommand}
              className={cn(
                "min-h-[2.5rem] flex-1 justify-between",
                !itemAtual && "text-muted-foreground",
                onAddItem && "rounded-r-none border-r-0",
                className
              )}
              disabled={disabled}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
                <Package className="text-primary h-4 w-4 flex-shrink-0" />
                <span className="truncate text-left">
                  {itemAtual ? itemAtual.nome : placeholder}
                </span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          {onAddItem ? (
            <Button
              size="sm"
              variant="default"
              className="min-h-[2.5rem] shrink-0 rounded-l-none px-3"
              onClick={() => {
                if (!itemAtual) return;
                handleAddItem(itemAtual);
              }}
              disabled={disabled}
            >
              <PlusCircleIcon className="h-6 w-6" />
            </Button>
          ) : null}
        </div>
        <PopoverContent
          className="!z-[99999] w-full p-0 sm:w-[var(--radix-popover-trigger-width)]"
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
              placeholder="Pesquise um item..."
              className="h-9 w-full"
              value={filter.nome}
              onValueChange={handleFilter}
            />

            {error ? (
              <CommandEmpty>Erro ao carregar itens</CommandEmpty>
            ) : !isLoading ? (
              <CommandEmpty>
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="text-muted-foreground h-8 w-8" />
                    <span className="text-muted-foreground text-sm">Nenhum item encontrado</span>
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
                        Carregando itens...
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    {itens.map((itemLista: Item) => {
                      const itemJaAdicionado = isItemAdicionado(itemLista.id);
                      return (
                        <CommandItem
                          key={itemLista.id}
                          value={itemLista.nome}
                          onSelect={() => !itemJaAdicionado && handleSelectOriginal(itemLista)}
                          disabled={itemJaAdicionado}
                          className={cn(
                            "hover:bg-accent mb-1 flex w-full cursor-pointer items-center justify-between px-3 py-2 transition-all duration-200",
                            itemAtual?.id === itemLista.id && "bg-accent",
                            itemJaAdicionado && "cursor-not-allowed opacity-50"
                          )}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-2">
                            <Package className="text-primary h-4 w-4 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium">{itemLista.nome}</div>
                              <div className="text-muted-foreground flex flex-wrap gap-1 text-xs">
                                <span className="truncate">
                                  {itemLista.tipo === "PRO" ? "Produto" : "Serviço"}
                                </span>
                                <span className="truncate">
                                  •{" "}
                                  {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  }).format(itemLista.precoBase)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {itemAtual?.id === itemLista.id && (
                              <Check className="ml-2 h-4 w-4 flex-shrink-0" />
                            )}
                          </div>
                        </CommandItem>
                      );
                    })}

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
              {!isLoading && !hasNextPage && itens.length > 0 ? (
                <div className="text-muted-foreground border-t py-2 text-center text-xs">
                  Todos os itens carregados
                </div>
              ) : isLoading ? (
                <div className="text-muted-foreground border-t py-2 text-center text-xs">
                  Carregando mais itens...
                </div>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
});
