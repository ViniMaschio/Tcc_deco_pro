-- CreateEnum
CREATE TYPE "public"."TipoItem" AS ENUM ('PRODUTO', 'SERVICO');

-- AlterTable
ALTER TABLE "public"."Item" ADD COLUMN     "tipo" "public"."TipoItem" NOT NULL DEFAULT 'PRODUTO',
ALTER COLUMN "descricao" DROP NOT NULL;
