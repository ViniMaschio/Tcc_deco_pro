"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";

import { Orcamento } from "@/app/api/orcamento/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ViewItemsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orcamento: Orcamento;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "RASCUNHO":
      return "bg-gray-100 text-gray-800";
    case "ENVIADO":
      return "bg-blue-100 text-blue-800";
    case "APROVADO":
      return "bg-green-100 text-green-800";
    case "REJEITADO":
      return "bg-red-100 text-red-800";
    case "VENCIDO":
      return "bg-orange-100 text-orange-800";
    case "CANCELADO":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "RASCUNHO":
      return "Rascunho";
    case "ENVIADO":
      return "Enviado";
    case "APROVADO":
      return "Aprovado";
    case "REJEITADO":
      return "Rejeitado";
    case "VENCIDO":
      return "Vencido";
    case "CANCELADO":
      return "Cancelado";
    default:
      return status;
  }
};

export const ViewItemsModal = ({ open, onOpenChange, orcamento }: ViewItemsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95vh] w-[95vw] max-w-[95vw] flex-col justify-between overflow-hidden sm:max-h-[90vh] sm:w-[90vw] sm:max-w-[90vw] md:w-[80vw] md:max-w-[80vw] lg:w-[70vw] lg:max-w-[70vw] xl:w-[60vw] xl:max-w-[60vw]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Orçamento C{orcamento.id} - {orcamento.cliente?.nome}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="w-full space-y-6">
          <div className="grid w-full grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-medium text-gray-900">Informações do Cliente</h3>
              <p className="text-sm text-gray-600">
                <strong>Nome:</strong> {orcamento.cliente?.nome}
              </p>
              {orcamento.cliente?.telefone && (
                <p className="text-sm text-gray-600">
                  <strong>Telefone:</strong> {orcamento.cliente.telefone}
                </p>
              )}
              {orcamento.cliente?.email && (
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {orcamento.cliente.email}
                </p>
              )}
            </div>

            <div>
              <h3 className="mb-2 font-medium text-gray-900">Detalhes do Evento</h3>
              {orcamento.local && (
                <p className="text-sm text-gray-600">
                  <strong>Local:</strong> {orcamento.local.descricao}
                </p>
              )}
              {orcamento.categoriaFesta && (
                <p className="text-sm text-gray-600">
                  <strong>Categoria:</strong> {orcamento.categoriaFesta.descricao}
                </p>
              )}
              {orcamento.dataEvento && (
                <p className="text-sm text-gray-600">
                  <strong>Data do Evento:</strong>{" "}
                  {format(new Date(orcamento.dataEvento), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <strong className="text-sm">Status:</strong>
                <Badge className={getStatusColor(orcamento.status)}>
                  {getStatusLabel(orcamento.status)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Observações */}
          {orcamento.observacao && (
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-medium text-gray-900">Observações</h3>
              <p className="text-sm text-gray-600">{orcamento.observacao}</p>
            </div>
          )}

          {/* Tabela de Itens */}
          <div>
            <h3 className="mb-4 font-medium text-gray-900">Itens do Orçamento</h3>
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Quantidade</TableHead>
                    <TableHead className="text-right">Valor Unit.</TableHead>
                    <TableHead className="text-right">Desconto</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orcamento.itens && orcamento.itens.length > 0 ? (
                    orcamento.itens.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.nome}</div>
                            {item.item?.descricao && (
                              <div className="text-sm text-gray-500">{item.item.descricao}</div>
                            )}
                            <div className="mt-1 text-xs text-gray-400">
                              Tipo: {item.item?.tipo === "PRO" ? "Produto" : "Serviço"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.quantidade}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.valorUnit)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.desconto)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.valorTotal)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        Nenhum item encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Total do Orçamento:</span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(orcamento.total)}
              </span>
            </div>
            {orcamento.desconto && orcamento.desconto > 0 && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">Desconto adicional:</span>
                <span className="text-sm text-red-600">-{formatCurrency(orcamento.desconto)}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
