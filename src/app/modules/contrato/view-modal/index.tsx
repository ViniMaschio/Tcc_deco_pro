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
import { Contrato } from "@/app/api/contrato/types";
import { StatusLabelEnum } from "@/app/modules/contrato/enum";

interface ViewContratoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contratoId: number | null;
}

export const ViewContratoModal = ({ open, onOpenChange, contratoId }: ViewContratoModalProps) => {
  const getContrato = async () => {
    if (!contratoId) {
      throw new Error("ID do contrato é obrigatório");
    }

    const response = await fetch(`/api/contrato/${contratoId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erro ao buscar contrato");
    }

    return response.json() as Promise<Contrato>;
  };

  const {
    data: contrato,
    isLoading,
    isError,
  } = useQuery<Contrato>({
    queryKey: ["contrato", contratoId],
    queryFn: () => getContrato(),
    enabled: open && !!contratoId,
  });

  const { pdfRef, generatePDF } = usePdfGenerator({
    fileName: `contrato-${contratoId}`,
    contrato: contrato!,
  });

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[95vh] w-[95vw] max-w-[95vw] flex-col justify-between overflow-hidden sm:max-h-[90vh] sm:w-[90vw] sm:max-w-[90vw] md:w-[80vw] md:max-w-[80vw] lg:w-[70vw] lg:max-w-[70vw] xl:w-[60vw] xl:max-w-[60vw]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Carregando contrato...</DialogTitle>
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

  if (isError || !contrato) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[95vh] w-[95vw] max-w-[95vw] flex-col justify-between overflow-hidden sm:max-h-[90vh] sm:w-[90vw] sm:max-w-[90vw] md:w-[80vw] md:max-w-[80vw] lg:w-[70vw] lg:max-w-[70vw] xl:w-[60vw] xl:max-w-[60vw]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Erro ao carregar contrato</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="cursor-pointer rounded-md p-1 text-gray-600 transition-colors duration-500 hover:bg-red-100 hover:text-red-800"
            >
              <X size={25} />
            </button>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <p className="text-red-600">Não foi possível carregar os dados do contrato.</p>
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
            Contrato C{contrato.id} - {contrato.cliente?.nome}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-md p-1 text-gray-600 transition-colors duration-500 hover:bg-red-100 hover:text-red-800"
          >
            <X size={25} />
          </button>
        </DialogHeader>
        <Separator />

        <div ref={pdfRef} className="w-full space-y-4 overflow-auto">
          <div className="grid w-full grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-medium text-gray-900">Informações do Cliente</h3>
              <p className="text-sm text-gray-600">
                <strong>Nome:</strong> {contrato.cliente?.nome}
              </p>
              {contrato.cliente?.telefone && (
                <p className="text-sm text-gray-600">
                  <strong>Telefone:</strong> {contrato.cliente.telefone}
                </p>
              )}
              {contrato.cliente?.email && (
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {contrato.cliente.email}
                </p>
              )}
            </div>

            <div>
              <h3 className="mb-2 font-medium text-gray-900">Detalhes do Evento</h3>
              {contrato.local && (
                <p className="text-sm text-gray-600">
                  <strong>Local:</strong> {contrato.local.descricao}
                </p>
              )}
              {contrato.categoriaFesta && (
                <p className="text-sm text-gray-600">
                  <strong>Categoria:</strong> {contrato.categoriaFesta.descricao}
                </p>
              )}
              {contrato.dataEvento && (
                <p className="text-sm text-gray-600">
                  <strong>Data do Evento:</strong>{" "}
                  {format(new Date(contrato.dataEvento), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              )}
              {contrato.horaInicio && (
                <p className="text-sm text-gray-600">
                  <strong>Hora de Início:</strong>{" "}
                  {format(new Date(contrato.horaInicio), "HH:mm", { locale: ptBR })}
                </p>
              )}
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> {StatusLabelEnum[contrato.status] || contrato.status}
              </p>
            </div>
          </div>

          {contrato.observacao && (
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-medium text-gray-900">Observações</h3>
              <p className="text-sm text-gray-600">{contrato.observacao}</p>
            </div>
          )}

          <div>
            <h3 className="mb-4 font-medium text-gray-900">Itens do Contrato</h3>
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
                  {contrato.itens && contrato.itens.length > 0 ? (
                    contrato.itens.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.item?.nome || "Item sem nome"}</div>
                            {item.item?.descricao && (
                              <div className="text-sm text-gray-500">{item.item.descricao}</div>
                            )}
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

          {contrato.clausulas && contrato.clausulas.length > 0 && (
            <div>
              <h3 className="mb-4 font-medium text-gray-900">Cláusulas do Contrato</h3>
              <div className="space-y-4">
                {contrato.clausulas.map((clausula, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <h4 className="mb-2 font-semibold text-gray-900">{clausula.titulo}</h4>
                    <p className="text-sm whitespace-pre-wrap text-gray-600">{clausula.conteudo}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4">
            <div className="flex items-center justify-end gap-1">
              <span className="text-lg font-medium">Total do Contrato:</span>
              <span className="text-xl font-bold">{formatCurrency(contrato.total)}</span>
            </div>
            {contrato.desconto && contrato.desconto > 0 && (
              <div className="mt-2 flex items-center justify-end gap-1">
                <span className="text-lg font-medium">Desconto adicional:</span>
                <span className="text-xl font-bold text-red-600">
                  -{formatCurrency(contrato.desconto)}
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
