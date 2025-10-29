import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "./prisma";

export const authOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        senha: { label: "senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) {
          return null;
        }

        const existeEmpresa = await db.empresa.findUnique({
          where: { email: credentials.email as string },
        });
        if (!existeEmpresa) {
          return null;
        }

        const passwordMatch = await compare(credentials.senha as string, existeEmpresa.senha);
        if (!passwordMatch) {
          return null;
        }

        return {
          id: existeEmpresa.id.toString(),
          email: existeEmpresa.email,
          name: existeEmpresa.nome,
          empresaId: existeEmpresa.id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: any) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
        },
      };
    },
  },
};

export default NextAuth(authOptions);

// Exportar funções para compatibilidade com NextAuth.js v4
export const auth = async () => {
  const { getServerSession } = await import("next-auth");
  return await getServerSession(authOptions);
};

export const signIn = async (provider: string, options: any) => {
  const { signIn: nextAuthSignIn } = await import("next-auth/react");
  return await nextAuthSignIn(provider, options);
};

export const signOut = async () => {
  const { signOut: nextAuthSignOut } = await import("next-auth/react");
  return await nextAuthSignOut();
};
