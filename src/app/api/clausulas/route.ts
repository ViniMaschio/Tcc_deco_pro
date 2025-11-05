import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-server";
import { db } from "@/lib/prisma";
import { z } from "zod";

const clausulaTemplateSchema = z.object({
  titulo: z.string().min(1, "Título da cláusula é obrigatório"),
  conteudo: z.string().min(1, "Conteúdo da cláusula é obrigatório"),
  ordem: z.number().min(0),
  editavel: z.boolean().default(true),
  obrigatoria: z.boolean().default(false),
});

const clausulasSchema = z.object({
  clausulas: z.array(clausulaTemplateSchema),
});

// GET - Buscar cláusulas template da empresa
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const empresaId = Number(session.user.id);

    // Buscar as cláusulas da empresa
    const clausulas = await db.clausulaTemplate.findMany({
      where: {
        empresaId,
      },
      orderBy: {
        ordem: "asc",
      },
    });

    return NextResponse.json({
      message: "Cláusulas obtidas com sucesso",
      clausulas,
    });
  } catch (error) {
    console.error("Erro ao buscar cláusulas:", error);
    return NextResponse.json({ message: "Erro ao buscar cláusulas" }, { status: 500 });
  }
}

// POST - Criar ou atualizar cláusulas template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const empresaId = Number(session.user.id);
    const body = await request.json();

    const validation = clausulasSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Dados inválidos",
          errors: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { clausulas } = validation.data;

    // Remover todas as cláusulas antigas da empresa
    await db.clausulaTemplate.deleteMany({
      where: {
        empresaId,
      },
    });

    // Criar novas cláusulas
    if (clausulas.length > 0) {
      await db.clausulaTemplate.createMany({
        data: clausulas.map((clausula) => ({
          empresaId,
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
        empresaId,
      },
      orderBy: {
        ordem: "asc",
      },
    });

    return NextResponse.json({
      message: "Cláusulas salvas com sucesso",
      clausulas: clausulasCriadas,
    });
  } catch (error) {
    console.error("Erro ao salvar cláusulas:", error);
    return NextResponse.json({ message: "Erro ao salvar cláusulas" }, { status: 500 });
  }
}
