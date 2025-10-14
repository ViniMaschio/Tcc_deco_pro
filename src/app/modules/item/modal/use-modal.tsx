import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { ItemModalProps, ItemModalStates } from "./types";

export const useItemModal = ({
  afterSubmit,
  item,
}: Omit<ItemModalProps, "open" | "changeOpen">) => {
  const [itemModalState, setItemModalStates] = useState({} as ItemModalStates);

  const FormSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    descricao: z.string().optional(),
    tipo: z.enum(["PRO", "SER"]),
    precoBase: z.number().min(0, "Preço base deve ser maior ou igual a zero"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      tipo: "PRO" as const,
      precoBase: 0,
    },
  });

  const handleResetForm = () => {
    form.reset({
      nome: "",
      descricao: "",
      tipo: "PRO" as const,
      precoBase: 0,
    });
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setItemModalStates((previous) => ({
      ...previous,
      submitting: true,
    }));

    if (Number(values?.id) > 0) {
      const response = await fetch(`api/item/${values.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
        }),
      });

      if (response.ok) {
        afterSubmit();
        handleResetForm();
        toast.success("Item atualizado com sucesso", {
          position: "top-center",
        });
      } else {
        afterSubmit();
        handleResetForm();
        console.error("Ocorreu um erro ao atualizar o Item!");
        toast.error("Erro ao atualizar o Item!", {
          position: "top-center",
        });
      }
    } else {
      const response = await fetch("api/item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
        }),
      });

      if (response.ok) {
        afterSubmit();
        handleResetForm();
        toast.success("Item criado com sucesso", {
          position: "top-center",
        });
      } else {
        afterSubmit();
        handleResetForm();
        console.error("Ocorreu um erro ao criar o Item!");
        toast.error("Erro ao criar Item!", {
          position: "top-center",
        });
      }
    }

    setItemModalStates((previous) => ({
      ...previous,
      submitting: false,
    }));
  };

  useEffect(() => {
    if (item?.id) {
      form.reset({
        id: item.id,
        nome: item.nome,
        descricao: item.descricao || "",
        tipo: item.tipo,
        precoBase: item.precoBase,
      });
    }
  }, [item, form]);

  return {
    form,
    onSubmit,
    itemModalState,
    handleResetForm,
  };
};
