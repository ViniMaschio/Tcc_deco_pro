import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth-server";
import { db as prisma } from "@/lib/prisma";

// Função utilitária para buscar orçamento por ID
export async function obterOrcamento(orcamentoId: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { ok: false, error: "Não autorizado" };
    }

    const orcamento = await prisma.orcamento.findFirst({
      where: {
        id: orcamentoId,
        empresaId: parseInt(session.user.id),
        deleted: false,
      },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            telefone: true,
            email: true,
            cpf: true,
            rua: true,
            numero: true,
            bairro: true,
            cidade: true,
            estado: true,
            cep: true,
          },
        },
        local: {
          select: { id: true, descricao: true },
        },
        categoriaFesta: {
          select: { id: true, descricao: true },
        },
        itens: {
          include: {
            item: {
              select: { id: true, nome: true, descricao: true, tipo: true },
            },
          },
        },
      },
    });

    if (!orcamento) {
      return { ok: false, error: "Orçamento não encontrado" };
    }

    // Converter null para undefined para compatibilidade com o tipo Orcamento
    const orcamentoFormatted = {
      ...orcamento,
      categoriaId: orcamento.categoriaId ?? undefined,
      localId: orcamento.localId ?? undefined,
      dataEvento: orcamento.dataEvento ?? undefined,
      desconto: orcamento.desconto ?? undefined,
      observacao: orcamento.observacao ?? undefined,
      deletedAt: orcamento.deletedAt ?? undefined,
      cliente: orcamento.cliente
        ? {
            ...orcamento.cliente,
            telefone: orcamento.cliente.telefone ?? undefined,
            email: orcamento.cliente.email ?? undefined,
          }
        : undefined,
      local: orcamento.local
        ? {
            ...orcamento.local,
          }
        : undefined,
      categoriaFesta: orcamento.categoriaFesta
        ? {
            ...orcamento.categoriaFesta,
          }
        : undefined,
      itens: orcamento.itens?.map((item) => ({
        ...item,
        nome: item.item?.nome || "",
        deletedAt: item.deletedAt ?? undefined,
        item: item.item
          ? {
              ...item.item,
              descricao: item.item.descricao ?? undefined,
            }
          : undefined,
      })),
    };

    return { ok: true, data: orcamentoFormatted };
  } catch (error) {
    console.error("Erro ao buscar orçamento:", error);
    return { ok: false, error: "Erro interno do servidor" };
  }
}

const updateOrcamentoSchema = z.object({
  clienteId: z.number().optional(),
  categoriaId: z.number().optional(),
  localId: z.number().optional(),
  dataEvento: z.string().optional(),
  status: z
    .enum(["RASCUNHO", "ENVIADO", "APROVADO", "REJEITADO", "VENCIDO", "CANCELADO"])
    .optional(),
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
    .optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const orcamento = await prisma.orcamento.findFirst({
      where: {
        id: parseInt((await params).id),
        empresaId: parseInt(session.user.id),
        deleted: false,
      },
      include: {
        cliente: {
          select: { id: true, nome: true, telefone: true, email: true },
        },
        local: {
          select: { id: true, descricao: true },
        },
        categoriaFesta: {
          select: { id: true, descricao: true },
        },
        itens: {
          include: {
            item: {
              select: { id: true, nome: true, descricao: true, tipo: true },
            },
          },
        },
      },
    });

    if (!orcamento) {
      return NextResponse.json({ error: "Orçamento não encontrado" }, { status: 404 });
    }

    return NextResponse.json(orcamento);
  } catch (error) {
    console.error("Erro ao buscar orçamento:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateOrcamentoSchema.parse(body);

    // Verificar se o orçamento existe
    const existingOrcamento = await prisma.orcamento.findFirst({
      where: {
        id: parseInt((await params).id),
        empresaId: parseInt(session.user.id),
        deleted: false,
      },
    });

    if (!existingOrcamento) {
      return NextResponse.json({ error: "Orçamento não encontrado" }, { status: 404 });
    }

    // Construir objeto de atualização removendo propriedades undefined
    const updateData: any = {};

    if (validatedData.clienteId !== undefined) {
      updateData.clienteId = validatedData.clienteId;
    }
    if (validatedData.categoriaId !== undefined) {
      updateData.categoriaId = validatedData.categoriaId;
    }
    if (validatedData.localId !== undefined) {
      updateData.localId = validatedData.localId;
    }
    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status;
    }
    if (validatedData.observacao !== undefined) {
      updateData.observacao = validatedData.observacao;
    }

    // Se dataEvento foi fornecida, converter para Date
    if (validatedData.dataEvento) {
      updateData.dataEvento = new Date(validatedData.dataEvento);
    }

    // Se itens foram fornecidos, recalcular total e atualizar itens
    if (validatedData.itens) {
      // Deletar itens existentes
      await prisma.orcamentoItem.deleteMany({
        where: { orcamentoId: parseInt((await params).id) },
      });

      // Calcular novo total
      let total = 0;
      for (const item of validatedData.itens) {
        const valorTotal = item.quantidade * item.valorUnit - (item.desconto || 0);
        total += valorTotal;
      }

      updateData.total = total;
      updateData.itens = {
        create: validatedData.itens.map((item) => ({
          itemId: item.itemId,
          quantidade: item.quantidade,
          valorUnit: item.valorUnit,
          desconto: item.desconto || 0,
          valorTotal: item.quantidade * item.valorUnit - (item.desconto || 0),
        })),
      };
    }

    const orcamento = await prisma.orcamento.update({
      where: { id: parseInt((await params).id) },
      data: updateData,
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

    return NextResponse.json(orcamento);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Erro ao atualizar orçamento:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// DELETAR ORÇAMENTO
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const resolvedParams = await params;
    const empresaId = parseInt(session.user.id);
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const orcamento = await prisma.orcamento.findFirst({
      where: {
        id,
        empresaId,
      },
      select: { id: true, deleted: true },
    });

    if (!orcamento) {
      return NextResponse.json({ error: "Orçamento não encontrado" }, { status: 404 });
    }

    if (orcamento.deleted) {
      return NextResponse.json({ error: "Orçamento já deletado" }, { status: 400 });
    }

    await prisma.orcamento.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/orcamento/:id error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
