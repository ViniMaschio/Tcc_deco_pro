/*
  Warnings:

  - Made the column `contasReceberId` on table `CaixaEntrada` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contasPagarId` on table `CaixaSaida` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."CaixaEntrada" ALTER COLUMN "contasReceberId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."CaixaSaida" ALTER COLUMN "contasPagarId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."CaixaEntrada" ADD CONSTRAINT "CaixaEntrada_contasReceberId_fkey" FOREIGN KEY ("contasReceberId") REFERENCES "public"."ContaReceber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CaixaSaida" ADD CONSTRAINT "CaixaSaida_contasPagarId_fkey" FOREIGN KEY ("contasPagarId") REFERENCES "public"."ContaPagar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
