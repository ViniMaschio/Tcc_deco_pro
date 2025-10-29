import { z } from "zod";

export type ConfiguracoesUsuario = {
  tema: "light" | "dark" | "system";
  idioma: "pt-BR" | "en-US";
  notificacoes: {
    email: boolean;
    push: boolean;
    sistema: boolean;
  };
  privacidade: {
    perfilPublico: boolean;
    mostrarEmail: boolean;
    mostrarTelefone: boolean;
  };
  empresa: {
    nome: string;
    email: string;
    telefone?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  contrato: {
    titulo: string;
    valorBase: number;
    prazoEntrega: number;
    descontoMaximo: number;
    termos: string;
    observacoes?: string;
    clausulas: Clausula[];
  };
};

export interface ConfiguracoesState {
  loading: boolean;
  saving: boolean;
}

export type ConfiguracoesTabs = "tema" | "empresa" | "contrato";

// Tipo para cláusulas do contrato
export interface Clausula {
  id: string;
  titulo: string;
  conteudo: string;
  ordem: number;
}

// Schemas de validação
export const perfilSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
});

export const empresaSchema = z.object({
  nome: z.string().min(1, "Nome da empresa é obrigatório"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
});

export const clausulaSchema = z.object({
  id: z.string(),
  titulo: z.string().min(1, "Título da cláusula é obrigatório"),
  conteudo: z.string().min(1, "Conteúdo da cláusula é obrigatório"),
  ordem: z.number().min(0),
});

export const contratoSchema = z.object({
  titulo: z.string().min(1, "Título do contrato é obrigatório"),
  valorBase: z.number().min(0, "Valor base deve ser maior ou igual a zero"),
  prazoEntrega: z.number().min(1, "Prazo de entrega deve ser pelo menos 1 dia"),
  descontoMaximo: z.number().min(0).max(100, "Desconto máximo deve estar entre 0 e 100%"),
  termos: z.string().min(1, "Termos e condições são obrigatórios"),
  observacoes: z.string().optional(),
  clausulas: z.array(clausulaSchema),
});

export type PerfilData = z.infer<typeof perfilSchema>;
export type EmpresaData = z.infer<typeof empresaSchema>;
export type ContratoData = z.infer<typeof contratoSchema>;
