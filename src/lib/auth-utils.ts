import { getServerSession } from "next-auth";

import { authOptions } from "./auth";

/**
 * Função global para obter o ID da empresa do usuário autenticado
 * @returns Promise<number | null> - ID da empresa ou null se não autenticado
 */
export async function ensureEmpresaId(): Promise<number | null> {
  const session = await getServerSession(authOptions);
  const num = Number(session?.user?.id);
  return Number.isFinite(num) ? num : null;
}

/**
 * Função para verificar se o usuário está autenticado e retornar resposta de erro se não estiver
 * @returns Promise<{ empresaId: number } | { error: NextResponse }>
 */
export async function requireAuth() {
  const empresaId = await ensureEmpresaId();

  if (!empresaId) {
    return {
      error: {
        json: { error: "Não autorizado" },
        status: 401,
      },
    };
  }

  return { empresaId };
}
