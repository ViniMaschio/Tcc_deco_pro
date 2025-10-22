import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db as prisma } from "@/lib/prisma";

const createItemSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional().nullable(),
  tipo: z.enum(["PRO", "SER"]),
  precoBase: z.number().min(0, "Preço base deve ser maior ou igual a zero").default(0),
});

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(15),
  nome: z.string().optional(),
  descricao: z.string().optional(),
  tipo: z.enum(["PRO", "SER"]).optional(),
  sorting: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const { page, perPage, nome, descricao, tipo, sorting } = querySchema.parse(query);

    const skip = (page - 1) * perPage;
    const take = perPage;

    const where: {
      empresaId: number;
      deleted: boolean;
      nome?: {
        contains: string;
        mode: "insensitive";
      };
      descricao?: {
        contains: string;
        mode: "insensitive";
      };
      tipo?: "PRO" | "SER";
    } = {
      empresaId,
      deleted: false,
    };

    if (nome) {
      where.nome = {
        contains: nome,
        mode: "insensitive",
      };
    }

    if (descricao) {
      where.descricao = {
        contains: descricao,
        mode: "insensitive",
      };
    }

    if (tipo) {
      where.tipo = tipo as "PRO" | "SER";
    }

    const orderBy: Record<string, "asc" | "desc"> = {};
    if (sorting) {
      const [field, direction] = sorting.split(":");
      orderBy[field] = (direction as "asc" | "desc") || "asc";
    } else {
      orderBy.id = "asc";
    }

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.item.count({ where }),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return NextResponse.json({
      data: items,
      pagination: {
        page,
        perPage,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { local: null, message: "Usuário não autenticado!" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Dados recebidos:", body);

    const { nome, descricao, tipo, precoBase } = createItemSchema.parse(body);
    console.log("Dados validados:", { nome, descricao, tipo, precoBase });

    const item = await prisma.item.create({
      data: {
        nome,
        descricao: descricao || undefined,
        tipo,
        precoBase,
        empresaId,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Erro ao criar item:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
