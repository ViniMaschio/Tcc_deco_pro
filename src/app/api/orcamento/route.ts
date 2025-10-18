import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { db as prisma } from "@/lib/prisma";

const createOrcamentoSchema = z.object({
  clienteId: z.number(),
  categoriaId: z.number().optional(),
  localId: z.number().optional(),
  dataEvento: z.string().optional(),
  observacao: z.string().optional(),
  itens: z
    .array(
      z.object({
        itemId: z.number(),
        quantidade: z.number(),
        valorUnit: z.number(),
        desconto: z.number().default(0),
      })
    )
    .min(1, "Deve ter pelo menos um item"),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    const where: {
      empresaId: number;
      deleted: boolean;
      OR?: Array<{
        cliente?: { nome: { contains: string; mode: "insensitive" } };
        local?: { descricao: { contains: string; mode: "insensitive" } };
      }>;
      status?: "RASCUNHO" | "ENVIADO" | "APROVADO" | "REJEITADO" | "VENCIDO" | "CANCELADO";
    } = {
      empresaId: parseInt(session.user.id),
      deleted: false,
    };

    if (search) {
      where.OR = [
        { cliente: { nome: { contains: search, mode: "insensitive" } } },
        { local: { descricao: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (
      status &&
      ["RASCUNHO", "ENVIADO", "APROVADO", "REJEITADO", "VENCIDO", "CANCELADO"].includes(status)
    ) {
      where.status = status as
        | "RASCUNHO"
        | "ENVIADO"
        | "APROVADO"
        | "REJEITADO"
        | "VENCIDO"
        | "CANCELADO";
    }

    const [orcamentos, total] = await Promise.all([
      prisma.orcamento.findMany({
        where,
        include: {
          cliente: {
            select: { nome: true, telefone: true, email: true },
          },
          local: {
            select: { descricao: true },
          },
          categoriaFesta: {
            select: { descricao: true },
          },
          itens: {
            include: {
              item: {
                select: { nome: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.orcamento.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: orcamentos,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar orçamentos:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createOrcamentoSchema.parse(body);

    // Calcular total dos itens
    let total = 0;
    for (const item of validatedData.itens) {
      const valorTotal = item.quantidade * item.valorUnit - item.desconto;
      total += valorTotal;
    }

    const orcamento = await prisma.orcamento.create({
      data: {
        empresaId: parseInt(session.user.id),
        clienteId: validatedData.clienteId,
        categoriaId: validatedData.categoriaId,
        localId: validatedData.localId,
        dataEvento: validatedData.dataEvento ? new Date(validatedData.dataEvento) : null,
        observacao: validatedData.observacao,
        total,
        itens: {
          create: validatedData.itens.map((item) => ({
            itemId: item.itemId,
            quantidade: item.quantidade,
            valorUnit: item.valorUnit,
            desconto: item.desconto,
            valorTotal: item.quantidade * item.valorUnit - item.desconto,
          })),
        },
      },
      include: {
        cliente: {
          select: { nome: true, telefone: true, email: true },
        },
        local: {
          select: { descricao: true },
        },
        categoriaFesta: {
          select: { descricao: true },
        },
        itens: {
          include: {
            item: {
              select: { nome: true },
            },
          },
        },
      },
    });

    return NextResponse.json(orcamento, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Erro ao criar orçamento:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
