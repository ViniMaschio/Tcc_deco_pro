"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTema } from "./use-index";
import { TemaTabProps } from "../../types";

export const TemaTab = ({ onClose }: TemaTabProps) => {
  const { configuracoes, handleChangeConfiguracao } = useTema();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Tema do Sistema</Label>
        <Select
          value={configuracoes.tema}
          onValueChange={(value) => handleChangeConfiguracao("tema", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Claro</SelectItem>
            <SelectItem value="dark">Escuro</SelectItem>
            <SelectItem value="system">Sistema</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-sm">
          Escolha entre tema claro, escuro ou seguir as configurações do sistema
        </p>
      </div>

      <div className="space-y-2">
        <Label>Idioma</Label>
        <Select
          value={configuracoes.idioma}
          onValueChange={(value) => handleChangeConfiguracao("idioma", value)}
        >
          <SelectTrigger disabled>
            <SelectValue placeholder="Selecione o idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
            <SelectItem value="en-US">English (US)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-sm">Idioma da interface do sistema</p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
};
