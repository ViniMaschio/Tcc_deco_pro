import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { ContaReceber } from "@/app/api/conta-receber/types";
import { decimalToCents } from "@/utils/currency";

const FormSchema = z.object({
  valor: z.number().int().positive("Valor é obrigatório"),
  dataRecebimento: z.string().min(1, "Data de recebimento é obrigatória"),
  metodo: z.enum(["PIX", "DINHEIRO", "CREDITO", "DEBITO", "BOLETO", "TED", "DOC", "OUTRO"]),
  descricao: z.string().min(1, "Descrição é obrigatória"),
});

export type FormValues = z.infer<typeof FormSchema>;

interface UseReceberModalProps {
  conta: ContaReceber;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useReceberModal = ({ conta, onSuccess, onOpenChange }: UseReceberModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      valor: conta.valor || 0,
      dataRecebimento: new Date().toISOString().split("T")[0],
      metodo: "PIX",
      descricao: conta.descricao || "",
    },
  });

  const handleResetForm = () => {
    form.reset({
      valor: conta.valor || 0,
      dataRecebimento: new Date().toISOString().split("T")[0],
      metodo: "PIX",
      descricao: conta.descricao || "",
    });
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/caixa-entrada", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contasReceberId: conta.id,
          valor: values.valor,
          dataRecebimento: values.dataRecebimento,
          metodo: values.metodo,
          descricao: values.descricao,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao processar recebimento");
      }

      toast.success("Recebimento registrado com sucesso!", {
        position: "top-center",
      });
      onSuccess();
      onOpenChange(false);
      handleResetForm();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar recebimento", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (conta?.id) {
      form.reset({
        valor: conta.valor || 0,
        dataRecebimento: new Date().toISOString().split("T")[0],
        metodo: "PIX",
        descricao: conta.descricao || "",
      });
    }
  }, [conta]);

  return {
    form,
    onSubmit,
    isSubmitting,
    handleResetForm,
  };
};
