"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X, FileDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/currency";
import { usePdfGenerator } from "./use-pdf-generator";
import { useQuery } from "@tanstack/react-query";
import { Orcamento } from "@/app/api/orcamento/types";

interface ViewItemsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orcamentoId: number | null;
}

export const ViewItemsModal = ({ open, onOpenChange, orcamentoId }: ViewItemsModalProps) => {
  const getOrcamento = async () => {
    if (!orcamentoId) {
      throw new Error("ID do orçamento é obrigatório");
    }

    const response = await fetch(`/api/orcamento/${orcamentoId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erro ao buscar orçamento");
    }

    return response.json() as Promise<Orcamento>;
  };

  const {
    data: orcamento,
    isLoading,
    isError,
  } = useQuery<Orcamento>({
    queryKey: ["orcamento", orcamentoId],
    queryFn: () => getOrcamento(),
    enabled: open && !!orcamentoId,
  });

  const { pdfRef, generatePDF } = usePdfGenerator({
    fileName: `orcamento-${orcamentoId}`,
    orcamento: orcamento!,
  });

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[95vh] w-[95vw] max-w-[95vw] flex-col justify-between overflow-hidden sm:max-h-[90vh] sm:w-[90vw] sm:max-w-[90vw] md:w-[80vw] md:max-w-[80vw] lg:w-[70vw] lg:max-w-[70vw] xl:w-[60vw] xl:max-w-[60vw]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Carregando orçamento...</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="cursor-pointer rounded-md p-1 text-gray-600 transition-colors duration-500 hover:bg-red-100 hover:text-red-800"
            >
              <X size={25} />
            </button>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError || !orcamento) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[95vh] w-[95vw] max-w-[95vw] flex-col justify-between overflow-hidden sm:max-h-[90vh] sm:w-[90vw] sm:max-w-[90vw] md:w-[80vw] md:max-w-[80vw] lg:w-[70vw] lg:max-w-[70vw] xl:w-[60vw] xl:max-w-[60vw]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Erro ao carregar orçamento</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="cursor-pointer rounded-md p-1 text-gray-600 transition-colors duration-500 hover:bg-red-100 hover:text-red-800"
            >
              <X size={25} />
            </button>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <p className="text-red-600">Não foi possível carregar os dados do orçamento.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95vh] w-[95vw] max-w-[95vw] flex-col justify-between overflow-hidden sm:max-h-[90vh] sm:w-[90vw] sm:max-w-[90vw] md:w-[80vw] md:max-w-[80vw] lg:w-[70vw] lg:max-w-[70vw] xl:w-[60vw] xl:max-w-[60vw]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            Orçamento C{orcamento.id} - {orcamento.cliente?.nome}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-md p-1 text-gray-600 transition-colors duration-500 hover:bg-red-100 hover:text-red-800"
          >
            <X size={25} />
          </button>
        </DialogHeader>
        <Separator />

        <div ref={pdfRef} className="w-full space-y-4">
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
            </div>
          </div>

          {orcamento.observacao && (
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-medium text-gray-900">Observações</h3>
              <p className="text-sm text-gray-600">{orcamento.observacao}</p>
            </div>
          )}

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
                            {item.item?.nome && <div className="text-sm">{item.item.nome}</div>}
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

          <div className="p-4">
            <div className="flex items-center justify-end gap-1">
              <span className="text-lg font-medium">Total do Orçamento:</span>
              <span className="text-xl font-bold">{formatCurrency(orcamento.total)}</span>
            </div>
            {orcamento.desconto && orcamento.desconto > 0 && (
              <div className="mt-2 flex items-center justify-end gap-1">
                <span className="text-lg font-medium">Desconto adicional:</span>
                <span className="text-xl font-bold text-red-600">
                  -{formatCurrency(orcamento.desconto)}
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 py-2 sm:flex-row sm:justify-end">
          <Button onClick={generatePDF} variant="outline" className="w-full sm:w-auto">
            <FileDown className="mr-2 h-4 w-4" />
            Gerar PDF
          </Button>
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
