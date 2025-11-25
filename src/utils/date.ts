import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formata uma data para exibição, evitando problemas de timezone.
 * Extrai apenas a parte da data (YYYY-MM-DD) e cria uma data local.
 *
 * @param date - A data a ser formatada (string ISO, Date object ou undefined)
 * @param formatPattern - O padrão de formatação (padrão: "dd/MM/yyyy")
 * @returns A data formatada como string ou "-" se a data for undefined
 */
export function formatDate(
  date: string | Date | undefined,
  formatPattern: string = "dd/MM/yyyy"
): string {
  if (!date) {
    return "-";
  }

  const dateStr = typeof date === "string" ? date.split("T")[0] : date.toISOString().split("T")[0];
  const [year, month, day] = dateStr.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return format(localDate, formatPattern, { locale: ptBR });
}
