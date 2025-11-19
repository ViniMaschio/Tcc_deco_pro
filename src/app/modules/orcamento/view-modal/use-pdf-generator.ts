import { useRef } from "react";
import { Orcamento } from "@/app/api/orcamento/types";

interface UsePdfGeneratorProps {
  fileName?: string;
  orcamento: Orcamento;
}

export const usePdfGenerator = ({ fileName = "documento", orcamento }: UsePdfGeneratorProps) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    try {

      const response = await fetch(`/api/orcamento/${orcamento.id}/pdf`);

      if (!response.ok) {
        throw new Error("Erro ao gerar PDF");
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
