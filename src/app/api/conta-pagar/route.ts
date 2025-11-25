import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { Prisma, StatusTitulo } from "@/generated/prisma";
import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";
import { buildOrderBy } from "@/utils/functions/quey-functions";

import { contaPagarSchema } from "./types";

export async function POST(request: NextRequest) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const parsedBody = contaPagarSchema.parse(body);

    const dataToCreate = {
      ...parsedBody,
      empresaId,
      fornecedorId: parsedBody.fornecedorId ?? null,
      dataVencimento: parsedBody.dataVencimento
        ? new Date(parsedBody.dataVencimento + "T00:00:00.000Z")
        : undefined,
      dataPagamento: parsedBody.dataPagamento
        ? new Date(parsedBody.dataPagamento + "T00:00:00.000Z")
        : undefined,
    };

    const novaContaPagar = await db.contaPagar.create({
      data: dataToCreate,
      include: {
        fornecedor: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    return NextResponse.json(novaContaPagar, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Erro ao criar conta a pagar:", error);
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
  sort: z.string().optional(),
  filter: z.string().optional(),
  fornecedorId: z.string().optional(),
  status: z.string().optional(),
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

    const { page, perPage, sort, filter, fornecedorId, status, dataInicio, dataFim, ...filters } = parsed.data;

    const sortable = new Set<keyof typeof db.contaPagar.fields>([
      "id",
      "dataVencimento",
      "dataPagamento",
      "valor",
      "status",
      "createdAt",
      "updatedAt",
    ]);
    const orderBy = buildOrderBy(sort, sortable);

    const where: Prisma.ContaPagarWhereInput = {
      empresaId: Number(empresaId),
      deleted: false,
      AND: [
        filter
          ? {
              OR: [
                { descricao: { contains: filter, mode: "insensitive" } },
                { fornecedor: { nome: { contains: filter, mode: "insensitive" } } },
              ],
            }
          : {},
        fornecedorId ? { fornecedorId: Number(fornecedorId) } : {},
        status && (status === "PENDENTE" || status === "FINALIZADO")
          ? { status: status as StatusTitulo }
          : {},
        dataInicio || dataFim
          ? {
              dataVencimento: {
                ...(dataInicio
                  ? { gte: new Date(dataInicio + "T00:00:00.000Z") }
                  : {}),
                ...(dataFim
                  ? { lte: new Date(dataFim + "T23:59:59.999Z") }
                  : {}),
              },
            }
          : {},
      ],
    };

    const skip = (page - 1) * perPage;
    const [total, dataRaw] = await Promise.all([
      db.contaPagar.count({ where }),
      db.contaPagar.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
        include: {
          fornecedor: {
            select: {
              id: true,
              nome: true,
            },
          },
          caixaSaidas: {
            where: {
              deleted: false,
            },
            select: {
              valor: true,
            },
          },
        },
      }),
    ]);

    const data = dataRaw.map((conta) => {
      const valorPago = conta.caixaSaidas.reduce((acc, caixa) => acc + caixa.valor, 0);
      const valorRestante = conta.valor - valorPago;
      return {
        ...conta,
        valorPago,
        valorRestante,
        valorTotal: conta.valor,
        caixaSaidas: undefined,
      };
    });

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
    console.error("Erro ao buscar contas a pagar:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
