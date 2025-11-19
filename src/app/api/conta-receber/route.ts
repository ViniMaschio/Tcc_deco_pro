import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { Prisma } from "@/generated/prisma";
import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";
import { buildOrderBy } from "@/utils/functions/quey-functions";

import { contaReceberSchema } from "./types";

export async function POST(request: NextRequest) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const parsedBody = contaReceberSchema.parse(body);

    const dataToCreate = {
      ...parsedBody,
      empresaId,
      dataVencimento: parsedBody.dataVencimento
        ? new Date(parsedBody.dataVencimento + "T00:00:00.000Z")
        : undefined,
      dataPagamento: parsedBody.dataPagamento
        ? new Date(parsedBody.dataPagamento + "T00:00:00.000Z")
        : undefined,
    };

    const novaContaReceber = await db.contaReceber.create({
      data: dataToCreate,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    return NextResponse.json(novaContaReceber, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Erro ao criar conta a receber:", error);
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
  clienteId: z.string().optional(),
  status: z.string().optional(),
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

    const { page, perPage, sort, filter, clienteId, status, ...filters } = parsed.data;

    const sortable = new Set<keyof typeof db.contaReceber.fields>([
      "id",
      "dataVencimento",
      "dataPagamento",
      "valor",
      "status",
      "createdAt",
      "updatedAt",
    ]);
    const orderBy = buildOrderBy(sort, sortable);

    const where: Prisma.ContaReceberWhereInput = {
      empresaId: Number(empresaId),
      deleted: false,
      AND: [
        filter
          ? {
              OR: [
                { descricao: { contains: filter, mode: "insensitive" } },
                { cliente: { nome: { contains: filter, mode: "insensitive" } } },
              ],
            }
          : {},
        clienteId ? { clienteId: Number(clienteId) } : {},
        status ? { status: status as any } : {},
      ],
    };

    const skip = (page - 1) * perPage;
    const [total, dataRaw] = await Promise.all([
      db.contaReceber.count({ where }),
      db.contaReceber.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
        include: {
          cliente: {
            select: {
              id: true,
              nome: true,
            },
          },
          contrato: {
            select: {
              id: true,
            },
          },
          caixaEntradas: {
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
      const valorPago = conta.caixaEntradas.reduce((acc, caixa) => acc + caixa.valor, 0);
      const valorRestante = conta.valor - valorPago;
      return {
        ...conta,
        valorPago,
        valorRestante,
        valorTotal: conta.valor,
        caixaEntradas: undefined,
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
    console.error("Erro ao buscar contas a receber:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
