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
  fornecedorId: z.number().int().positive("Fornecedor é obrigatório"),
  descricao: z.string().optional(),
  dataVencimento: z.string().optional(),
  valorTotal: z.number().int().positive("Valor total é obrigatório"),
  status: z.enum(["PENDENTE", "PARCIAL", "PAGO", "VENCIDO", "CANCELADO"]).default("PENDENTE"),
});

export const useContaPagarModal = ({
  afterSubmit,
  contaPagar,
}: Omit<ContaPagarModalProps, "open" | "changeOpen">) => {
  const [modalState, setModalState] = useState({} as FinanceiroModalStates);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedor | undefined>(
    undefined
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fornecedorId: 0,
      descricao: "",
      dataVencimento: "",
      valorTotal: 0,
      status: "PENDENTE",
    },
  });

  const handleFornecedorSelect = (fornecedor: Fornecedor) => {
    setFornecedorSelecionado(fornecedor);
  };

  const handleResetForm = () => {
    form.reset({
      fornecedorId: 0,
      descricao: "",
      dataVencimento: "",
      valorTotal: 0,
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
      valorTotal: typeof values.valorTotal === "number" ? values.valorTotal : decimalToCents(values.valorTotal),
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
        fornecedorId: contaPagar.fornecedorId,
        descricao: contaPagar.descricao || "",
        dataVencimento: contaPagar.dataVencimento
          ? new Date(contaPagar.dataVencimento).toISOString().split("T")[0]
          : "",
        valorTotal: contaPagar.valorTotal,
        status: contaPagar.status,
      });
      if (contaPagar.fornecedor) {
        setFornecedorSelecionado(contaPagar.fornecedor as any);
      }
    }
  }, [contaPagar, form]);

  return {
    form,
    onSubmit,
    fornecedorSelecionado,
    handleFornecedorSelect,
    modalState,
    handleResetForm,
  };
};

