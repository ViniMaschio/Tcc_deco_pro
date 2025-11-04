"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { empresaSchema, EmpresaData } from "@/components/navbar/configuracao/types";
import { useConfiguracoes } from "@/components/navbar/configuracao/use-modal";
import { obterEmpresa } from "@/actions/empresa";
import { formatCEPCodeNumber } from "@/utils/mask";

interface ZipCodeResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export const useEmpresa = () => {
  const { data: session } = useSession();
  const { handleChangeConfiguracao } = useConfiguracoes();
  const [zipCodeLoading, setZipCodeLoading] = useState(false);

  // Formulário da empresa
  const empresaForm = useForm<EmpresaData>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      nome: "",
      razaoSocial: "",
      email: "",
      telefone: "",
      cnpj: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
  });

  const getEmpresa = async () => {
    if (!session?.user?.id) {
      throw new Error("Sessão não encontrada");
    }

    const empresaId = Number(session.user.id);
    const resultado = await obterEmpresa(empresaId);

    if (!resultado.ok || !resultado.data) {
      throw new Error(resultado.error || "Erro ao carregar dados da empresa");
    }

    return resultado.data;
  };

  const {
    data: empresaData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["empresa", session?.user?.id],
    queryFn: getEmpresa,
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (empresaData) {
      const formData = {
        nome: empresaData.nome || "",
        razaoSocial: empresaData.razaoSocial || "",
        email: empresaData.email || "",
        telefone: empresaData.telefone || "",
        cnpj: empresaData.cnpj || "",
        rua: empresaData.rua || "",
        numero: empresaData.numero || "",
        complemento: empresaData.complemento || "",
        bairro: empresaData.bairro || "",
        cidade: empresaData.cidade || "",
        estado: empresaData.estado || "",
        cep: empresaData.cep || "",
      };

      const currentValues = empresaForm.getValues();
      const hasChanges = Object.keys(formData).some(
        (key) => currentValues[key as keyof EmpresaData] !== formData[key as keyof EmpresaData]
      );

      if (hasChanges) {
        empresaForm.reset(formData, { keepDefaultValues: false });
      }
    }
  }, [empresaData]);

  // Sincronizar mudanças do formulário com o estado quando o usuário edita os campos
  useEffect(() => {
    const subscription = empresaForm.watch((data, { name }) => {
      if (data && name) {
        // Atualizar apenas o campo que mudou
        const value = data[name as keyof EmpresaData];
        handleChangeConfiguracao(`empresa.${name}`, value || "");
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setZipCodeLoading(true);

    try {
      empresaForm.setValue("rua", "");
      empresaForm.setValue("numero", "");
      empresaForm.setValue("bairro", "");
      empresaForm.setValue("cidade", "");
      empresaForm.setValue("estado", "");

      const data = await searchForZipCode(value);

      if (data && !data.erro) {
        empresaForm.setValue("rua", data.logradouro || "");
        empresaForm.setValue("bairro", data.bairro || "");
        empresaForm.setValue("cidade", data.localidade || "");
        empresaForm.setValue("estado", data.uf || "");
      }
    } finally {
      setZipCodeLoading(false);
    }
  };

  const handleSaveEmpresa = async (data: EmpresaData) => {
    if (!session?.user?.id) {
      throw new Error("Sessão não encontrada");
    }

    const empresaId = Number(session.user.id);
    const response = await fetch(`/api/empresa/${empresaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        cnpj: data.cnpj,
        rua: data.rua,
        numero: data.numero,
        complemento: data.complemento || null,
        bairro: data.bairro,
        cidade: data.cidade,
        cep: data.cep,
        estado: data.estado,
        razaoSocial: data.razaoSocial,
      }),
    });

    const resultado = await response.json();

    if (!response.ok) {
      throw new Error(resultado.message || "Erro ao salvar dados da empresa");
    }

    refetch();
    return resultado.empresa;
  };

  const { mutateAsync: saveEmpresaMutation } = useMutation({
    mutationFn: handleSaveEmpresa,
    mutationKey: ["saveEmpresa"],
  });

  const handleEmpresaSubmit = async (data: EmpresaData) => {
    // Sincronizar com o estado
    Object.entries(data).forEach(([key, value]) => {
      handleChangeConfiguracao(`empresa.${key}`, value);
    });

    try {
      const empresa = await saveEmpresaMutation(data);
      return { ok: true, data: empresa };
    } catch (error) {
      console.error("Erro ao salvar empresa:", error);
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Erro ao salvar dados da empresa",
      };
    }
  };

  return {
    empresaForm,
    handleEmpresaSubmit,
    searchZipCode,
    zipCodeLoading,
    isLoading: isLoading || isFetching,
  };
};
