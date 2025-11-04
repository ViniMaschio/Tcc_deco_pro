-- Migration para simplificar estrutura de contrato template
-- Limpar dados existentes antes de fazer as alterações estruturais
DELETE FROM "ClausulaTemplate";
DELETE FROM "ContratoTemplate";

-- DropIndex
DROP INDEX "ClausulaTemplate_templateId_ordem_idx";

-- DropForeignKey
ALTER TABLE "ClausulaTemplate" DROP CONSTRAINT "ClausulaTemplate_templateId_fkey";

-- AlterTable: Adicionar empresaId e remover templateId
ALTER TABLE "ClausulaTemplate" DROP COLUMN "templateId";
ALTER TABLE "ClausulaTemplate" ADD COLUMN "empresaId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "ClausulaTemplate_empresaId_ordem_idx" ON "ClausulaTemplate"("empresaId", "ordem");

-- AddForeignKey
ALTER TABLE "ClausulaTemplate" ADD CONSTRAINT "ClausulaTemplate_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropTable
DROP TABLE "ContratoTemplate";

