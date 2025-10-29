"use client";

import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmpresa } from "./use-index";

export const EmpresaTab = () => {
  const { empresaForm, handleEmpresaSubmit } = useEmpresa();

  return (
    <form onSubmit={empresaForm.handleSubmit(handleEmpresaSubmit)} className="w-full space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="empresa-nome">Nome da Empresa</Label>
          <Input
            id="empresa-nome"
            {...empresaForm.register("nome")}
            placeholder="Digite o nome da empresa"
          />
          {empresaForm.formState.errors.nome && (
            <p className="text-sm text-red-500">{empresaForm.formState.errors.nome.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="empresa-email">Email da Empresa</Label>
          <Input
            id="empresa-email"
            type="email"
            {...empresaForm.register("email")}
            placeholder="Digite o email da empresa"
          />
          {empresaForm.formState.errors.email && (
            <p className="text-sm text-red-500">{empresaForm.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="empresa-telefone">Telefone</Label>
          <Input
            id="empresa-telefone"
            {...empresaForm.register("telefone")}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="empresa-cep">CEP</Label>
          <Input id="empresa-cep" {...empresaForm.register("cep")} placeholder="00000-000" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="empresa-endereco">Endereço</Label>
          <Input
            id="empresa-endereco"
            {...empresaForm.register("endereco")}
            placeholder="Rua, número, bairro"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="empresa-cidade">Cidade</Label>
          <Input
            id="empresa-cidade"
            {...empresaForm.register("cidade")}
            placeholder="Digite a cidade"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="empresa-estado">Estado</Label>
          <Input
            id="empresa-estado"
            {...empresaForm.register("estado")}
            placeholder="Digite o estado"
          />
        </div>
      </div>
    </form>
  );
};
