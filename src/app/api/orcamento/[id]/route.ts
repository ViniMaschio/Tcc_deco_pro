import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { db as prisma } from "@/lib/prisma";

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
    const session = await getServerSession(authOptions);
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
    const session = await getServerSession(authOptions);
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

    const updateData: any = { ...validatedData };

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
        const valorTotal = item.quantidade * item.valorUnit - item.desconto;
        total += valorTotal;
      }

      updateData.total = total;
      updateData.itens = {
        create: validatedData.itens.map((item) => ({
          itemId: item.itemId,
          quantidade: item.quantidade,
          valorUnit: item.valorUnit,
          desconto: item.desconto,
          valorTotal: item.quantidade * item.valorUnit - item.desconto,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const orcamento = await prisma.orcamento.findFirst({
      where: {
        id: parseInt((await params).id),
        empresaId: parseInt(session.user.id),
        deleted: false,
      },
    });

    if (!orcamento) {
      return NextResponse.json({ error: "Orçamento não encontrado" }, { status: 404 });
    }

    await prisma.orcamento.update({
      where: { id: parseInt((await params).id) },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Orçamento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir orçamento:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
