"use server";

import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-server";

export interface ClausulaTemplateResult {
  ok: boolean;
  data?: Array<{
    id: number;
    uuid: string;
    titulo: string;
    conteudo: string;
    ordem: number;
    editavel: boolean;
    obrigatoria: boolean;
    empresaId: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  error?: string;
}

export async function obterClausulasTemplate(empresaId: number): Promise<ClausulaTemplateResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        ok: false,
        error: "Não autorizado",
      };
    }

    // Verificar se o usuário tem acesso a esta empresa
    if (Number(session.user.id) !== empresaId) {
      return {
        ok: false,
        error: "Acesso negado",
      };
    }

    const clausulas = await db.clausulaTemplate.findMany({
      where: {
        empresaId,
      },
      orderBy: {
        ordem: "asc",
      },
    });

    return {
      ok: true,
      data: clausulas,
    };
  } catch (error) {
    console.error("Erro ao buscar cláusulas template:", error);
    return {
      ok: false,
      error: "Erro ao buscar cláusulas template",
    };
  }
}

export interface SalvarClausulasTemplateInput {
  empresaId: number;
  clausulas: Array<{
    titulo: string;
    conteudo: string;
    ordem: number;
    editavel: boolean;
    obrigatoria: boolean;
  }>;
}

export async function salvarClausulasTemplate(
  input: SalvarClausulasTemplateInput
): Promise<ClausulaTemplateResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        ok: false,
        error: "Não autorizado",
      };
    }

    // Verificar se o usuário tem acesso a esta empresa
    if (Number(session.user.id) !== input.empresaId) {
      return {
        ok: false,
        error: "Acesso negado",
      };
    }

    // Remover todas as cláusulas antigas da empresa
    await db.clausulaTemplate.deleteMany({
      where: {
        empresaId: input.empresaId,
      },
    });

    // Criar novas cláusulas
    if (input.clausulas.length > 0) {
      await db.clausulaTemplate.createMany({
        data: input.clausulas.map((clausula) => ({
          empresaId: input.empresaId,
          titulo: clausula.titulo,
          conteudo: clausula.conteudo,
          ordem: clausula.ordem,
          editavel: clausula.editavel,
          obrigatoria: clausula.obrigatoria,
        })),
      });
    }

    // Buscar as cláusulas criadas para retornar
    const clausulasCriadas = await db.clausulaTemplate.findMany({
      where: {
        empresaId: input.empresaId,
      },
      orderBy: {
        ordem: "asc",
      },
    });

    return {
      ok: true,
      data: clausulasCriadas,
    };
  } catch (error) {
    console.error("Erro ao salvar cláusulas template:", error);
    return {
      ok: false,
      error: "Erro ao salvar cláusulas template",
    };
  }
}
