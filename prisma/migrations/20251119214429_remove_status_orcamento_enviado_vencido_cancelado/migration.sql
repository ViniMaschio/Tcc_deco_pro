/*
  Warnings:

  - The values [ENVIADO,VENCIDO,CANCELADO] on the enum `StatusOrcamento` will be removed. If these variants are still used in the database, this will fail.

*/
-- Atualizar registros que usam os status removidos para RASCUNHO
UPDATE "Orcamento" 
SET status = 'RASCUNHO' 
WHERE status IN ('ENVIADO', 'VENCIDO', 'CANCELADO');

-- AlterEnum
BEGIN;
CREATE TYPE "StatusOrcamento_new" AS ENUM ('RASCUNHO', 'APROVADO', 'REJEITADO');
ALTER TABLE "public"."Orcamento" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Orcamento" ALTER COLUMN "status" TYPE "StatusOrcamento_new" USING ("status"::text::"StatusOrcamento_new");
ALTER TYPE "StatusOrcamento" RENAME TO "StatusOrcamento_old";
ALTER TYPE "StatusOrcamento_new" RENAME TO "StatusOrcamento";
DROP TYPE "public"."StatusOrcamento_old";
ALTER TABLE "Orcamento" ALTER COLUMN "status" SET DEFAULT 'RASCUNHO';
COMMIT;

