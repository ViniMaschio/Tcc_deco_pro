import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";

const caixaEntradaSchema = z.object({
  contasReceberId: z.number().int().positive("Conta a receber é obrigatória"),
  descricao: z.string().optional(),
  valor: z.number().int().positive("Valor é obrigatório"),
  dataRecebimento: z.string().min(1, "Data de recebimento é obrigatória"),
  metodo: z.enum(["PIX", "DINHEIRO", "CREDITO", "DEBITO", "BOLETO", "TED", "DOC", "OUTRO"]),
});

export async function POST(request: NextRequest) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const parsedBody = caixaEntradaSchema.parse(body);

    // Verificar se a conta a receber existe e pertence à empresa
    const contaReceber = await db.contaReceber.findFirst({
      where: {
        id: parsedBody.contasReceberId,
        empresaId,
        deleted: false,
      },
    });

    if (!contaReceber) {
      return NextResponse.json({ error: "Conta a receber não encontrada" }, { status: 404 });
    }

    // Verificar se a conta já está finalizada
    if (contaReceber.status === "FINALIZADO") {
      return NextResponse.json({ error: "Esta conta já foi recebida" }, { status: 400 });
    }

    // Criar entrada no caixa
    const caixaEntrada = await db.caixaEntrada.create({
      data: {
        empresaId,
        contasReceberId: parsedBody.contasReceberId,
        descricao: parsedBody.descricao,
        valor: parsedBody.valor,
        dataRecebimento: new Date(parsedBody.dataRecebimento + "T00:00:00.000Z"),
        metodo: parsedBody.metodo,
      },
    });

    // Atualizar o status da conta para FINALIZADO
    await db.contaReceber.update({
      where: { id: parsedBody.contasReceberId },
      data: {
        status: "FINALIZADO",
        dataPagamento: new Date(parsedBody.dataRecebimento + "T00:00:00.000Z"),
      },
    });

    return NextResponse.json(caixaEntrada, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Erro ao criar entrada no caixa:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

const querySchema = z.object({
  page: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().positive())
    .default(1)
    .catch(1),
  perPage: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().positive().max(100))
    .default(10)
    .catch(10),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { page, perPage, dataInicio, dataFim } = parsed.data;

    // Construir filtros de data
    const whereClause: any = {
      empresaId,
      deleted: false,
    };

    if (dataInicio || dataFim) {
      whereClause.dataRecebimento = {};
      if (dataInicio) {
        // Criar data no início do dia em UTC para evitar problemas de timezone
        const startDate = new Date(dataInicio + "T00:00:00.000Z");
        whereClause.dataRecebimento.gte = startDate;
      }
      if (dataFim) {
        // Criar data no final do dia em UTC para evitar problemas de timezone
        const endDate = new Date(dataFim + "T23:59:59.999Z");
        whereClause.dataRecebimento.lte = endDate;
      }
    }

    const skip = (page - 1) * perPage;
    const [total, data] = await Promise.all([
      db.caixaEntrada.count({
        where: whereClause,
      }),
      db.caixaEntrada.findMany({
        where: whereClause,
        orderBy: {
          dataRecebimento: "desc",
        },
        skip,
        take: perPage,
        include: {
          contaReceber: {
            select: {
              id: true,
              descricao: true,
              valor: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / perPage));

    return NextResponse.json({
      data,
      pagination: {
        page,
        perPage,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar entradas no caixa:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
