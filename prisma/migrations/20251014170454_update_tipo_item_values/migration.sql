/*
  Warnings:

  - The values [PRODUTO,SERVICO] on the enum `TipoItem` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."TipoItem_new" AS ENUM ('PRO', 'SER');
ALTER TABLE "public"."Item" ALTER COLUMN "tipo" DROP DEFAULT;
ALTER TABLE "public"."Item" ALTER COLUMN "tipo" TYPE "public"."TipoItem_new" USING ("tipo"::text::"public"."TipoItem_new");
ALTER TYPE "public"."TipoItem" RENAME TO "TipoItem_old";
ALTER TYPE "public"."TipoItem_new" RENAME TO "TipoItem";
DROP TYPE "public"."TipoItem_old";
ALTER TABLE "public"."Item" ALTER COLUMN "tipo" SET DEFAULT 'PRO';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Item" ALTER COLUMN "tipo" SET DEFAULT 'PRO';
