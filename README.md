# 🎉 DecoPro - Sistema de Gestão para Empresas de Decoração

<div align="center">
  <img src="/static/images/logo_collapse.png" alt="DecoPro Logo" width="120" height="120">
  
  <p><strong>Sistema completo para gestão de empresas de decoração e eventos</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-6.15.0-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
</div>

## 📋 Sobre o Projeto

O **DecoPro** é um sistema de gestão completo desenvolvido especificamente para empresas de decoração e eventos. A plataforma oferece todas as ferramentas necessárias para gerenciar clientes, orçamentos, contratos, controle financeiro e muito mais.

### ✨ Principais Funcionalidades

- 🏢 **Gestão de Empresa**: Cadastro e configuração da empresa
- 👥 **Gestão de Clientes**: Controle completo de clientes e fornecedores
- 📋 **Orçamentos**: Criação, envio e acompanhamento de orçamentos
- 📄 **Contratos**: Gestão de contratos e eventos
- 💰 **Controle Financeiro**: Contas a pagar, receber e fluxo de caixa
- 📦 **Gestão de Itens**: Catálogo de produtos e serviços
- 📍 **Locais de Evento**: Cadastro e gestão de locais
- 📊 **Dashboard**: Visão geral com métricas e indicadores
- 📱 **Interface Responsiva**: Funciona perfeitamente em desktop e mobile

## 🚀 Tecnologias Utilizadas

### Frontend

- **Next.js 16** - Framework React com App Router
- **React 19** - Biblioteca de interface de usuário
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Framework de CSS utilitário
- **Radix UI** - Componentes acessíveis
- **React Hook Form** - Gerenciamento de formulários
- **Zustand** - Gerenciamento de estado

### Backend

- **Next.js API Routes** - API REST
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **NextAuth.js** - Autenticação
- **Bcrypt** - Criptografia de senhas

### Ferramentas de Desenvolvimento

- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Prisma Studio** - Interface visual do banco

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- npm, yarn, pnpm ou bun

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/deco-pro.git
cd deco-pro
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configure o banco de dados

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Configure as variáveis de ambiente no .env.local
DATABASE_URL="postgresql://usuario:senha@localhost:5432/deco_pro"
DIRECT_URL="postgresql://usuario:senha@localhost:5432/deco_pro"
NEXTAUTH_SECRET="sua-chave-secreta"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Execute as migrações

```bash
npx prisma migrate dev
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Páginas de autenticação
│   ├── (system)/          # Páginas do sistema
│   ├── api/               # API Routes
│   └── modules/           # Módulos organizados por funcionalidade
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de interface
│   └── ...               # Outros componentes
├── lib/                  # Utilitários e configurações
├── hooks/                # Custom hooks
├── store/                # Estado global (Zustand)
├── types/                # Definições de tipos
└── utils/                # Funções utilitárias
```

## 🎯 Funcionalidades Detalhadas

### Gestão de Clientes

- Cadastro completo de clientes
- Histórico de orçamentos e contratos
- Informações de contato e endereço

### Sistema de Orçamentos

- Criação de orçamentos detalhados
- Cálculo automático de valores
- Envio por email (futuro)
- Acompanhamento de status

### Controle Financeiro

- Contas a pagar e receber
- Fluxo de caixa
- Relatórios financeiros
- Controle de parcelas

### Gestão de Itens

- Catálogo de produtos e serviços
- Preços e descrições
- Categorização por tipo

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build e produção
npm run build        # Gera build de produção
npm run start        # Inicia servidor de produção

# Qualidade de código
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas do ESLint
npm run format       # Formata código com Prettier
npm run format:check # Verifica formatação

# Banco de dados
npx prisma studio    # Abre Prisma Studio
npx prisma migrate dev # Executa migrações
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👨‍💻 Autor

**Gabriel Maschio**

- GitHub: [@seu-usuario](https://github.com/GabrielMaschio)
- LinkedIn: [Gabriel Maschio](https://linkedin.com/in/gabriel-maschio)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Prisma](https://prisma.io/) - ORM para banco de dados
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis

---

<div align="center">
  <p>Feito com ❤️ por Gabriel Maschio</p>
  <p>🎉 Transforme a organização dos seus eventos em uma experiência prática e sem imprevistos!</p>
</div>
