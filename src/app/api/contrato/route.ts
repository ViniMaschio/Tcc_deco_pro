import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db as prisma } from "@/lib/prisma";
import { decimalToCents, centsToDecimal } from "@/utils/currency";

const createContratoSchema = z.object({
  clienteId: z.number(),
  status: z.enum(["RASCUNHO", "ATIVO", "CONCLUIDO", "CANCELADO"]).optional(),
  categoriaId: z.number().optional(),
  localId: z.number().optional(),
  orcamentoId: z.number().optional(),
  dataEvento: z.string(),
  horaInicio: z.string(),
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
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
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
      status?: "RASCUNHO" | "ATIVO" | "CONCLUIDO" | "CANCELADO";
    } = {
      empresaId,
      deleted: false,
    };

    if (search) {
      where.OR = [
        { cliente: { nome: { contains: search, mode: "insensitive" } } },
        { local: { descricao: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (status && ["RASCUNHO", "ATIVO", "CONCLUIDO", "CANCELADO"].includes(status)) {
      where.status = status as "RASCUNHO" | "ATIVO" | "CONCLUIDO" | "CANCELADO";
    }

    const [contratos, total] = await Promise.all([
      prisma.contrato.findMany({
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
          orcamento: {
            select: { id: true, uuid: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contrato.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Converter valores de centavos para decimal na resposta
    const contratosFormatted = contratos.map((contrato) => ({
      ...contrato,
      total: centsToDecimal(contrato.total),
      desconto: contrato.desconto ? centsToDecimal(contrato.desconto) : undefined,
    }));

    return NextResponse.json({
      data: contratosFormatted,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar contratos:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createContratoSchema.parse(body);

    // Converter valores decimais para centavos e calcular total
    let totalCents = 0;
    for (const item of validatedData.itens) {
      const valorUnitCents = decimalToCents(item.valorUnit);
      const descontoCents = decimalToCents(item.desconto || 0);
      const quantidadeMil = Math.round(item.quantidade * 1000); // Converter para milésimos
      const valorTotalCents = Math.round((quantidadeMil * valorUnitCents) / 1000) - descontoCents;
      totalCents += valorTotalCents;
    }

    // Combinar dataEvento e horaInicio em DateTime
    const dataEvento = new Date(validatedData.dataEvento);

    // Parsear hora no formato "HH:mm"
    const [horas, minutos] = validatedData.horaInicio.split(":").map(Number);

    // Combinar data do evento com hora do início
    const dataHoraInicio = new Date(dataEvento);
    dataHoraInicio.setHours(horas, minutos, 0, 0);

    const contrato = await prisma.contrato.create({
      data: {
        empresaId,
        clienteId: validatedData.clienteId,
        status: validatedData.status || "RASCUNHO",
        categoriaId: validatedData.categoriaId,
        localId: validatedData.localId,
        orcamentoId: validatedData.orcamentoId,
        dataEvento,
        horaInicio: dataHoraInicio,
        observacao: validatedData.observacao,
        total: totalCents,
        itens: {
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

    return NextResponse.json(contratoFormatted, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Erro ao criar contrato:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
