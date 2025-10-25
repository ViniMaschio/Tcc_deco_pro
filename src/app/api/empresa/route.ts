import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import z from "zod";

import { db } from "@/lib/prisma";
import { validarCNPJ } from "@/utils/functions/validations/functions";

const empresaSchema = z.object({
  nome: z.string().min(1, "Campo Obrigatório"),
  email: z.email("Email inválido"),
  cnpj: z
    .string()
    .min(1, "Campo Obrigatório")
    .refine((val) => validarCNPJ(val), {
      message: "CNPJ inválido",
    }),
  senha: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, cnpj, senha } = empresaSchema.parse(body);

    const existeEmpresaPorEmail = await db.empresa.findUnique({
      where: { email },
    });
    if (existeEmpresaPorEmail) {
      return NextResponse.json(
        {
          empresa: null,
          message: "Email já cadastrado",
        },
        { status: 409 }
      );
    }

    const existeEmpresaPorCnpj = await db.empresa.findUnique({
      where: { cnpj },
    });
    if (existeEmpresaPorCnpj) {
      return NextResponse.json(
        {
          empresa: null,
          message: "CNPJ já cadastrado",
        },
        { status: 409 }
      );
    }

    const hashedSenha = await hash(senha, 10);
    const novaEmpresa = await db.empresa.create({
      data: {
        nome,
        email,
        cnpj,
        senha: hashedSenha,
      },

      select: {
        id: true,
        nome: true,
        email: true,
        cnpj: true,
      },
    });

    return NextResponse.json(
      { empresa: novaEmpresa, message: "Empresa criada com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar empresa:", error);

    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);

    return NextResponse.json(
      { message: "Erro ao criar empresa", error: errorMessage },
      { status: 500 }
    );
  }
}
