import { XIcon } from "@phosphor-icons/react";
import moment from "moment";

import { ClienteAutocomplete } from "@/app/modules/cliente/auto-complete";
import { ContratoAutocomplete } from "@/app/modules/contrato/auto-complete";
import { InputCurrency } from "@/components/input/input-currency";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { decimalToCents } from "@/utils/currency";

import { ContaReceberModalProps } from "../types";
import { useContaReceberModal, type FormValues } from "./use-conta-receber-modal";

export const ContaReceberModal = ({
  open,
  changeOpen,
  contaReceber,
  afterSubmit,
}: ContaReceberModalProps) => {
  const {
    form,
    onSubmit,
    clienteSelecionado,
    handleClienteSelect,
    contratoSelecionado,
    handleContratoSelect,
    modalState,
    handleResetForm,
  } = useContaReceberModal({
    afterSubmit,
    contaReceber,
  });

  return (
    <Dialog open={open} onOpenChange={(value) => changeOpen(value)}>
      <DialogContent className="flex max-h-[90vh] max-w-[90vw] flex-col justify-between sm:max-w-[75vw]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{contaReceber?.id ? "Edição" : "Cadastro"} de Conta a Receber</DialogTitle>
          <button
            onClick={() => changeOpen(false)}
            className="cursor-pointer rounded-md p-1 text-gray-600 transition-colors duration-500 hover:bg-red-100 hover:text-red-800"
          >
            <XIcon size={25} />
          </button>
        </DialogHeader>
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="overflow-auto">
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-6 w-full">
                <FormField
                  control={form.control}
                  name="clienteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <FormControl>
                        <ClienteAutocomplete
                          cliente={clienteSelecionado}
                          onSelect={(cliente) => {
                            if (cliente) {
                              handleClienteSelect(cliente);
                              field.onChange(cliente.id);
                            }
                          }}
                          placeholder="Selecione um cliente..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 w-full">
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição *</FormLabel>
                      <FormControl>
                        <Input placeholder="Descrição" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 w-full">
                <FormField
                  control={form.control}
                  name="contratoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contrato</FormLabel>
                      <FormControl>
                        <ContratoAutocomplete
                          contrato={contratoSelecionado}
                          clienteId={clienteSelecionado?.id}
                          onSelect={(contrato) => {
                            handleContratoSelect(contrato);
                            field.onChange(contrato?.id);
                          }}
                          placeholder="Selecione um contrato..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4 w-full">
                <FormField
                  control={form.control}
                  name="dataVencimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Vencimento *</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value ? moment(field.value).toDate() : undefined}
                          onSelect={(date) => {
                            if (date) {
                              const formattedDate = moment(date).format("YYYY-MM-DD");
                              field.onChange(formattedDate);
                            } else {
                              field.onChange("");
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4 w-full">
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor *</FormLabel>
                      <FormControl>
                        <InputCurrency
                          value={typeof field.value === "number" ? field.value / 100 : 0}
                          onChange={(value) => field.onChange(decimalToCents(value))}
                          placeholder="0,00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {contaReceber?.id && (
                <div className="col-span-4 w-full">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PENDENTE">Pendente</SelectItem>
                            <SelectItem value="PAGO">Pago</SelectItem>
                            <SelectItem value="CANCELADO">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </form>
        </Form>

        <DialogFooter className="grid grid-cols-2 gap-2 py-2 sm:flex">
          <Button
            variant={"outline"}
            onClick={() => {
              handleResetForm();
              changeOpen(false);
            }}
            disabled={modalState.submitting}
          >
            Cancelar
          </Button>
          <Button
            variant={"default"}
            onClick={form.handleSubmit(onSubmit)}
            type="button"
            loading={modalState.submitting}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
