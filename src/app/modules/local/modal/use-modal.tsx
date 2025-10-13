import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { formatCEPCodeNumber, formatPhoneNumber } from "@/utils/mask";

import { LocalModalProps, LocalModalStates, ZipCodeResponse } from "./types";

export const useLocalModal = ({
  afterSubmit,
  local,
}: Omit<LocalModalProps, "open" | "changeOpen">) => {
  const [localModalStates, setLocalModalStates] = useState(
    {} as LocalModalStates,
  );

  const FormSchema = z.object({
    id: z.number().optional(),
    descricao: z
      .string()
      .min(3, "A descrição deve ter pelo menos 3 caracteres"),
    rua: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
    cep: z.string().optional(),
    telefone: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      descricao: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      telefone: "",
    },
  });

  const searchForZipCode = async (value: string) => {
    try {
      const zipCode = value.replace(/[^a-zA-Z0-9 ]/g, "");
      if (!zipCode || zipCode?.length < 8) return null;

      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);

      if (response.status !== 200) throw new Error();

      const data: ZipCodeResponse = await response.json();

      return data;
    } catch (_error) {
      console.error(_error);
      return null;
    }
  };

  const searchZipCode = async (value: string) => {
    setLocalModalStates((previous) => ({
      ...previous,
      zipCode: true,
    }));

    form.reset((previous) => ({
      ...previous,
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
    }));

    const data = await searchForZipCode(value);

    if (data) {
      form.reset((previous) => ({
        ...previous,
        rua: data.logradouro || previous.rua,
        bairro: data.bairro || previous.bairro,
        cidade: data.localidade,
        estado: data.uf,
      }));
    }

    setLocalModalStates((previous) => ({
      ...previous,
      zipCode: false,
    }));
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const convertValues = {
      ...values,
      cep: values.cep?.replace("-", ""),
    };

    setLocalModalStates((previous) => ({
      ...previous,
      submitting: true,
    }));

    if (Number(values?.id) > 0) {
      const response = await fetch(`api/local/${values.id}`, {
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
        form.reset({
          descricao: "",
          rua: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
          telefone: "",
        });
        toast.success("Local atualizado com sucesso", {
          position: "top-center",
        });
      } else {
        afterSubmit();
        form.reset({
          descricao: "",
          rua: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
          telefone: "",
        });
        console.error("Occorreu um erro ao atualizado o Local!");
        toast.error("Erro ao atualizado o Local!", {
          position: "top-center",
        });
      }
    } else {
      const response = await fetch("api/local", {
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
        form.reset({
          descricao: "",
          rua: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
          telefone: "",
        });
        toast.success("Local criado com sucesso", {
          position: "top-center",
        });
      } else {
        afterSubmit();
        form.reset({
          descricao: "",
          rua: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
          telefone: "",
        });
        console.error("Occorreu um erro ao criar o Local!");
        toast.error("Erro ao criar Local!", {
          position: "top-center",
        });
      }
    }

    setLocalModalStates((previous) => ({
      ...previous,
      submitting: false,
    }));
  };

  const valuePhone = form.watch("telefone");
  const valueCep = form.watch("cep");

  useEffect(() => {
    form.setValue("telefone", formatPhoneNumber(valuePhone));
  }, [valuePhone, form]);

  useEffect(() => {
    form.setValue("cep", formatCEPCodeNumber(valueCep));
  }, [valueCep, form]);

  useEffect(() => {
    if (local?.id) form.reset(local);
  }, [local, form]);

  return {
    form,
    onSubmit,
    searchZipCode,
    localModalStates,
  };
};
