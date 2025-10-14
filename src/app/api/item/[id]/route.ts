import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { db as prisma } from "@/lib/prisma";

const updateItemSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").optional(),
  descricao: z.string().optional(),
  tipo: z.enum(["PRO", "SER"]).optional(),
  precoBase: z.number().min(0, "Preço base deve ser maior ou igual a zero").optional(),
});

const paramsSchema = z.object({
  id: z.coerce.number().min(1),
});

async function ensureEmpresaId() {
  const session = await getServerSession(authOptions);
  const num = Number(session?.user?.id);
  return Number.isFinite(num) ? num : null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = paramsSchema.parse(await params);

    const item = await prisma.item.findFirst({
      where: {
        id,
        empresaId,
        deleted: false,
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "ID inválido", details: error.issues }, { status: 400 });
    }

    console.error("Erro ao buscar item:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = paramsSchema.parse(await params);
    const body = await request.json();
    const updateData = updateItemSchema.parse(body);

    const existingItem = await prisma.item.findFirst({
      where: {
        id,
        empresaId,
        deleted: false,
      },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
    }

    const item = await prisma.item.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Erro ao atualizar item:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = paramsSchema.parse(await params);

    const existingItem = await prisma.item.findFirst({
      where: {
        id,
        empresaId,
        deleted: false,
      },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
    }

    if (existingItem.deleted) {
      return NextResponse.json({ error: "Item já deletado" }, { status: 400 });
    }

    await prisma.item.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Item deletado com sucesso!" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "ID inválido", details: error.issues }, { status: 400 });
    }

    console.error("Erro ao excluir item:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
