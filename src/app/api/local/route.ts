import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { Prisma } from "@/generated/prisma";
import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";
import { buildOrderBy } from "@/utils/functions/quey-functions";

import { localSchema } from "./types";

export async function POST(request: NextRequest) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsedBody = localSchema.parse(body);

    const novoLocal = await db.localEvento.create({
      data: {
        ...parsedBody,
        empresaId,
      },
    });

    return NextResponse.json(novoLocal, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating local:", error);
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
  descricao: z.string().optional(),
  cidade: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { page, perPage, sort, filter, descricao, cidade } = parsed.data;

    const sortable = new Set<keyof typeof db.localEvento.fields>([
      "id",
      "descricao",
      "cidade",
      "cep",
    ]);
    const orderBy = buildOrderBy(sort, sortable);

    const where: Prisma.LocalEventoWhereInput = {
      empresaId,
      AND: [
        filter
          ? {
              OR: [
                { descricao: { contains: filter, mode: "insensitive" } },
                { cidade: { contains: filter, mode: "insensitive" } },
              ],
            }
          : {},
        descricao ? { descricao: { contains: descricao, mode: "insensitive" } } : {},
        cidade ? { cidade: { contains: cidade, mode: "insensitive" } } : {},
      ],
    };

    const skip = (page - 1) * perPage;
    const [total, data] = await Promise.all([
      db.localEvento.count({ where: { ...where, deleted: false } }),
      db.localEvento.findMany({
        where: { ...where, deleted: false },
        orderBy,
        skip,
        take: perPage,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / perPage));

    return NextResponse.json(
      { data, pagination: { page, perPage, total, totalPages } },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET /api/local error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
