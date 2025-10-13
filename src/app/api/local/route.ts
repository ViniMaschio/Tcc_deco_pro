import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import z from "zod";

import { Prisma } from "@/generated/prisma";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { buildOrderBy } from "@/utils/functions/quey-functions";

import { localSchema } from "./types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = localSchema.parse(body);

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Usuário não autenticado!" },
        { status: 401 },
      );
    }

    const novoLocal = await db.localEvento.create({
      data: {
        ...parsedBody,
        empresaId: Number(session?.user?.id),
      },
    });

    return NextResponse.json(
      { local: novoLocal, message: "Local criado com sucesso!" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating local:", error);
    return NextResponse.json(
      { local: null, message: "Erro ao criar local!" },
      { status: 500 },
    );
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

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response("Usuário não autenticado!", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse(
      Object.fromEntries(searchParams.entries()),
    );
    if (!parsed.success) {
      return NextResponse.json(
        { data: [], pagination: null, message: "Parâmetros inválidos!" },
        { status: 400 },
      );
    }

    const { page, perPage, sort, filter, descricao, cidade } = parsed.data;

    // ORDENAÇÃO
    const sortable = new Set<keyof typeof db.localEvento.fields>([
      "id",
      "descricao",
      "cidade",
      "cep",
    ]);
    const orderBy = buildOrderBy(sort, sortable);

    // Filtros dinâmicos
    const where: Prisma.LocalEventoWhereInput = {
      empresaId: Number(session.user.id),
      AND: [
        filter
          ? {
              OR: [
                { descricao: { contains: filter, mode: "insensitive" } },
                { cidade: { contains: filter, mode: "insensitive" } },
              ],
            }
          : {},
        descricao
          ? { descricao: { contains: descricao, mode: "insensitive" } }
          : {},
        cidade ? { cidade: { contains: cidade, mode: "insensitive" } } : {},
      ],
    };

    // PAGINAÇÃO
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
      },
    );
  } catch (error) {
    console.error("GET /api/local error:", error);
    return NextResponse.json(
      { data: [], pagination: null, message: "Erro ao buscar locais!" },
      { status: 500 },
    );
  }
}
