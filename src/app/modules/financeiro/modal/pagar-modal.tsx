"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "@phosphor-icons/react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { ContaPagar } from "@/app/api/conta-pagar/types";
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

const FormSchema = z.object({
  valor: z.number().int().positive("Valor é obrigatório"),
  dataPagamento: z.string().min(1, "Data de pagamento é obrigatória"),
  metodo: z.enum(["PIX", "DINHEIRO", "CREDITO", "DEBITO", "BOLETO", "TED", "DOC", "OUTRO"]),
  descricao: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

interface PagarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conta: ContaPagar;
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

export const PagarModal = ({ open, onOpenChange, conta, onSuccess }: PagarModalProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      valor: conta.valor || 0,
      dataPagamento: new Date().toISOString().split("T")[0],
      metodo: "PIX",
      descricao: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch("/api/caixa-saida", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contasPagarId: conta.id,
          valor: values.valor,
          dataPagamento: values.dataPagamento,
          metodo: values.metodo,
          descricao: values.descricao || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao processar pagamento");
      }

      toast.success("Pagamento registrado com sucesso!", {
        position: "top-center",
      });
      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar pagamento", {
        position: "top-center",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Registrar Pagamento</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6"
            >
              <XIcon size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="dataPagamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Pagamento *</FormLabel>
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

              <FormField
                control={form.control}
                name="metodo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Descrição do pagamento" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Processando..." : "Confirmar Pagamento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
