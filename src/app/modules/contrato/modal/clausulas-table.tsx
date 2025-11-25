"use client";

import { FileText, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Clausula {
  id?: number;
  ordem: number;
  titulo: string;
  conteudo: string;
  templateClausulaId?: number;
  alteradaPeloUsuario?: boolean;
}

interface ClausulasTableProps {
  clausulas: Clausula[];
  onAddClausula: () => void;
  onUpdateClausula: (index: number, field: keyof Clausula, value: string | number) => void;
  onRemoveClausula: (index: number) => void;
  onMoveClausula: (index: number, direction: "up" | "down") => void;
}

export const ClausulasTable = ({
  clausulas,
  onAddClausula,
  onUpdateClausula,
  onRemoveClausula,
  onMoveClausula,
}: ClausulasTableProps) => {
  const clausulasOrdenadas = [...clausulas].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Cláusulas do Contrato</h3>
        <Button
          type="button"
          onClick={onAddClausula}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Cláusula
        </Button>
      </div>

      {clausulasOrdenadas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground mb-4">Nenhuma cláusula adicionada ainda.</p>
            <Button
              type="button"
              onClick={onAddClausula}
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
          {clausulasOrdenadas.map((clausula, index) => (
            <Card key={clausula.id || `clausula-${clausula.ordem}-${index}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Cláusula {index + 1}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onMoveClausula(index, "up")}
                      disabled={index === 0}
                      className="border-accent-foreground h-10 min-w-10"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onMoveClausula(index, "down")}
                      disabled={index === clausulasOrdenadas.length - 1}
                      className="border-accent-foreground h-10 min-w-10"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onRemoveClausula(index)}
                      className="border-accent-foreground h-10 min-w-10 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor={`clausula-titulo-${index}`}>Título da Cláusula</Label>
                  <Input
                    id={`clausula-titulo-${index}`}
                    value={clausula.titulo}
                    onChange={(e) => onUpdateClausula(index, "titulo", e.target.value)}
                    placeholder="Digite o título da cláusula"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`clausula-conteudo-${index}`}>Conteúdo da Cláusula</Label>
                  <Textarea
                    id={`clausula-conteudo-${index}`}
                    value={clausula.conteudo}
                    onChange={(e) => onUpdateClausula(index, "conteudo", e.target.value)}
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
  );
};
