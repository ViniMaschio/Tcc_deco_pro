import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import z from "zod";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

const localSchema = z.object({
  descricao: z.string().min(1, "Campo Obrigatório"),
  rua: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  telefone: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = localSchema.parse(body);

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { local: null, message: "Usuário não autenticado" },
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
      { local: null, message: "Erro ao criar local" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    const locais = await db.localEvento.findMany({
      where: { empresaId: Number(session.user.id) },
    });
    return new Response(JSON.stringify(locais), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching locais:", error);
    return new Response("Error fetching locais", { status: 500 });
  }
}
