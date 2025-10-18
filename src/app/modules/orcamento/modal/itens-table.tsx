"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import { CreateOrcamentoData } from "@/app/api/orcamento/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Item, OrcamentoItensTableProps } from "../types";

export function OrcamentoItensTable({
  itens,
  itensDisponiveis,
  onUpdateItem,
  onRemoveItem,
  isViewMode = false,
}: OrcamentoItensTableProps) {
  const [selectedItems, setSelectedItems] = useState<{ [key: number]: Item }>({});

  const handleItemSelect = (index: number, itemId: number) => {
    const selectedItem = itensDisponiveis.find((item) => item.id === itemId);
    if (selectedItem) {
      setSelectedItems((prev) => ({ ...prev, [index]: selectedItem }));
      onUpdateItem(index, "valorUnit", selectedItem.precoBase);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calculateItemTotal = (item: CreateOrcamentoData["itens"][0]) => {
    return item.quantidade * item.valorUnit - (item.desconto || 0);
  };

  if (itens.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">Nenhum item adicionado ao orçamento</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border">
        <div className="bg-blue-600 text-white">
          <div className="grid grid-cols-6 gap-4 p-4 text-sm font-medium">
            <div>Item</div>
            <div>Quantidade</div>
            <div>Valor Unit.</div>
            <div>Desconto</div>
            <div>Total</div>
            <div>Ações</div>
          </div>
        </div>

        <div className="divide-y">
          {itens.map((item, index) => {
            const selectedItem = selectedItems[index];
            const itemTotal = calculateItemTotal(item);

            return (
              <div key={index} className="grid grid-cols-6 items-center gap-4 p-4">
                <div>
                  {isViewMode ? (
                    <div>
                      <div className="font-medium">
                        {selectedItem?.nome || "Item não encontrado"}
                      </div>
                      {selectedItem?.descricao && (
                        <div className="text-sm text-gray-500">{selectedItem.descricao}</div>
                      )}
                    </div>
                  ) : (
                    <Select
                      value={item.itemId?.toString() || undefined}
                      onValueChange={(value) => handleItemSelect(index, parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um item" />
                      </SelectTrigger>
                      <SelectContent>
                        {itensDisponiveis
                          .filter(
                            (itemOption) => itemOption.id && itemOption.nome && itemOption.id > 0
                          )
                          .map((itemOption) => (
                            <SelectItem key={itemOption.id} value={itemOption.id.toString()}>
                              {itemOption.nome}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
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

                <div className="font-medium">{formatCurrency(itemTotal)}</div>

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
          })}
        </div>
      </div>
    </div>
  );
}
