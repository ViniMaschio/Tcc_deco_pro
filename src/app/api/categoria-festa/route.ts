import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ensureEmpresaId } from "@/lib/auth-utils";
import { db } from "@/lib/prisma";

import { CategoriaFestaListResponse } from "./types";

const categoriaFestaSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
});

const querySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default(1),
  perPage: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default(10),
  sort: z.string().optional(),
  filter: z.string().optional(),
});

export async function GET(request: NextRequest): Promise<NextResponse<CategoriaFestaListResponse>> {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { data: [], pagination: null, message: "Usuário não autenticado!" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

    if (!parsed.success) {
      return NextResponse.json(
        { data: [], pagination: null, message: "Parâmetros inválidos!" },
        { status: 400 }
      );
    }

    const { page, perPage, sort, filter } = parsed.data;


    const where: {
      empresaId: number;
      deleted: boolean;
      descricao?: {
        contains: string;
        mode: "insensitive";
      };
    } = {
      empresaId,
      deleted: false,
    };

    if (filter) {
      where.descricao = {
        contains: filter,
        mode: "insensitive",
      };
    }


    let orderBy: { [key: string]: "asc" | "desc" } = { createdAt: "desc" };
    if (sort) {
      const [field, direction] = sort.split(":");
      if (field && direction && (direction === "asc" || direction === "desc")) {
        orderBy = { [field]: direction };
      }
    }

    const [total, data] = await Promise.all([
      db.categoriaFesta.count({ where }),
      db.categoriaFesta.findMany({
        where,
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);

    return NextResponse.json({
      data,
      pagination: {
        count: total,
        perPage,
        pagesCount: Math.max(1, Math.ceil(total / perPage)),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar categorias de festa:", error);
    return NextResponse.json(
      { data: [], pagination: null, message: "Erro ao buscar categorias de festa!" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const empresaId = await ensureEmpresaId();
    if (!empresaId) {
      return NextResponse.json(
        { categoriaFesta: null, message: "Usuário não autenticado!" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsedBody = categoriaFestaSchema.parse(body);

    const novaCategoriaFesta = await db.categoriaFesta.create({
      data: {
        ...parsedBody,
        empresaId,
      },
    });

    return NextResponse.json(
      { categoriaFesta: novaCategoriaFesta, message: "Categoria de festa criada com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar categoria de festa:", error);
    return NextResponse.json(
      { categoriaFesta: null, message: "Erro ao criar categoria de festa!" },
      { status: 500 }
    );
  }
}
