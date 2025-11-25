import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { ContaPagar } from "@/app/api/conta-pagar/types";
import { Fornecedor } from "@/app/modules/fornecedor/auto-complete/types";
import { decimalToCents } from "@/utils/currency";

import { ContaPagarModalProps, FinanceiroModalStates } from "../types";

const FormSchema = z.object({
  id: z.number().optional(),
  fornecedorId: z.number().int().positive().optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  dataVencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  valor: z.number().int().positive("Valor é obrigatório"),
  status: z.enum(["PENDENTE", "FINALIZADO"]),
});

export type FormValues = z.infer<typeof FormSchema>;

export const useContaPagarModal = ({
  afterSubmit,
  contaPagar,
}: Omit<ContaPagarModalProps, "open" | "changeOpen">) => {
  const [modalState, setModalState] = useState({} as FinanceiroModalStates);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedor | undefined>(
    undefined
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fornecedorId: undefined,
      descricao: "",
      dataVencimento: "",
      valor: 0,
      status: "PENDENTE" as const,
    },
  });

  const handleFornecedorSelect = (fornecedor: Fornecedor) => {
    setFornecedorSelecionado(fornecedor);
  };

  const handleResetForm = () => {
    form.reset({
      fornecedorId: undefined,
      descricao: "",
      dataVencimento: "",
      valor: 0,
      status: "PENDENTE",
    });
    setFornecedorSelecionado(undefined);
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
      const response = await fetch(`/api/conta-pagar/${values.id}`, {
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
        toast.success("Conta a pagar atualizada com sucesso", {
          position: "top-center",
        });
      } else {
        afterSubmit();
        handleResetForm();
        console.error("Ocorreu um erro ao atualizar a conta a pagar!");
        toast.error("Erro ao atualizar a conta a pagar!", {
          position: "top-center",
        });
      }
    } else {
      const response = await fetch("/api/conta-pagar", {
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
        toast.success("Conta a pagar criada com sucesso", {
          position: "top-center",
        });
      } else {
        afterSubmit();
        handleResetForm();
        console.error("Ocorreu um erro ao criar a conta a pagar!");
        toast.error("Erro ao criar conta a pagar!", {
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
    if (contaPagar?.id) {
      form.reset({
        id: contaPagar.id,
        fornecedorId: contaPagar.fornecedorId ?? undefined,
        descricao: contaPagar.descricao || "",
        dataVencimento: contaPagar.dataVencimento
          ? new Date(contaPagar.dataVencimento).toISOString().split("T")[0]
          : "",
        valor: contaPagar.valor || 0,
        status: contaPagar.status,
      });
      if (contaPagar.fornecedor) {
        setFornecedorSelecionado(contaPagar.fornecedor as any);
      }
    } else if (!contaPagar || Object.keys(contaPagar).length === 0) {
      handleResetForm();
    }
  }, [contaPagar]);

  return {
    form,
    onSubmit,
    fornecedorSelecionado,
    handleFornecedorSelect,
    modalState,
    handleResetForm,
  };
};
