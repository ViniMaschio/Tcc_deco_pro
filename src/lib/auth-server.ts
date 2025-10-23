import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { db } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
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
          empresaId: existeEmpresa.id,
        };
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
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
        },
      };
    },
  },
});
