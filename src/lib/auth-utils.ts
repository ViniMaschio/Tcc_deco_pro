import { auth } from "./auth-server";

/**
 * Função global para obter o ID da empresa do usuário autenticado
 * @returns Promise<number | null> - ID da empresa ou null se não autenticado
 */
export async function ensureEmpresaId(): Promise<number | null> {
  const session = await auth();


  if (!session?.user?.id) {
    return null;
  }

  const num = Number(session.user.id);


  if (!Number.isFinite(num) || num <= 0) {
    return null;
  }

  return num;
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
