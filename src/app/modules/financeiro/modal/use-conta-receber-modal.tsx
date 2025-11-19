import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { ContaReceber } from "@/app/api/conta-receber/types";
import { Cliente } from "@/app/modules/cliente/auto-complete/types";
import { Contrato } from "@/app/modules/contrato/auto-complete/types";
import { decimalToCents } from "@/utils/currency";

import { ContaReceberModalProps, FinanceiroModalStates } from "../types";

const FormSchema = z.object({
  id: z.number().optional(),
  clienteId: z.number().int().positive().optional(),
  contratoId: z.number().int().positive().optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  dataVencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  valor: z.number().int().positive("Valor é obrigatório"),
  status: z.enum(["PENDENTE", "PAGO", "CANCELADO"]),
});

export type FormValues = z.infer<typeof FormSchema>;

export const useContaReceberModal = ({
  afterSubmit,
  contaReceber,
}: Omit<ContaReceberModalProps, "open" | "changeOpen">) => {
  const [modalState, setModalState] = useState({} as FinanceiroModalStates);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | undefined>(undefined);
  const [contratoSelecionado, setContratoSelecionado] = useState<Contrato | undefined>(undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      clienteId: undefined,
      contratoId: undefined,
      descricao: "",
      dataVencimento: "",
      valor: 0,
      status: "PENDENTE" as const,
    },
  });

  const handleClienteSelect = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    // Limpar contrato selecionado quando o cliente mudar
    if (cliente?.id !== clienteSelecionado?.id) {
      setContratoSelecionado(undefined);
      form.setValue("contratoId", undefined);
    }
  };

  const handleContratoSelect = (contrato: Contrato | null) => {
    if (contrato) {
      setContratoSelecionado(contrato);
    } else {
      setContratoSelecionado(undefined);
    }
  };

  const handleResetForm = () => {
    form.reset({
      clienteId: undefined,
      contratoId: undefined,
      descricao: "",
      dataVencimento: "",
      valor: 0,
      status: "PENDENTE",
    });
    setClienteSelecionado(undefined);
    setContratoSelecionado(undefined);
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setModalState((previous) => ({
      ...previous,
      submitting: true,
    }));

    const convertValues = {
      ...values,
      valor: typeof values.valor === "number" ? values.valor : decimalToCents(values.valor),
      status: Number(values?.id) > 0 ? values.status : "PENDENTE",
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
        valor: contaReceber.valor || 0,
        status: contaReceber.status,
      });
      if (contaReceber.cliente) {
        setClienteSelecionado(contaReceber.cliente as any);
      }
      // Buscar contrato completo se houver contratoId
      if (contaReceber.contratoId) {
        fetch(`/api/contrato/${contaReceber.contratoId}`)
          .then((res) => res.json())
          .then((contrato) => {
            if (contrato && !contrato.error) {
              setContratoSelecionado(contrato as Contrato);
            }
          })
          .catch((err) => {
            console.error("Erro ao buscar contrato:", err);
          });
      } else {
        setContratoSelecionado(undefined);
      }
    } else if (!contaReceber || Object.keys(contaReceber).length === 0) {
      handleResetForm();
    }
  }, [contaReceber]);

  return {
    form,
    onSubmit,
    clienteSelecionado,
    handleClienteSelect,
    contratoSelecionado,
    handleContratoSelect,
    modalState,
    handleResetForm,
  };
};
