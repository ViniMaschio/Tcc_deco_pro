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
        quantidade: z.number().positive("Quantidade deve ser maior que zero"),
        valorUnit: z.number(),
        desconto: z.number().default(0),
      })
    )
    .optional(),
  clausulas: z
    .array(
      z.object({
        ordem: z.number(),
        titulo: z.string(),
        conteudo: z.string(),
        templateClausulaId: z.number().nullable().optional(),
        alteradaPeloUsuario: z.boolean().optional(),
      })
    )
    .optional(),
});

export async function obterContrato(contratoId: number) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return { ok: false, error: "Não autorizado" };
    }

    const contrato = await prisma.contrato.findFirst({
      where: {
        id: contratoId,
        empresaId,
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
        clausulas: {
          orderBy: { ordem: "asc" },
        },
      },
    });

    if (!contrato) {
      return { ok: false, error: "Contrato não encontrado" };
    }

    const contratoFormatted = {
      ...contrato,
      categoriaId: contrato.categoriaId ?? undefined,
      localId: contrato.localId ?? undefined,
      orcamentoId: contrato.orcamentoId ?? undefined,
      total: centsToDecimal(contrato.total),
      desconto: contrato.desconto ? centsToDecimal(contrato.desconto) : undefined,
      observacao: contrato.observacao ?? undefined,
      deletedAt: contrato.deletedAt ?? undefined,
      cliente: contrato.cliente
        ? {
            ...contrato.cliente,
            telefone: contrato.cliente.telefone ?? undefined,
            email: contrato.cliente.email ?? undefined,
            cpf: contrato.cliente.cpf ?? undefined,
            rua: contrato.cliente.rua ?? undefined,
            numero: contrato.cliente.numero ?? undefined,
            bairro: contrato.cliente.bairro ?? undefined,
            cidade: contrato.cliente.cidade ?? undefined,
            estado: contrato.cliente.estado ?? undefined,
            cep: contrato.cliente.cep ?? undefined,
          }
        : undefined,
      local: contrato.local ?? undefined,
      categoriaFesta: contrato.categoriaFesta ?? undefined,
      orcamento: contrato.orcamento ?? undefined,
      clausulas: contrato.clausulas?.map((clausula) => ({
        ...clausula,
        templateClausulaId: clausula.templateClausulaId ?? undefined,
      })),
      itens: contrato.itens.map((item) => ({
        ...item,
        contratoId: item.contratoId ?? undefined,
        quantidade: item.quantidade / 1000, // Converter milésimos para decimal
        valorUnit: centsToDecimal(item.valorUnit),
        desconto: centsToDecimal(item.desconto),
        valorTotal: centsToDecimal(item.valorTotal),
        deletedAt: item.deletedAt ?? undefined,
        createdAt: item.createdAt ?? undefined,
        updatedAt: item.updatedAt ?? undefined,
        item: item.item
          ? ({
              ...item.item,
              descricao: item.item.descricao ?? undefined,
            } as any)
          : undefined,
      })),
    };

    return { ok: true, data: contratoFormatted };
  } catch (error) {
    console.error("Erro ao buscar contrato:", error);
    return { ok: false, error: "Erro interno do servidor" };
  }
}

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
        clausulas: {
          orderBy: { ordem: "asc" },
        },
      },
    });

    if (!contrato) {
      return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });
    }

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

    if (validatedData.clausulas !== undefined) {
      await prisma.contratoClausula.deleteMany({
        where: { contratoId: parseInt((await params).id) },
      });

      updateData.clausulas = {
        create: validatedData.clausulas.map((clausula) => ({
          ordem: clausula.ordem,
          titulo: clausula.titulo,
          conteudo: clausula.conteudo,
          templateClausulaId: clausula.templateClausulaId,
          alteradaPeloUsuario: clausula.alteradaPeloUsuario || false,
        })),
      };
    }

    if (validatedData.dataEvento) {
      updateData.dataEvento = new Date(validatedData.dataEvento);
    }

    if (validatedData.horaInicio) {
      const dataEvento = validatedData.dataEvento
        ? new Date(validatedData.dataEvento)
        : existingContrato.dataEvento;

      const [horas, minutos] = validatedData.horaInicio.split(":").map(Number);

      const dataHoraInicio = new Date(dataEvento);
      dataHoraInicio.setHours(horas, minutos, 0, 0);

      updateData.horaInicio = dataHoraInicio;
    }

    if (validatedData.itens) {
      await prisma.contratoItem.deleteMany({
        where: { contratoId: parseInt((await params).id) },
      });

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
        clausulas: {
          orderBy: { ordem: "asc" },
        },
      },
    });

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
