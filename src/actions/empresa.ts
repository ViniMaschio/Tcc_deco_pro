"use server";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";

import { Prisma } from "@/generated/prisma";
import { Empresa } from "@/generated/prisma";
import { db as prisma } from "@/lib/prisma";
import {
  empresaCreateSchema,
  empresaUpdateSchema,
} from "@/app/modules/orcamento/view-modal/schemas";

function serializeEmpresa(e: Empresa) {
  if (!e) return e;
  return {
    ...e,
    id: e.id?.toString?.() ?? e.id,
    created_at: e.createdAt?.toISOString?.() ?? e.createdAt,
    updated_at: e.updatedAt?.toISOString?.() ?? e.updatedAt,
  };
}

function toNumber(id: string | number | bigint) {
  if (typeof id === "number") return id;
  if (typeof id === "bigint") return Number(id);
  return Number(id); // string
}

function isPrismaUniqueError(err: unknown): err is PrismaClientKnownRequestError {
  return err instanceof PrismaClientKnownRequestError && err.code === "P2002";
}

export async function criarEmpresa(empresa: Empresa) {
  try {
    const data = empresaCreateSchema.parse(empresa);

    const created = await prisma.empresa.create({
      data: {
        email: data.email,
        senha: data.senha,
        cnpj: data.cnpj,
        rua: data.rua,
        numero: data.numero,
        complemento: data.complemento ?? null,
        bairro: data.bairro,
        cidade: data.cidade,
        cep: data.cep,
        estado: data.estado,
        telefone: data.telefone,
      },
    });

    revalidatePath("/empresas");
    return { ok: true, data: serializeEmpresa(created) } as const;
  } catch (err: any) {
    if (isPrismaUniqueError(err)) {
      const target = Array.isArray(err?.meta?.target) ? err.meta.target.join(", ") : "campo único";
      return { ok: false, error: `Valor já existe para ${target}.` } as const;
    }
    return {
      ok: false,
      error: err?.message ?? "Erro ao criar empresa.",
    } as const;
  }
}

/** Read (lista tudo, com busca opcional) */
export async function listarEmpresas(q?: string) {
  const where = q
    ? {
        OR: [
          { email: { contains: q, mode: "insensitive" as const } },
          { cnpj: { contains: q, mode: "insensitive" as const } },
          { cidade: { contains: q, mode: "insensitive" as const } },
          { bairro: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const rows = await prisma.empresa.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return { ok: true as const, data: rows.map(serializeEmpresa) };
}

/** Read (por ID) */
export async function obterEmpresa(id: string | number | bigint) {
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { id: toNumber(id) },
    });
    if (!empresa) return { ok: false as const, error: "Empresa não encontrada." };
    return { ok: true as const, data: serializeEmpresa(empresa) };
  } catch (err: any) {
    return {
      ok: false as const,
      error: err?.message ?? "Erro ao buscar empresa.",
    };
  }
}

/** Update */
export async function atualizarEmpresa(id: string | number | bigint, input: unknown) {
  try {
    const data = empresaUpdateSchema.parse(input);

    const updated = await prisma.empresa.update({
      where: { id: toNumber(id) },
      data: {
        ...(data.email !== undefined && { email: data.email }),
        ...(data.senha !== undefined && { senha: data.senha }),
        ...(data.cnpj !== undefined && { cnpj: data.cnpj }),
        ...(data.rua !== undefined && { rua: data.rua }),
        ...(data.numero !== undefined && { numero: data.numero }),
        ...(data.complemento !== undefined && {
          complemento: data.complemento ?? null,
        }),
        ...(data.bairro !== undefined && { bairro: data.bairro }),
        ...(data.cidade !== undefined && { cidade: data.cidade }),
        ...(data.cep !== undefined && { cep: data.cep }),
        ...(data.estado !== undefined && { estado: data.estado }),
        ...(data.telefone !== undefined && { telefone: data.telefone }),
      },
    });

    revalidatePath("/empresas");
    return { ok: true as const, data: serializeEmpresa(updated) };
  } catch (err: any) {
    if (isPrismaUniqueError(err)) {
      const target = Array.isArray(err?.meta?.target) ? err.meta.target.join(", ") : "campo único";
      return { ok: false as const, error: `Valor já existe para ${target}.` };
    }
    return {
      ok: false as const,
      error: err?.message ?? "Erro ao atualizar empresa.",
    };
  }
}

/** Delete */
export async function excluirEmpresa(id: string | number | bigint) {
  try {
    const deleted = await prisma.empresa.delete({
      where: { id: toNumber(id) },
    });
    revalidatePath("/empresas");
    return { ok: true as const, data: serializeEmpresa(deleted) };
  } catch (err: any) {
    return {
      ok: false as const,
      error: err?.message ?? "Erro ao excluir empresa.",
    };
  }
}
