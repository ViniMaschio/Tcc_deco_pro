"use client";

import { Check, ChevronsUpDown, Loader2, MapPin } from "lucide-react";
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

import { Local, LocalAutocompleteProps } from "./types";
import { useLocaisAutocomplete } from "./use-index";

export const LocalAutocomplete = memo(function LocalAutocomplete({
  onSelect,
  local,
  placeholder = "Selecione um local...",
  disabled = false,
  className,
}: LocalAutocompleteProps) {
  const {
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
  } = useLocaisAutocomplete({
    onSelect,
    local,
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
            "min-h-[2.5rem] w-full justify-between",
            !local && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
            <MapPin className="text-primary h-4 w-4 flex-shrink-0" />
            <span className="truncate text-left">{local ? local.descricao : placeholder}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
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
            placeholder="Pesquise um local..."
            className="h-9 w-full"
            value={filter.descricao}
            onValueChange={handleFilter}
          />
          {error ? (
            <CommandEmpty>Erro ao carregar locais</CommandEmpty>
          ) : !isLoading ? (
            <CommandEmpty>
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <MapPin className="text-muted-foreground h-8 w-8" />
                  <span className="text-muted-foreground text-sm">Nenhum local encontrado</span>
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
                      Carregando locais...
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {locais.map((localItem: Local) => (
                    <CommandItem
                      key={localItem.id}
                      value={localItem.descricao}
                      onSelect={() => handleSelect(localItem)}
                      className={cn(
                        "hover:bg-accent mb-1 flex w-full cursor-pointer items-center justify-between px-3 py-2 transition-all duration-200",
                        local?.id === localItem.id && "bg-accent"
                      )}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <MapPin className="text-primary h-4 w-4 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{localItem.descricao}</div>
                          <div className="text-muted-foreground flex flex-wrap gap-1 text-xs">
                            {localItem.cidade && (
                              <span className="truncate">{localItem.cidade}</span>
                            )}
                            {localItem.rua && <span className="truncate">• {localItem.rua}</span>}
                            {localItem.numero && (
                              <span className="truncate">, {localItem.numero}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {local?.id === localItem.id && (
                        <Check className="ml-2 h-4 w-4 flex-shrink-0" />
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
            {!isLoading && !hasNextPage && locais.length > 0 ? (
              <div className="text-muted-foreground border-t py-2 text-center text-xs">
                Todos os locais carregados
              </div>
            ) : isLoading ? (
              <div className="text-muted-foreground border-t py-2 text-center text-xs">
                Carregando mais locais...
              </div>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
