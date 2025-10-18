"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import { CreateOrcamentoData } from "@/app/api/orcamento/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Item, OrcamentoItensTableProps } from "../types";

export function OrcamentoItensTable({
  itens,
  onUpdateItem,
  onRemoveItem,
  isViewMode = false,
}: OrcamentoItensTableProps) {
  const [selectedItems] = useState<{ [key: number]: Item }>({});

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calculateItemTotal = (item: CreateOrcamentoData["itens"][0]) => {
    return item.quantidade * item.valorUnit - (item.desconto || 0);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border">
        <div className="bg-primary text-primary-foreground sticky top-0 z-10">
          <div className="grid grid-cols-6 gap-4 p-4 text-sm font-medium">
            <div>Item</div>
            <div>Quantidade</div>
            <div>Valor Unit.</div>
            <div>Desconto</div>
            <div>Total</div>
            <div>Ações</div>
          </div>
        </div>

        <div className="max-h-96 divide-y overflow-y-auto">
          {itens.length <= 0 ? (
            <div className="py-8 text-center text-gray-500">
              Nenhum item adicionado ao orçamento
            </div>
          ) : (
            itens.map((item, index) => {
              const selectedItem = selectedItems[index];
              const itemTotal = calculateItemTotal(item);

              return (
                <div key={index} className="grid grid-cols-6 items-center gap-4 p-4">
                  <div>
                    <Input
                      value={item.nome || "Item não encontrado"}
                      disabled={true}
                      className="bg-gray-50"
                    />
                    {selectedItem?.descricao && (
                      <div className="mt-1 text-xs text-gray-500">{selectedItem.descricao}</div>
                    )}
                  </div>

                  <div>
                    {isViewMode ? (
                      <span>{item.quantidade}</span>
                    ) : (
                      <Input
                        type="number"
                        min="0"
                        step="0.001"
                        value={item.quantidade}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          onUpdateItem(index, "quantidade", isNaN(value) ? 0 : value);
                        }}
                      />
                    )}
                  </div>

                  <div>
                    {isViewMode ? (
                      <span>{formatCurrency(item.valorUnit)}</span>
                    ) : (
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.valorUnit}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          onUpdateItem(index, "valorUnit", isNaN(value) ? 0 : value);
                        }}
                      />
                    )}
                  </div>

                  <div>
                    {isViewMode ? (
                      <span>{formatCurrency(item.desconto || 0)}</span>
                    ) : (
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.desconto || 0}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          onUpdateItem(index, "desconto", isNaN(value) ? 0 : value);
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <Input
                      value={formatCurrency(itemTotal)}
                      disabled={true}
                      className="bg-gray-50 font-medium"
                    />
                  </div>

                  <div>
                    {!isViewMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
