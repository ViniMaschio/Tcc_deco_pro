"use client";

import moment from "moment";

import { ContaReceber } from "@/app/api/conta-receber/types";
import { InputCurrency } from "@/components/input/input-currency";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { decimalToCents } from "@/utils/currency";

import { useReceberModal } from "./use-receber-modal";

interface ReceberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conta: ContaReceber;
  onSuccess: () => void;
}

const METODOS_PAGAMENTO = [
  { value: "PIX", label: "PIX" },
  { value: "DINHEIRO", label: "Dinheiro" },
  { value: "CREDITO", label: "Crédito" },
  { value: "DEBITO", label: "Débito" },
  { value: "BOLETO", label: "Boleto" },
  { value: "TED", label: "TED" },
  { value: "DOC", label: "DOC" },
  { value: "OUTRO", label: "Outro" },
];

export const ReceberModal = ({ open, onOpenChange, conta, onSuccess }: ReceberModalProps) => {
  const { form, onSubmit, isSubmitting } = useReceberModal({
    conta,
    onSuccess,
    onOpenChange,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Registrar Recebimento</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="col-span-1 w-full lg:col-span-3">
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Descrição do recebimento" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1 w-full lg:col-span-1">
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
              <div className="col-span-1 w-full lg:col-span-1">
                <FormField
                  control={form.control}
                  name="dataRecebimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data do Recebimento *</FormLabel>
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

              <div className="col-span-1 w-full lg:col-span-1">
                <FormField
                  control={form.control}
                  name="metodo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Método de Pagamento *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o método" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {METODOS_PAGAMENTO.map((metodo) => (
                            <SelectItem key={metodo.value} value={metodo.value}>
                              {metodo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Processando..." : "Confirmar Recebimento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
