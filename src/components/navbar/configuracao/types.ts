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
    razaoSocial?: string;
    email: string;
    telefone?: string;
    cnpj?: string;
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    logoUrl?: string | null;
  };
  contrato: {
    observacoes?: string;
    clausulas: Clausula[];
  };
};

export interface ConfiguracoesState {
  loading: boolean;
  saving: boolean;
}

export type ConfiguracoesTabs = "tema" | "empresa" | "contrato";

export interface Clausula {
  id: string;
  titulo: string;
  conteudo: string;
  ordem: number;
}

export interface ConfiguracoesModalProps {
  open: boolean;
  changeOpen: (open: boolean) => void;
}

export interface MountTabsProps {
  onClose?: () => void;
}

export interface EmpresaTabProps {
  onClose?: () => void;
}

export interface ContratoTabProps {
  onClose?: () => void;
}

export interface TemaTabProps {
  onClose?: () => void;
}

export interface ZipCodeResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export const perfilSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
});

export const empresaSchema = z.object({
  nome: z.string().min(1, "Nome da empresa é obrigatório"),
  razaoSocial: z.string().optional(),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  cnpj: z.string().optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  logoUrl: z.union([z.string().url(), z.null(), z.literal("")]).optional(),
});

export const clausulaSchema = z.object({
  id: z.string(),
  titulo: z.string().min(1, "Título da cláusula é obrigatório"),
  conteudo: z.string().min(1, "Conteúdo da cláusula é obrigatório"),
  ordem: z.number().min(0),
});

export const contratoSchema = z.object({
  observacoes: z.string().optional(),
  clausulas: z.array(clausulaSchema),
});

export type PerfilData = z.infer<typeof perfilSchema>;
export type EmpresaData = z.infer<typeof empresaSchema>;
export type ContratoData = z.infer<typeof contratoSchema>;
