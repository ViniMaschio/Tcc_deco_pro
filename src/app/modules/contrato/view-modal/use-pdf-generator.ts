import { useRef } from "react";
import { Contrato } from "@/app/api/contrato/types";

interface UsePdfGeneratorProps {
  fileName?: string;
  contrato: Contrato;
}

export const usePdfGenerator = ({ fileName = "documento", contrato }: UsePdfGeneratorProps) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    try {
      const response = await fetch(`/api/contrato/${contrato.id}/pdf`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao gerar PDF");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      throw error;
    }
  };

  return {
    pdfRef,
    generatePDF,
  };
};
