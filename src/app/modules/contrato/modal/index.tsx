"use client";

import { CheckCircle, FileText, Package, X, Loader2 } from "lucide-react";
import moment from "moment";
import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
import { ContratoModalProps } from "../types";
import { ContratoItensTable } from "./itens-table";
import { useContratoModal } from "./use-modal";
import { ContratoStatus } from "@/app/api/contrato/types";

export const ContratoModal = ({ open, onOpenChange, contrato, onSuccess }: ContratoModalProps) => {
  const {
    activeTab,
    setActiveTab,
    itens,
    total,
    form,
    clienteSelecionado,
    localSelecionado,
    categoriaSelecionada,

    isSubmitting,
    isLoading,

    addItemFromAutocomplete,
    updateItem,
    removeItem,
    onSubmit,
    handleClienteSelect,
    handleLocalSelect,
    handleCategoriaSelect,
  } = useContratoModal({ contrato, onSuccess, open });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95vh] w-[95vw] max-w-[95vw] flex-col justify-between overflow-hidden sm:max-h-[90vh] sm:w-[90vw] sm:max-w-[90vw] md:w-[80vw] md:max-w-[80vw] lg:w-[70vw] lg:max-w-[70vw] xl:w-[60vw] xl:max-w-[60vw]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            {contrato?.id ? "Edição do Contrato" : "Criação do Contrato"}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-md p-1 text-gray-600 transition-colors duration-500 hover:bg-red-100 hover:text-red-800"
          >
            <X size={25} />
          </button>
        </DialogHeader>
        <Separator />

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
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
                <span className="hidden sm:inline">Itens do Contrato</span>
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
                      disabled={!!contrato?.id}
                    />
                    {form.formState.errors.clienteId && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.clienteId.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full gap-2 md:flex">
                    <div className="w-full space-y-2">
                      <Label htmlFor="dataEvento">Data do Evento *</Label>
                      <DatePicker
                        value={
                          form.watch("dataEvento")
                            ? moment(form.watch("dataEvento")).toDate()
                            : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            const formattedDate = moment(date).format("YYYY-MM-DD");
                            form.setValue("dataEvento", formattedDate as string);
                          } else {
                            form.setValue("dataEvento", "" as string);
                          }
                        }}
                      />
                      {form.formState.errors.dataEvento && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.dataEvento.message}
                        </p>
                      )}
                    </div>

                    <div className="w-full space-y-2">
                      <Label htmlFor="horaInicio">Hora de Início *</Label>
                      <Input
                        type="time"
                        value={form.watch("horaInicio")}
                        onChange={(e) => form.setValue("horaInicio", e.target.value)}
                      />
                      {form.formState.errors.horaInicio && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.horaInicio.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-full space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Controller
                      control={form.control}
                      name="status"
                      defaultValue={(contrato?.status as ContratoStatus) || "RASCUNHO"}
                      render={({ field }) => (
                        <Select
                          value={(field.value as ContratoStatus) || "RASCUNHO"}
                          onValueChange={(val) => field.onChange(val as ContratoStatus)}
                        >
                          <SelectTrigger className="min-h-10 w-full justify-between">
                            <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
                              <CheckCircle className="text-primary h-4 w-4 shrink-0" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RASCUNHO">Rascunho</SelectItem>
                            <SelectItem value="ATIVO">Ativo</SelectItem>
                            <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                            <SelectItem value="CANCELADO">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoriaId">Categoria</Label>
                    <CategoriaAutocomplete
                      onSelect={handleCategoriaSelect}
                      categoria={categoriaSelecionada}
                      placeholder="Buscar categoria..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="localId">Local</Label>
                    <LocalAutocomplete
                      onSelect={handleLocalSelect}
                      local={localSelecionado}
                      placeholder="Buscar local..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacao">Observações do Evento</Label>
                  <Textarea
                    id="observacao"
                    placeholder="Detalhes específicos do evento..."
                    {...form.register("observacao")}
                    rows={3}
                  />
                </div>
              </form>
            </TabsContent>

            <TabsContent value="itens" className="flex-1 space-y-4 overflow-auto">
              <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-medium">Itens do Contrato</h3>
                </div>

                <div className="">
                  <ItemAutocomplete
                    onAddItem={addItemFromAutocomplete}
                    showAddButton={true}
                    placeholder="Buscar item para adicionar..."
                    itensAdicionados={itens}
                  />
                </div>
              </div>

              <ContratoItensTable
                itens={itens}
                onUpdateItem={updateItem}
                onRemoveItem={removeItem}
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

        <DialogFooter className="flex flex-col gap-2 py-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => {
              if (activeTab === "itens") {
                setActiveTab("dados-gerais");
              } else {
                onOpenChange(false);
              }
            }}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          {!contrato?.id && (
            <Button
              onClick={() => {
                if (activeTab === "dados-gerais") {
                  setActiveTab("itens");
                } else {
                  form.handleSubmit(onSubmit)();
                }
              }}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
              loading={isSubmitting}
            >
              {activeTab === "dados-gerais" ? "Avançar" : "Salvar"}
            </Button>
          )}
          {contrato?.id && (
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
              loading={isSubmitting}
            >
              Salvar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
