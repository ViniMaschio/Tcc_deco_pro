import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { CategoriaFestaModalProps, CategoriaFestaModalStates } from "./types";

export const useCategoriaFestaModal = ({
  afterSubmit,
  categoriaFesta,
}: Omit<CategoriaFestaModalProps, "open" | "changeOpen">) => {
  const [categoriaFestaModalState, setCategoriaFestaModalStates] = useState(
    {} as CategoriaFestaModalStates
  );

  const FormSchema = z.object({
    id: z.number().optional(),
    descricao: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      descricao: "",
    },
  });

  const handleResetForm = () => {
    form.reset({
      descricao: "",
    });
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setCategoriaFestaModalStates((previous) => ({
      ...previous,
      submitting: true,
    }));

    if (Number(values?.id) > 0) {
      const response = await fetch(`api/categoria-festa/${values.id}`, {
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
        toast.success("Categoria de festa atualizada com sucesso", {
          position: "top-center",
        });
      } else {
        afterSubmit();
        handleResetForm();
        console.error("Ocorreu um erro ao atualizar a Categoria de festa!");
        toast.error("Erro ao atualizar a Categoria de festa!", {
          position: "top-center",
        });
      }
    } else {
      const response = await fetch("api/categoria-festa", {
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
        toast.success("Categoria de festa criada com sucesso", {
          position: "top-center",
        });
      } else {
        afterSubmit();
        handleResetForm();
        console.error("Ocorreu um erro ao criar a Categoria de festa!");
        toast.error("Erro ao criar Categoria de festa!", {
          position: "top-center",
        });
      }
    }

    setCategoriaFestaModalStates((previous) => ({
      ...previous,
      submitting: false,
    }));
  };

  useEffect(() => {
    if (categoriaFesta?.id) form.reset(categoriaFesta);
  }, [categoriaFesta, form]);

  return {
    form,
    onSubmit,
    categoriaFestaModalState,
    handleResetForm,
  };
};
