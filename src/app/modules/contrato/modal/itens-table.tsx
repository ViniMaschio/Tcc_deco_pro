"use client";

import { TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { CreateContratoData } from "@/app/api/contrato/types";
import { ButtonAction } from "@/components/ui/button-action";
import { Input } from "@/components/ui/input";
import { InputCurrency } from "@/components/input/input-currency";
import { formatCurrency } from "@/utils/currency";

import { Item, ContratoItensTableProps } from "../types";

export function ContratoItensTable({ itens, onUpdateItem, onRemoveItem }: ContratoItensTableProps) {
  const [selectedItems] = useState<{ [key: number]: Item }>({});

  const calculateItemTotal = (item: {
    quantidade: number;
    valorUnit: number;
    desconto?: number;
  }) => {
    return item.quantidade * item.valorUnit - (item.desconto || 0);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border">
        <div className="bg-primary text-primary-foreground sticky top-0 z-10">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium">
            <div className="col-span-4">Item</div>
            <div className="col-span-1">Quantidade</div>
            <div className="col-span-2">Valor Unit.</div>
            <div className="col-span-2">Desconto (R$)</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-1">Ações</div>
          </div>
        </div>

        <div className="max-h-96 divide-y overflow-y-auto">
          {itens.length <= 0 ? (
            <div className="py-8 text-center text-gray-500">Nenhum item adicionado ao contrato</div>
          ) : (
            itens.map((item, index) => {
              const selectedItem = selectedItems[index];
              const itemTotal = calculateItemTotal(item);

              return (
                <div key={index} className="grid grid-cols-12 items-center gap-4 p-4">
                  <div className="col-span-4">
                    <Input
                      value={item.nome || "Item não encontrado"}
                      disabled={true}
                      className="bg-gray-50"
                    />
                    {selectedItem?.descricao && (
                      <div className="mt-1 text-xs text-gray-500">{selectedItem.descricao}</div>
                    )}
                  </div>

                  <div className="col-span-1">
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
                  </div>

                  <div className="col-span-2">
                    <InputCurrency
                      value={item.valorUnit}
                      onChange={(value) => {
                        onUpdateItem(index, "valorUnit", value);
                      }}
                      showCurrency={true}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="col-span-2">
                    <InputCurrency
                      value={item.desconto || 0}
                      onChange={(value) => {
                        onUpdateItem(index, "desconto", value);
                      }}
                      showCurrency={true}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="col-span-2">
                    <Input
                      value={formatCurrency(itemTotal)}
                      disabled={true}
                      className="bg-gray-50 font-medium"
                    />
                  </div>

                  <div className="col-span-1">
                    <ButtonAction
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-500/80"
                      variant="outline"
                      tooltip="Excluir"
                      onClick={() => onRemoveItem(index)}
                    >
                      <TrashIcon weight="fill" size={16} />
                    </ButtonAction>
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
