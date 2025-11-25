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

    // Verificar se a conta foi totalmente paga
    const totalPago = await db.caixaSaida.aggregate({
      where: {
        contasPagarId: parsedBody.contasPagarId,
        deleted: false,
      },
      _sum: {
        valor: true,
      },
    });

    const valorTotalPago = totalPago._sum.valor || 0;

    // Se o valor total pago for maior ou igual ao valor da conta, marcar como finalizada
    if (valorTotalPago >= contaPagar.valor) {
      await db.contaPagar.update({
        where: { id: parsedBody.contasPagarId },
        data: {
          status: "FINALIZADO",
          dataPagamento: new Date(parsedBody.dataPagamento + "T00:00:00.000Z"),
        },
      });
    }

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

    const { page, perPage } = parsed.data;

    const skip = (page - 1) * perPage;
    const [total, data] = await Promise.all([
      db.caixaSaida.count({
        where: {
          empresaId,
          deleted: false,
        },
      }),
      db.caixaSaida.findMany({
        where: {
          empresaId,
          deleted: false,
        },
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
