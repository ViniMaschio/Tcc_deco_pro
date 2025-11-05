import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db as prisma } from "@/lib/prisma";
import { decimalToCents, centsToDecimal } from "@/utils/currency";

const updateContratoSchema = z.object({
  clienteId: z.number().optional(),
  categoriaId: z.number().optional(),
  localId: z.number().optional(),
  orcamentoId: z.number().optional(),
  dataEvento: z.string().optional(),
  horaInicio: z.string().optional(),
  status: z.enum(["RASCUNHO", "ATIVO", "CONCLUIDO", "CANCELADO"]).optional(),
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
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const contrato = await prisma.contrato.findFirst({
      where: {
        id: parseInt((await params).id),
        empresaId,
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
        orcamento: {
          select: { id: true, uuid: true },
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

    if (!contrato) {
      return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });
    }

    // Converter valores de centavos para decimal na resposta
    const contratoFormatted = {
      ...contrato,
      total: centsToDecimal(contrato.total),
      desconto: contrato.desconto ? centsToDecimal(contrato.desconto) : undefined,
      itens: contrato.itens.map((item) => ({
        ...item,
        quantidade: item.quantidade / 1000, // Converter milésimos para decimal
        valorUnit: centsToDecimal(item.valorUnit),
        desconto: centsToDecimal(item.desconto),
        valorTotal: centsToDecimal(item.valorTotal),
      })),
    };

    return NextResponse.json(contratoFormatted);
  } catch (error) {
    console.error("Erro ao buscar contrato:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateContratoSchema.parse(body);

    // Verificar se o contrato existe
    const existingContrato = await prisma.contrato.findFirst({
      where: {
        id: parseInt((await params).id),
        empresaId,
        deleted: false,
      },
    });

    if (!existingContrato) {
      return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });
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
    if (validatedData.orcamentoId !== undefined) {
      updateData.orcamentoId = validatedData.orcamentoId;
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

    // Se horaInicio foi fornecida, combinar com dataEvento
    if (validatedData.horaInicio) {
      const dataEvento = validatedData.dataEvento
        ? new Date(validatedData.dataEvento)
        : existingContrato.dataEvento;

      // Parsear hora no formato "HH:mm"
      const [horas, minutos] = validatedData.horaInicio.split(":").map(Number);

      const dataHoraInicio = new Date(dataEvento);
      dataHoraInicio.setHours(horas, minutos, 0, 0);

      updateData.horaInicio = dataHoraInicio;
    }

    // Se itens foram fornecidos, recalcular total e atualizar itens
    if (validatedData.itens) {
      // Deletar itens existentes
      await prisma.contratoItem.deleteMany({
        where: { contratoId: parseInt((await params).id) },
      });

      // Converter valores decimais para centavos e calcular novo total
      let totalCents = 0;
      for (const item of validatedData.itens) {
        const valorUnitCents = decimalToCents(item.valorUnit);
        const descontoCents = decimalToCents(item.desconto || 0);
        const quantidadeMil = Math.round(item.quantidade * 1000);
        const valorTotalCents = Math.round((quantidadeMil * valorUnitCents) / 1000) - descontoCents;
        totalCents += valorTotalCents;
      }

      updateData.total = totalCents;
      updateData.itens = {
        create: validatedData.itens.map((item) => {
          const valorUnitCents = decimalToCents(item.valorUnit);
          const descontoCents = decimalToCents(item.desconto || 0);
          const quantidadeMil = Math.round(item.quantidade * 1000);
          const valorTotalCents =
            Math.round((quantidadeMil * valorUnitCents) / 1000) - descontoCents;

          return {
            itemId: item.itemId,
            quantidade: quantidadeMil,
            valorUnit: valorUnitCents,
            desconto: descontoCents,
            valorTotal: valorTotalCents,
          };
        }),
      };
    }

    const contrato = await prisma.contrato.update({
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
        orcamento: {
          select: { id: true, uuid: true },
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

    // Converter valores de centavos para decimal na resposta
    const contratoFormatted = {
      ...contrato,
      total: centsToDecimal(contrato.total),
      desconto: contrato.desconto ? centsToDecimal(contrato.desconto) : undefined,
      itens: contrato.itens.map((item) => ({
        ...item,
        quantidade: item.quantidade / 1000, // Converter milésimos para decimal
        valorUnit: centsToDecimal(item.valorUnit),
        desconto: centsToDecimal(item.desconto),
        valorTotal: centsToDecimal(item.valorTotal),
      })),
    };

    return NextResponse.json(contratoFormatted);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Erro ao atualizar contrato:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// DELETAR CONTRATO
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const contrato = await prisma.contrato.findFirst({
      where: {
        id,
        empresaId,
      },
      select: { id: true, deleted: true },
    });

    if (!contrato) {
      return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });
    }

    if (contrato.deleted) {
      return NextResponse.json({ error: "Contrato já deletado" }, { status: 400 });
    }

    await prisma.contrato.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/contrato/:id error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
