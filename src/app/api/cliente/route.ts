import { NextResponse } from "next/server";
import z from "zod";

import { Prisma } from "@/generated/prisma";
import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";
import { buildOrderBy } from "@/utils/functions/quey-functions";

import { clienteSchema } from "./types";

export async function POST(req: Request) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { local: null, message: "Usuário não autenticado!" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsedBody = clienteSchema.parse(body);

    const novoCliente = await db.cliente.create({
      data: {
        ...parsedBody,
        empresaId,
      },
    });

    return NextResponse.json(
      { local: novoCliente, message: "Cliente criado com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json({ local: null, message: "Erro ao criar cliente!" }, { status: 500 });
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
  nome: z.string().optional(),
  cpf: z.string().optional(),
  telefone: z.string().optional(),
  cidade: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { local: null, message: "Usuário não autenticado!" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()));
    if (!parsed.success) {
      return NextResponse.json(
        { data: [], pagination: null, message: "Parâmetros inválidos!" },
        { status: 400 }
      );
    }

    const { page, perPage, sort, filter, ...filters } = parsed.data;

    const sortable = new Set<keyof typeof db.cliente.fields>([
      "id",
      "nome",
      "cpf",
      "telefone",
      "cidade",
      "createdAt",
      "updatedAt",
    ]);
    const orderBy = buildOrderBy(sort, sortable);

    const where: Prisma.ClienteWhereInput = {
      empresaId: Number(empresaId),
      deleted: false,
      AND: [
        filter
          ? {
              OR: [
                { nome: { contains: filter, mode: "insensitive" } },
                { cpf: { contains: filter, mode: "insensitive" } },
                { telefone: { contains: filter, mode: "insensitive" } },
                { cidade: { contains: filter, mode: "insensitive" } },
              ],
            }
          : {},
        ...Object.entries(filters).map(([key, value]) =>
          value ? { [key]: { contains: value, mode: "insensitive" } } : {}
        ),
      ],
    };

    const skip = (page - 1) * perPage;
    const [total, data] = await Promise.all([
      db.cliente.count({ where }),
      db.cliente.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / perPage));

    return NextResponse.json({
      data,
      pagination: {
        count: total,
        perPage,
        pagesCount: totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { data: [], pagination: null, message: "Erro ao buscar clientes!" },
      { status: 500 }
    );
  }
}
