import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";

const caixaSaidaSchema = z.object({
  contasPagarId: z.number().int().positive("Conta a pagar é obrigatória"),
  descricao: z.string().optional(),
  valor: z.number().int().positive("Valor é obrigatório"),
  dataPagamento: z.string().min(1, "Data de pagamento é obrigatória"),
  metodo: z.enum(["PIX", "DINHEIRO", "CREDITO", "DEBITO", "BOLETO", "TED", "DOC", "OUTRO"]),
});

export async function POST(request: NextRequest) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const parsedBody = caixaSaidaSchema.parse(body);

    // Verificar se a conta a pagar existe e pertence à empresa
    const contaPagar = await db.contaPagar.findFirst({
      where: {
        id: parsedBody.contasPagarId,
        empresaId,
        deleted: false,
      },
    });

    if (!contaPagar) {
      return NextResponse.json({ error: "Conta a pagar não encontrada" }, { status: 404 });
    }

    // Verificar se a conta já está finalizada
    if (contaPagar.status === "FINALIZADO") {
      return NextResponse.json(
        { error: "Esta conta já foi paga" },
        { status: 400 }
      );
    }

    // Criar saída no caixa
    const caixaSaida = await db.caixaSaida.create({
      data: {
        empresaId,
        contasPagarId: parsedBody.contasPagarId,
        descricao: parsedBody.descricao,
        valor: parsedBody.valor,
        dataPagamento: new Date(parsedBody.dataPagamento + "T00:00:00.000Z"),
        metodo: parsedBody.metodo,
      },
    });

    // Atualizar o status da conta para FINALIZADO
    await db.contaPagar.update({
      where: { id: parsedBody.contasPagarId },
      data: {
        status: "FINALIZADO",
        dataPagamento: new Date(parsedBody.dataPagamento + "T00:00:00.000Z"),
      },
    });

    return NextResponse.json(caixaSaida, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Erro ao criar saída no caixa:", error);
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
      whereClause.dataPagamento = {};
      if (dataInicio) {
        // Criar data no início do dia em UTC para evitar problemas de timezone
        const startDate = new Date(dataInicio + "T00:00:00.000Z");
        whereClause.dataPagamento.gte = startDate;
      }
      if (dataFim) {
        // Criar data no final do dia em UTC para evitar problemas de timezone
        const endDate = new Date(dataFim + "T23:59:59.999Z");
        whereClause.dataPagamento.lte = endDate;
      }
    }

    const skip = (page - 1) * perPage;
    const [total, data] = await Promise.all([
      db.caixaSaida.count({
        where: whereClause,
      }),
      db.caixaSaida.findMany({
        where: whereClause,
        orderBy: {
          dataPagamento: "desc",
        },
        skip,
        take: perPage,
        include: {
          contaPagar: {
            select: {
              id: true,
              descricao: true,
              valor: true,
              fornecedor: {
                select: {
                  id: true,
                  nome: true,
                },
              },
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
    console.error("Erro ao buscar saídas no caixa:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
