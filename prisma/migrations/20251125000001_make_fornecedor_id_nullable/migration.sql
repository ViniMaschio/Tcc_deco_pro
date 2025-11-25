-- DropForeignKey
ALTER TABLE "public"."ContaPagar" DROP CONSTRAINT IF EXISTS "ContaPagar_fornecedorId_fkey";

-- AlterTable
ALTER TABLE "public"."ContaPagar" ALTER COLUMN "fornecedorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ContaPagar" ADD CONSTRAINT "ContaPagar_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "public"."Fornecedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

