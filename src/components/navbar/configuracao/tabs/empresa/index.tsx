"use client";

import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputCnpj } from "@/components/input/input-cnpj";
import { InputWithSearch } from "@/components/input-search";
import { formatCEPCodeNumber } from "@/utils/mask";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmpresa } from "./use-index";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { obterEmpresa } from "@/actions/empresa";
import { useConfiguracoes } from "../../use-modal";
import { EmpresaTabProps } from "../../types";
import { UploadLogo } from "@/components/ui/upload-logo";

export const EmpresaTab = ({ onClose }: EmpresaTabProps) => {
  const {
    empresaForm,
    handleEmpresaSubmit,
    searchZipCode,
    zipCodeLoading,
    isLoading,
    handleUploadLogo,
  } = useEmpresa();
  const [saving, setSaving] = useState(false);
  const { data: session, update } = useSession();
  const { handleChangeConfiguracao } = useConfiguracoes();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    const isValid = await empresaForm.trigger();
    if (!isValid) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    setSaving(true);
    try {
      const formData = empresaForm.getValues();
      const resultado = await handleEmpresaSubmit(formData);

      if (!resultado.ok) {
        toast.error(resultado.error || "Erro ao salvar dados da empresa!");
        return;
      }

      if (session?.user?.id) {
        const empresaId = Number(session.user.id);
        const empresaAtualizada = await obterEmpresa(empresaId);
        if (empresaAtualizada.ok && empresaAtualizada.data) {
          const empresa = empresaAtualizada.data;
          handleChangeConfiguracao("empresa.nome", empresa.nome || "");
          handleChangeConfiguracao("empresa.razaoSocial", empresa.razaoSocial || "");
          handleChangeConfiguracao("empresa.email", empresa.email || "");
          handleChangeConfiguracao("empresa.telefone", empresa.telefone || "");
          handleChangeConfiguracao("empresa.cnpj", empresa.cnpj || "");
          handleChangeConfiguracao("empresa.rua", empresa.rua || "");
          handleChangeConfiguracao("empresa.numero", empresa.numero || "");
          handleChangeConfiguracao("empresa.complemento", empresa.complemento || "");
          handleChangeConfiguracao("empresa.bairro", empresa.bairro || "");
          handleChangeConfiguracao("empresa.cidade", empresa.cidade || "");
          handleChangeConfiguracao("empresa.estado", empresa.estado || "");
          handleChangeConfiguracao("empresa.cep", empresa.cep || "");
          handleChangeConfiguracao("empresa.logoUrl", empresa.logoUrl || null);

          if (empresa.nome !== session?.user?.name) {
            await update({
              ...session,
              user: {
                ...session?.user,
                name: empresa.nome,
              },
            });
          }
        }
      }

      // Invalidar queries para atualizar a navbar e outras partes que usam dados da empresa
      if (session?.user?.id) {
        await queryClient.invalidateQueries({
          queryKey: ["empresa-navbar", session.user.id],
        });
        await queryClient.invalidateQueries({
          queryKey: ["empresa", session.user.id],
        });
      }

      toast.success("Dados da empresa salvos com sucesso!");
      onClose?.();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar dados da empresa!");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5 lg:gap-5">
          <div className="col-span-1 space-y-2 sm:col-span-1 lg:col-span-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="col-span-1 space-y-2 sm:col-span-2 lg:col-span-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="col-span-1 space-y-2 sm:col-span-1 lg:col-span-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="col-span-1 space-y-2 sm:col-span-2 lg:col-span-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="col-span-1 space-y-2 sm:col-span-1 lg:col-span-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="col-span-1 space-y-2 sm:col-span-1 lg:col-span-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="col-span-1 space-y-2 sm:col-span-1 lg:col-span-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="col-span-1 space-y-2 sm:col-span-1 lg:col-span-1">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="col-span-1 space-y-2 sm:col-span-1 lg:col-span-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="col-span-1 space-y-2 sm:col-span-1 lg:col-span-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="col-span-1 space-y-2 sm:col-span-1 lg:col-span-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="col-span-1 space-y-2 sm:col-span-1 lg:col-span-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  return (
    <Form {...empresaForm}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="w-full space-y-4"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5 lg:gap-5">
          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <FormField
              control={empresaForm.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da Empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <FormField
              control={empresaForm.control}
              name="razaoSocial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razão Social</FormLabel>
                  <FormControl>
                    <Input placeholder="Razão Social" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <FormField
              control={empresaForm.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <InputCnpj {...field} placeholder="00.000.000/0000-00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <FormField
              control={empresaForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="E-mail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-1">
            <FormField
              control={empresaForm.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <FormField
              control={empresaForm.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-our-text-gray font-bold">CEP</FormLabel>
                  <FormControl>
                    <InputWithSearch
                      onSearch={(value) => searchZipCode(value?.toString() || "")}
                      searching={zipCodeLoading}
                      placeholder="CEP"
                      {...field}
                      onChange={(e) => {
                        const formattedValue = formatCEPCodeNumber(e.target.value);
                        field.onChange(formattedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <FormField
              control={empresaForm.control}
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-1">
            <FormField
              control={empresaForm.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="UF"
                      maxLength={2}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <FormField
              control={empresaForm.control}
              name="rua"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <FormField
              control={empresaForm.control}
              name="bairro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-1">
            <FormField
              control={empresaForm.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero</FormLabel>
                  <FormControl>
                    <Input placeholder="Numero" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <FormField
              control={empresaForm.control}
              name="complemento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input placeholder="Complemento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Campo de Upload de Logo */}
        <div className="w-full max-w-xs">
          <FormField
            control={empresaForm.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo da Empresa</FormLabel>
                <FormControl>
                  <UploadLogo
                    value={field.value}
                    onChange={(url) => {
                      field.onChange(url);
                      handleChangeConfiguracao("empresa.logoUrl", url);
                    }}
                    onUpload={handleUploadLogo}
                    disabled={saving}
                    className="h-32 w-32"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            loading={saving}
            className="min-w-[100px]"
          >
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
};
