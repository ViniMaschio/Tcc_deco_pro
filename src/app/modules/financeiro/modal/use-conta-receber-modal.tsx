import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { ContaReceber } from "@/app/api/conta-receber/types";
import { Cliente } from "@/app/modules/cliente/auto-complete/types";
import { decimalToCents } from "@/utils/currency";

import { ContaReceberModalProps, FinanceiroModalStates } from "../types";

const FormSchema = z.object({
  id: z.number().optional(),
  clienteId: z.number().int().positive("Cliente é obrigatório"),
  contratoId: z.number().int().positive().optional(),
  descricao: z.string().optional(),
  dataVencimento: z.string().optional(),
  valorTotal: z.number().int().positive("Valor total é obrigatório"),
  status: z.enum(["PENDENTE", "PARCIAL", "PAGO", "VENCIDO", "CANCELADO"]).default("PENDENTE"),
});

export type FormValues = z.infer<typeof FormSchema>;

export const useContaReceberModal = ({
  afterSubmit,
  contaReceber,
}: Omit<ContaReceberModalProps, "open" | "changeOpen">) => {
  const [modalState, setModalState] = useState({} as FinanceiroModalStates);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | undefined>(undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      clienteId: 0,
      contratoId: undefined,
      descricao: "",
      dataVencimento: "",
      valorTotal: 0,
      status: "PENDENTE",
    },
  });

  const handleClienteSelect = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
  };

  const handleResetForm = () => {
    form.reset({
      clienteId: 0,
      contratoId: undefined,
      descricao: "",
      dataVencimento: "",
      valorTotal: 0,
      status: "PENDENTE",
    });
    setClienteSelecionado(undefined);
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setModalState((previous) => ({
      ...previous,
      submitting: true,
    }));

    const convertValues = {
      ...values,
      valorTotal:
        typeof values.valorTotal === "number"
          ? values.valorTotal
          : decimalToCents(values.valorTotal),
    };

    if (Number(values?.id) > 0) {
      const response = await fetch(`/api/conta-receber/${values.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...convertValues,
        }),
      });

      if (response.ok) {
        afterSubmit();
        handleResetForm();
        toast.success("Conta a receber atualizada com sucesso", {
          position: "top-center",
        });
      } else {
        afterSubmit();
        handleResetForm();
        console.error("Ocorreu um erro ao atualizar a conta a receber!");
        toast.error("Erro ao atualizar a conta a receber!", {
          position: "top-center",
        });
      }
    } else {
      const response = await fetch("/api/conta-receber", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...convertValues,
        }),
      });

      if (response.ok) {
        afterSubmit();
        handleResetForm();
        toast.success("Conta a receber criada com sucesso", {
          position: "top-center",
        });
      } else {
        afterSubmit();
        handleResetForm();
        console.error("Ocorreu um erro ao criar a conta a receber!");
        toast.error("Erro ao criar conta a receber!", {
          position: "top-center",
        });
      }
    }

    setModalState((previous) => ({
      ...previous,
      submitting: false,
    }));
  };

  useEffect(() => {
    if (contaReceber?.id) {
      form.reset({
        id: contaReceber.id,
        clienteId: contaReceber.clienteId,
        contratoId: contaReceber.contratoId,
        descricao: contaReceber.descricao || "",
        dataVencimento: contaReceber.dataVencimento
          ? new Date(contaReceber.dataVencimento).toISOString().split("T")[0]
          : "",
        valorTotal: contaReceber.valorTotal,
        status: contaReceber.status,
      });
      if (contaReceber.cliente) {
        setClienteSelecionado(contaReceber.cliente as any);
      }
    }
  }, [contaReceber, form]);

  return {
    form,
    onSubmit,
    clienteSelecionado,
    handleClienteSelect,
    modalState,
    handleResetForm,
  };
};
