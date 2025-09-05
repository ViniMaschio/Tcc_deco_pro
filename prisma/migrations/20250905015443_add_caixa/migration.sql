-- AlterTable
ALTER TABLE "public"."ContaPagar" ADD COLUMN     "valorRestante" DECIMAL(14,2);

-- AlterTable
ALTER TABLE "public"."ContaReceber" ADD COLUMN     "valorRestante" DECIMAL(14,2);

-- CreateTable
CREATE TABLE "public"."CaixaEntrada" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "contasReceberId" INTEGER,
    "descricao" TEXT,
    "valor" DECIMAL(14,2) NOT NULL,
    "dataRecebimento" TIMESTAMP(3) NOT NULL,
    "metodo" "public"."MetodoPagamento" NOT NULL,
    "parcela" INTEGER,
    "totalParcelas" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CaixaEntrada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CaixaSaida" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "contasPagarId" INTEGER,
    "descricao" TEXT,
    "valor" DECIMAL(14,2) NOT NULL,
    "dataPagamento" TIMESTAMP(3) NOT NULL,
    "metodo" "public"."MetodoPagamento" NOT NULL,
    "parcela" INTEGER,
    "totalParcelas" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CaixaSaida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CaixaEntrada_uuid_key" ON "public"."CaixaEntrada"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "CaixaSaida_uuid_key" ON "public"."CaixaSaida"("uuid");

-- AddForeignKey
ALTER TABLE "public"."CaixaEntrada" ADD CONSTRAINT "CaixaEntrada_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CaixaSaida" ADD CONSTRAINT "CaixaSaida_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
