"use client";

import { FileText, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContrato } from "./use-index";

export const ContratoTab = () => {
  const {
    contratoForm,
    handleContratoSubmit,
    clausulas,
    adicionarClausula,
    atualizarClausula,
    removerClausula,
    moverClausula,
  } = useContrato();

  return (
    <form onSubmit={contratoForm.handleSubmit(handleContratoSubmit as any)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Cláusulas do Contrato</h3>
          <Button
            type="button"
            onClick={adicionarClausula}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Cláusula
          </Button>
        </div>

        {clausulas.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="text-muted-foreground mb-4">Nenhuma cláusula adicionada ainda.</p>
              <Button
                type="button"
                onClick={adicionarClausula}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Primeira Cláusula
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="max-h-96 space-y-4 overflow-y-auto rounded-md border p-2">
            {clausulas
              .sort((a, b) => a.ordem - b.ordem)
              .map((clausula, index) => (
                <Card key={clausula.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Cláusula {index + 1}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => moverClausula(clausula.id, "up")}
                          disabled={index === 0}
                          className="border-accent-foreground h-10 min-w-10"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => moverClausula(clausula.id, "down")}
                          disabled={index === clausulas.length - 1}
                          className="border-accent-foreground h-10 min-w-10"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removerClausula(clausula.id)}
                          className="border-accent-foreground h-10 min-w-10 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-2">
                      <Label htmlFor={`clausula-titulo-${clausula.id}`}>Título da Cláusula</Label>
                      <Input
                        id={`clausula-titulo-${clausula.id}`}
                        value={clausula.titulo}
                        onChange={(e) => atualizarClausula(clausula.id, "titulo", e.target.value)}
                        placeholder="Digite o título da cláusula"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`clausula-conteudo-${clausula.id}`}>
                        Conteúdo da Cláusula
                      </Label>
                      <Textarea
                        id={`clausula-conteudo-${clausula.id}`}
                        value={clausula.conteudo}
                        onChange={(e) => atualizarClausula(clausula.id, "conteudo", e.target.value)}
                        placeholder="Digite o conteúdo da cláusula"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="contrato-termos">Termos e Condições</Label>
          <Textarea
            id="contrato-termos"
            {...contratoForm.register("termos")}
            placeholder="Digite os termos e condições do contrato"
            rows={6}
          />
          {contratoForm.formState.errors.termos && (
            <p className="text-sm text-red-500">{contratoForm.formState.errors.termos.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="contrato-observacoes">Observações</Label>
          <Textarea
            id="contrato-observacoes"
            {...contratoForm.register("observacoes")}
            placeholder="Observações adicionais sobre o contrato"
            rows={3}
          />
        </div>
      </div>
    </form>
  );
};
