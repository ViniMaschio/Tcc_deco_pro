import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { formatCEPCodeNumber, formatCNPJNumber, formatPhoneNumber } from "@/utils/mask";

import { FornecedorModalProps, FornecedorModalStates, ZipCodeResponse } from "./types";

export const useFornecedorModal = ({
  afterSubmit,
  fornecedor,
}: Omit<FornecedorModalProps, "open" | "changeOpen">) => {
  const [fornecedorModalState, setFornecedorModalStates] = useState({} as FornecedorModalStates);

  const FormSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
    cnpj: z.string().optional(),
    email: z.string().email("Email inválido").optional(),
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
      nome: "",
      email: "",
      cnpj: "",
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
    setFornecedorModalStates((previous) => ({
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

    setFornecedorModalStates((previous) => ({
      ...previous,
      zipCode: false,
    }));
  };

  const handleResetForm = () => {
    form.reset({
      nome: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      telefone: "",
      cnpj: "",
    });
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const convertValues = {
      ...values,
      cep: values.cep?.replace("-", ""),
      telefone: values.telefone?.replace(/\D/g, ""),
      cnpj: values.cnpj?.replace(/\D/g, ""),
    };

    setFornecedorModalStates((previous) => ({
      ...previous,
      submitting: true,
    }));

    if (Number(values?.id) > 0) {
      const response = await fetch(`api/fornecedor/${values.id}`, {
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
        toast.success("Fornecedor atualizado com sucesso", {
          position: "top-center",
        });
      } else {
        afterSubmit();
        handleResetForm();
        console.error("Occorreu um erro ao atualizado o Fornecedor!");
        toast.error("Erro ao atualizado o Fornecedor!", {
          position: "top-center",
        });
      }
    } else {
      const response = await fetch("api/fornecedor", {
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
        toast.success("Fornecedor criado com sucesso", {
          position: "top-center",
        });
      } else {
        afterSubmit();
        handleResetForm();
        console.error("Occorreu um erro ao criar o Fornecedor!");
        toast.error("Erro ao criar Fornecedor!", {
          position: "top-center",
        });
      }
    }

    setFornecedorModalStates((previous) => ({
      ...previous,
      submitting: false,
    }));
  };

  const valuePhone = form.watch("telefone");
  const valueCep = form.watch("cep");
  const valueCnpj = form.watch("cnpj");

  useEffect(() => {
    form.setValue("telefone", formatPhoneNumber(valuePhone));
  }, [valuePhone, form]);

  useEffect(() => {
    form.setValue("cep", formatCEPCodeNumber(valueCep));
  }, [valueCep, form]);

  useEffect(() => {
    form.setValue("cnpj", formatCNPJNumber(valueCnpj));
  }, [valueCnpj, form]);

  useEffect(() => {
    if (fornecedor?.id) form.reset(fornecedor);
  }, [fornecedor, form]);

  return {
    form,
    onSubmit,
    searchZipCode,
    fornecedorModalState,
    handleResetForm,
  };
};
