"use client";

import { CheckCircle, FileText, Package } from "lucide-react";
import moment from "moment";
import { Controller } from "react-hook-form";

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

import { CategoriaAutocomplete } from "../../categoria-festa/auto-complete";
import { ClienteAutocomplete } from "../../cliente/auto-complete";
import { ItemAutocomplete } from "../../item/auto-complete";
import { LocalAutocomplete } from "../../local/auto-complete";
import { OrcamentoStatus } from "../enum";
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
    categoriaSelecionada,

    // Estados de loading
    isSubmitting,

    // Funções
    addItemFromAutocomplete,
    updateItem,
    removeItem,
    onSubmit,
    handleClienteSelect,
    handleLocalSelect,
    handleCategoriaSelect,
  } = useOrcamentoModal({ mode, data, onSuccess });

  const isViewMode = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95vh] w-[95vw] max-w-[95vw] flex-col justify-between overflow-hidden sm:max-h-[90vh] sm:w-[90vw] sm:max-w-[90vw] md:w-[80vw] md:max-w-[80vw] lg:w-[70vw] lg:max-w-[70vw] xl:w-[60vw] xl:max-w-[60vw]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "create" && "Criação do Orçamento"}
            {mode === "edit" && "Edição do Orçamento"}
            {mode === "view" && "Visualizar Orçamento"}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex w-full flex-1 flex-col overflow-hidden"
        >
          <TabsList className="grid w-full shrink-0 grid-cols-2">
            <TabsTrigger
              value="dados-gerais"
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Dados Gerais</span>
              <span className="sm:hidden">Dados</span>
            </TabsTrigger>
            <TabsTrigger value="itens" className="flex items-center gap-2 text-xs sm:text-sm">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Itens do Orçamento</span>
              <span className="sm:hidden">Itens</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dados-gerais" className="w-full flex-1 space-y-4 overflow-auto">
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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

                <div className="w-full gap-2 md:flex">
                  <div className="w-full space-y-2">
                    <Label htmlFor="dataEvento">Data do Evento</Label>
                    <DatePicker
                      value={
                        form.watch("dataEvento")
                          ? moment(form.watch("dataEvento")).toDate()
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          // Usa moment para evitar problemas de timezone
                          const formattedDate = moment(date).format("YYYY-MM-DD");
                          form.setValue("dataEvento", formattedDate);
                        } else {
                          form.setValue("dataEvento", "");
                        }
                      }}
                      disabled={isViewMode}
                    />
                  </div>

                  <div className="w-full space-y-2">
                    <Label htmlFor="status">Status</Label>
                      <Controller
                        control={form.control}
                        name="status"
                        defaultValue={(data?.status as OrcamentoStatus) || OrcamentoStatus.RASCUNHO}
                        render={({ field }) => (
                          <Select
                            value={(field.value as OrcamentoStatus) || OrcamentoStatus.RASCUNHO}
                            onValueChange={(val) => field.onChange(val as OrcamentoStatus)}
                            disabled={isViewMode}
                          >
                            <SelectTrigger className="min-h-[2.5rem] w-full justify-between">
                              <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
                                <CheckCircle className="text-primary h-4 w-4 flex-shrink-0" />
                                <SelectValue />
                              </div>
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
                        )}
                      />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoriaId">Categoria</Label>
                  <CategoriaAutocomplete
                    onSelect={handleCategoriaSelect}
                    categoria={categoriaSelecionada}
                    placeholder="Buscar categoria..."
                    disabled={isViewMode}
                  />
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

          <TabsContent value="itens" className="flex-1 space-y-4 overflow-auto">
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-medium">Itens do Orçamento</h3>
              </div>

              {!isViewMode && (
                <div className="">
                  <ItemAutocomplete
                    onAddItem={addItemFromAutocomplete}
                    showAddButton={true}
                    placeholder="Buscar item para adicionar..."
                    itensAdicionados={itens}
                  />
                </div>
              )}
            </div>

            <OrcamentoItensTable
              itens={itens}
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

        <div className="flex shrink-0 flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end">
          {mode === "view" ? (
            <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Fechar
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                {mode === "create" ? "Cancelar" : "Voltar"}
              </Button>
              {mode === "create" && (
                <Button
                  onClick={() => form.handleSubmit(onSubmit)()}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              )}
              {mode === "edit" && (
                <Button
                  onClick={() => form.handleSubmit(onSubmit)()}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
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
