"use client";

import { Check, ChevronsUpDown, Loader2, User } from "lucide-react";
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

import { Cliente, ClienteAutocompleteProps } from "./types";
import { useClientesAutocomplete } from "./use-index";

export const ClienteAutocomplete = memo(function ClienteAutocomplete({
  onSelect,
  cliente,
  placeholder = "Selecione um cliente...",
  disabled = false,
  className,
}: ClienteAutocompleteProps) {
  const {
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
  } = useClientesAutocomplete({
    onSelect,
    cliente,
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
            !cliente && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
            <User className="text-primary h-4 w-4 shrink-0" />
            <span className="truncate text-left">{cliente ? cliente.nome : placeholder}</span>
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
            placeholder="Pesquise um cliente..."
            className="h-9 w-full"
            value={filter.nome}
            onValueChange={handleFilter}
          />

          {error ? (
            <CommandEmpty>Erro ao carregar clientes</CommandEmpty>
          ) : !isLoading ? (
            <CommandEmpty>
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <User className="text-muted-foreground h-8 w-8" />
                  <span className="text-muted-foreground text-sm">Nenhum cliente encontrado</span>
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
                      Carregando clientes...
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {clientes.map((clienteItem: Cliente) => (
                    <CommandItem
                      key={clienteItem.id}
                      value={clienteItem.nome}
                      onSelect={() => handleSelect(clienteItem)}
                      className={cn(
                        "hover:bg-accent mb-1 flex w-full cursor-pointer items-center justify-between px-3 py-2 transition-all duration-200",
                        cliente?.id === clienteItem.id && "bg-accent"
                      )}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <User className="text-primary h-4 w-4 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{clienteItem.nome}</div>
                          <div className="text-muted-foreground flex flex-wrap gap-1 text-xs">
                            {clienteItem.cpf && (
                              <span className="truncate">CPF: {clienteItem.cpf}</span>
                            )}
                            {clienteItem.cidade && (
                              <span className="truncate">• {clienteItem.cidade}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {cliente?.id === clienteItem.id && (
                        <Check className="ml-2 h-4 w-4 shrink-0" />
                      )}
                    </CommandItem>
                  ))}

                  {/* Loading indicator for infinite scroll */}
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
            {/* End of list indicator - moved outside the main content */}
            {!isLoading && !hasNextPage && clientes.length > 0 ? (
              <div className="text-muted-foreground border-t py-2 text-center text-xs">
                Todos os clientes carregados
              </div>
            ) : isLoading ? (
              <div className="text-muted-foreground border-t py-2 text-center text-xs">
                Carregando mais clientes...
              </div>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
