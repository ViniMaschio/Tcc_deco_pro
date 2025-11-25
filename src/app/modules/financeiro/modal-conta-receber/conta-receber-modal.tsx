import { XIcon } from "@phosphor-icons/react";
import moment from "moment";

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
  const { form, onSubmit, contratoSelecionado, handleContratoSelect, modalState, handleResetForm } =
    useContaReceberModal({
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-full">
            <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="col-span-6 w-full min-w-0">
                <FormField
                  control={form.control}
                  name="contratoId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Contrato</FormLabel>
                      <FormControl>
                        <ContratoAutocomplete
                          contrato={contratoSelecionado}
                          onSelect={(contrato) => {
                            handleContratoSelect(contrato);
                            field.onChange(contrato?.id);
                          }}
                          placeholder="Selecione um contrato..."
                          showClear={true}
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
