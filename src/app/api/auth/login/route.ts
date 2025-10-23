import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-server";

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
    }

    // Para NextAuth.js v4, você precisa implementar a lógica de autenticação manualmente
    // ou usar o endpoint padrão do NextAuth.js
    return NextResponse.json(
      {
        error: "Use o endpoint /api/auth/signin do NextAuth.js para autenticação",
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
