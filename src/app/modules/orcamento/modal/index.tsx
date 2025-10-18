"use client";

import { FileText, Package, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { ClienteAutocomplete } from "../../cliente/auto-complete";
import { LocalAutocomplete } from "../../local/auto-complete";
import { OrcamentoModalProps } from "../types";
import { OrcamentoItensTable } from "./itens-table";
import { useOrcamentoModal } from "./use-modal";

export const OrcamentoModal = ({
  open,
  onOpenChange,
  mode,
  data,
  onSuccess,
}: OrcamentoModalProps) => {
  const {
    // Estados
    activeTab,
    setActiveTab,
    itens,
    total,
    form,
    clienteSelecionado,
    localSelecionado,

    // Dados
    categorias,
    itensDisponiveis,

    // Estados de loading
    isSubmitting,

    // Funções
    addItem,
    updateItem,
    removeItem,
    onSubmit,
    handleDeleteClick,
    handleClienteSelect,
    handleLocalSelect,
  } = useOrcamentoModal({ mode, data, onSuccess });

  const isViewMode = mode === "view";
  const isDeleteMode = mode === "delete";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95vh] w-[95vw] max-w-[95vw] flex-col justify-between sm:max-h-[90vh] sm:w-[90vw] sm:max-w-[90vw] md:w-[80vw] md:max-w-[80vw] lg:w-[70vw] lg:max-w-[70vw] xl:w-[60vw] xl:max-w-[60vw]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "create" && "Criação do Orçamento"}
            {mode === "edit" && "Edição do Orçamento"}
            {mode === "view" && "Visualizar Orçamento"}
            {mode === "delete" && "Excluir Orçamento"}
          </DialogTitle>
        </DialogHeader>

        {isDeleteMode ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Tem certeza que deseja excluir o orçamento <strong>C{data?.id}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button variant="deleteDefault" onClick={handleDeleteClick} disabled={isSubmitting}>
                {isSubmitting ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dados-gerais" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Dados Gerais
              </TabsTrigger>
              <TabsTrigger value="itens" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Itens do Orçamento
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dados-gerais" className="w-full space-y-4">
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="clienteId">Cliente *</Label>
                    <ClienteAutocomplete
                      onSelect={handleClienteSelect}
                      cliente={clienteSelecionado}
                      placeholder="Buscar cliente..."
                      disabled={isViewMode}
                    />
                    {form.formState.errors.clienteId && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.clienteId.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataEvento">Data do Evento</Label>
                    <DatePicker
                      value={
                        form.watch("dataEvento") ? new Date(form.watch("dataEvento")!) : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          form.setValue("dataEvento", date.toISOString().split("T")[0]);
                        } else {
                          form.setValue("dataEvento", "");
                        }
                      }}
                      disabled={isViewMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoriaId">Categoria</Label>
                    <Select
                      value={form.watch("categoriaId")?.toString() || undefined}
                      onValueChange={(value) => form.setValue("categoriaId", parseInt(value))}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias
                          .filter(
                            (categoria) => categoria.id && categoria.descricao && categoria.id > 0
                          )
                          .map((categoria: { id: number; descricao: string }) => (
                            <SelectItem key={categoria.id} value={categoria.id.toString()}>
                              {categoria.descricao}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="localId">Local</Label>
                    <LocalAutocomplete
                      onSelect={handleLocalSelect}
                      local={localSelecionado}
                      placeholder="Buscar local..."
                      disabled={isViewMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={data?.status || "RASCUNHO"} disabled={isViewMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RASCUNHO">Rascunho</SelectItem>
                        <SelectItem value="ENVIADO">Enviado</SelectItem>
                        <SelectItem value="APROVADO">Aprovado</SelectItem>
                        <SelectItem value="REJEITADO">Rejeitado</SelectItem>
                        <SelectItem value="VENCIDO">Vencido</SelectItem>
                        <SelectItem value="CANCELADO">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacao">Observações do Evento</Label>
                  <Textarea
                    id="observacao"
                    placeholder="Detalhes específicos do evento..."
                    {...form.register("observacao")}
                    disabled={isViewMode}
                    rows={3}
                  />
                </div>
              </form>
            </TabsContent>

            <TabsContent value="itens" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Itens do Orçamento</h3>
                {!isViewMode && (
                  <Button onClick={addItem} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Item
                  </Button>
                )}
              </div>

              <OrcamentoItensTable
                itens={itens}
                itensDisponiveis={itensDisponiveis}
                onUpdateItem={updateItem}
                onRemoveItem={removeItem}
                isViewMode={isViewMode}
              />

              <div className="flex justify-end">
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    Total do Contrato:{" "}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(total)}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end gap-2 border-t pt-4">
          {mode === "view" ? (
            <Button onClick={() => onOpenChange(false)}>Fechar</Button>
          ) : mode === "delete" ? null : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {mode === "create" ? "Cancelar" : "Voltar"}
              </Button>
              {mode === "create" && (
                <Button onClick={() => form.handleSubmit(onSubmit)()} disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              )}
              {mode === "edit" && (
                <Button onClick={() => form.handleSubmit(onSubmit)()} disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
