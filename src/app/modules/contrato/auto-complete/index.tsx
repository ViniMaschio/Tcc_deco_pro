"use client";

import { Check, ChevronsUpDown, FileText, Loader2, X } from "lucide-react";
import { memo } from "react";
import moment from "moment";

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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { centsToDecimal } from "@/utils/currency";

import { Contrato, ContratoAutocompleteProps } from "./types";
import { useContratosAutocomplete } from "./use-index";

export const ContratoAutocomplete = memo(function ContratoAutocomplete({
  onSelect,
  contrato,
  placeholder = "Selecione um contrato...",
  disabled = false,
  className,
  clienteId,
  showClear = false,
}: ContratoAutocompleteProps) {
  const {
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
  } = useContratosAutocomplete({
    onSelect,
    contrato,
    clienteId,
  });

  const formatContratoLabel = (contrato: Contrato) => {
    const clienteNome = contrato.cliente?.nome || "Sem cliente";
    const dataEvento = contrato.dataEvento ? moment(contrato.dataEvento).format("DD/MM/YYYY") : "";
    const total =
      typeof contrato.total === "number" ? contrato.total : centsToDecimal(contrato.total);
    return `#${contrato.id} - ${clienteNome}${dataEvento ? ` - ${dataEvento}` : ""} - R$ ${total.toFixed(2)}`;
  };

  const handleClear = () => {
    onSelect?.(null);
  };

  return (
    <div className="w-full min-w-0">
      <Popover
        open={show.openCommand}
        onOpenChange={(value) => handleShowState("openCommand", value)}
      >
        <div className="flex w-full min-w-0">
          <div className={cn("min-w-0", showClear ? "flex-1" : "w-full")}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                aria-expanded={show.openCommand}
                className={cn(
                  "min-h-10 w-full justify-between",
                  !contrato && "text-muted-foreground",
                  showClear && "rounded-r-none border-r-0",
                  className
                )}
                disabled={disabled}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
                  <FileText className="text-primary h-4 w-4 shrink-0" />
                  <span className="truncate text-left">
                    {contrato ? formatContratoLabel(contrato) : placeholder}
                  </span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
          </div>
          {showClear && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "min-h-10 min-w-0 shrink-0 items-center justify-center rounded-l-none px-4 text-red-500 hover:bg-red-50 hover:text-red-600",
                    !contrato &&
                      "text-muted-foreground hover:text-muted-foreground hover:bg-transparent"
                  )}
                  onClick={handleClear}
                  disabled={disabled || !contrato}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Limpar</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
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
              placeholder="Pesquise um contrato..."
              className="h-9 w-full"
              value={filter.search}
              onValueChange={handleFilter}
            />

            {error ? (
              <CommandEmpty>Erro ao carregar contratos</CommandEmpty>
            ) : !isLoading ? (
              <CommandEmpty>
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="text-muted-foreground h-8 w-8" />
                    <span className="text-muted-foreground text-sm">
                      Nenhum contrato encontrado
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
                        Carregando contratos...
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    {contratos.map((contratoItem: Contrato) => {
                      const clienteNome = contratoItem.cliente?.nome || "Sem cliente";
                      const localDesc = contratoItem.local?.descricao;
                      const dataEvento = contratoItem.dataEvento
                        ? moment(contratoItem.dataEvento).format("DD/MM/YYYY")
                        : "";
                      const total =
                        typeof contratoItem.total === "number"
                          ? contratoItem.total
                          : centsToDecimal(contratoItem.total);

                      return (
                        <CommandItem
                          key={contratoItem.id}
                          value={`${contratoItem.id} ${clienteNome}`}
                          onSelect={() => handleSelect(contratoItem)}
                          className={cn(
                            "hover:bg-accent mb-1 flex w-full cursor-pointer items-center justify-between px-3 py-2 transition-all duration-200",
                            contrato?.id === contratoItem.id && "bg-accent"
                          )}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-2">
                            <FileText className="text-primary h-4 w-4 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium">
                                #{contratoItem.id} - {clienteNome}
                              </div>
                              <div className="text-muted-foreground flex flex-wrap gap-1 text-xs">
                                {dataEvento && <span className="truncate">{dataEvento}</span>}
                                {localDesc && <span className="truncate">• {localDesc}</span>}
                                <span className="truncate">• R$ {total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          {contrato?.id === contratoItem.id && (
                            <Check className="ml-2 h-4 w-4 shrink-0" />
                          )}
                        </CommandItem>
                      );
                    })}

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
              {!isLoading && !hasNextPage && contratos.length > 0 ? (
                <div className="text-muted-foreground border-t py-2 text-center text-xs">
                  Todos os contratos carregados
                </div>
              ) : isLoading ? (
                <div className="text-muted-foreground border-t py-2 text-center text-xs">
                  Carregando mais contratos...
                </div>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
});
