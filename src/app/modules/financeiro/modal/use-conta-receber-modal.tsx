import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { ContaReceber } from "@/app/api/conta-receber/types";
import { Contrato } from "@/app/modules/contrato/auto-complete/types";
import { decimalToCents } from "@/utils/currency";

import { ContaReceberModalProps, FinanceiroModalStates } from "../types";

const FormSchema = z.object({
  id: z.number().optional(),
  contratoId: z.number().int().positive().optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  dataVencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  valor: z.number().int().positive("Valor é obrigatório"),
  status: z.enum(["PENDENTE", "FINALIZADO"]),
});

export type FormValues = z.infer<typeof FormSchema>;

export const useContaReceberModal = ({
  afterSubmit,
  contaReceber,
}: Omit<ContaReceberModalProps, "open" | "changeOpen">) => {
  const [modalState, setModalState] = useState({} as FinanceiroModalStates);
  const [contratoSelecionado, setContratoSelecionado] = useState<Contrato | undefined>(undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contratoId: undefined,
      descricao: "",
      dataVencimento: "",
      valor: 0,
      status: "PENDENTE" as const,
    },
  });

  const generateDescricaoFromContrato = (contrato: Contrato): string => {
    return `Lançamento referente ao contrato nº ${contrato.id}`;
  };

  const handleContratoSelect = (contrato: Contrato | null) => {
    if (contrato) {
      setContratoSelecionado(contrato);

      // Gerar descrição automática
      const descricaoGerada = generateDescricaoFromContrato(contrato).toUpperCase();
      form.setValue("descricao", descricaoGerada);

      // Preencher valor do contrato se não houver valor preenchido
      if (!form.getValues("valor") || form.getValues("valor") === 0) {
        // O total do contrato vem em decimal da API, então precisamos converter para centavos
        const totalDecimal =
          typeof contrato.total === "number"
            ? contrato.total
            : parseFloat(String(contrato.total)) || 0;
        const valorContrato = decimalToCents(totalDecimal);
        form.setValue("valor", valorContrato);
      }
    } else {
      setContratoSelecionado(undefined);
      // Limpar descrição se o contrato for removido
      if (form.getValues("contratoId") === undefined) {
        form.setValue("descricao", "");
      }
    }
  };

  const handleResetForm = () => {
    form.reset({
      contratoId: undefined,
      descricao: "",
      dataVencimento: "",
      valor: 0,
      status: "PENDENTE",
    });
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
        contratoId: contaReceber.contratoId,
        descricao: contaReceber.descricao || "",
        dataVencimento: contaReceber.dataVencimento
          ? new Date(contaReceber.dataVencimento).toISOString().split("T")[0]
          : "",
        valor: contaReceber.valor || 0,
        status: contaReceber.status,
      });
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
    contratoSelecionado,
    handleContratoSelect,
    modalState,
    handleResetForm,
  };
};
