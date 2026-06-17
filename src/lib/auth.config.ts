import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: Role }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdminRoute = pathname.startsWith("/admin");
      const isLoginPage = pathname === "/admin/login";

      if (!isAdminRoute) {
        return true;
      }

      if (isLoginPage) {
        return true;
      }

      return !!auth?.user;
    },
  },
  providers: [],
  trustHost: true,
} satisfies NextAuthConfig;
