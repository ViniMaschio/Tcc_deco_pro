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

    // Verificar se a conta foi totalmente paga
    const totalRecebido = await db.caixaEntrada.aggregate({
      where: {
        contasReceberId: parsedBody.contasReceberId,
        deleted: false,
      },
      _sum: {
        valor: true,
      },
    });

    const valorTotalRecebido = totalRecebido._sum.valor || 0;

    // Se o valor total recebido for maior ou igual ao valor da conta, marcar como finalizada
    if (valorTotalRecebido >= contaReceber.valor) {
      await db.contaReceber.update({
        where: { id: parsedBody.contasReceberId },
        data: {
          status: "FINALIZADO",
          dataPagamento: new Date(parsedBody.dataRecebimento + "T00:00:00.000Z"),
        },
      });
    }

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
      db.caixaEntrada.count({
        where: {
          empresaId,
          deleted: false,
        },
      }),
      db.caixaEntrada.findMany({
        where: {
          empresaId,
          deleted: false,
        },
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
