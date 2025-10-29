-- CreateTable: ContratoTemplate
CREATE TABLE "ContratoTemplate" (
  "id" SERIAL PRIMARY KEY,
  "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
  "empresaId" INTEGER NOT NULL,
  "titulo" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "ContratoTemplate_uuid_key" ON "ContratoTemplate"("uuid");

ALTER TABLE "ContratoTemplate"
  ADD CONSTRAINT "ContratoTemplate_empresaId_fkey"
  FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: ClausulaTemplate
CREATE TABLE "ClausulaTemplate" (
  "id" SERIAL PRIMARY KEY,
  "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
  "templateId" INTEGER NOT NULL,
  "ordem" INTEGER NOT NULL,
  "titulo" TEXT NOT NULL,
  "conteudo" TEXT NOT NULL,
  "editavel" BOOLEAN NOT NULL DEFAULT TRUE,
  "obrigatoria" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "ClausulaTemplate_uuid_key" ON "ClausulaTemplate"("uuid");
CREATE INDEX "ClausulaTemplate_templateId_ordem_idx" ON "ClausulaTemplate"("templateId", "ordem");

ALTER TABLE "ClausulaTemplate"
  ADD CONSTRAINT "ClausulaTemplate_templateId_fkey"
  FOREIGN KEY ("templateId") REFERENCES "ContratoTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: ContratoClausula
CREATE TABLE "ContratoClausula" (
  "id" SERIAL PRIMARY KEY,
  "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
  "contratoId" INTEGER NOT NULL,
  "ordem" INTEGER NOT NULL,
  "titulo" TEXT NOT NULL,
  "conteudo" TEXT NOT NULL,
  "templateClausulaId" INTEGER,
  "alteradaPeloUsuario" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "ContratoClausula_uuid_key" ON "ContratoClausula"("uuid");
CREATE INDEX "ContratoClausula_contratoId_ordem_idx" ON "ContratoClausula"("contratoId", "ordem");

ALTER TABLE "ContratoClausula"
  ADD CONSTRAINT "ContratoClausula_contratoId_fkey"
  FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE CASCADE ON UPDATE CASCADE;


