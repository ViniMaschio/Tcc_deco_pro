import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
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
          where: { email: credentials.email },
        });
        if (!existeEmpresa) {
          return null;
        }

        const passwordMatch = await compare(
          credentials.senha,
          existeEmpresa.senha,
        );
        if (!passwordMatch) {
          return null;
        }

        return { id: existeEmpresa.id.toString(), email: existeEmpresa.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: { ...session.user, id: token.id, email: token.email },
      };
    },
  },
};
