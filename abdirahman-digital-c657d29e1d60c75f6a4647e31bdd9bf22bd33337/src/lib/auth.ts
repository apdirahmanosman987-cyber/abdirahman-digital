import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isLoginRateLimited, recordLoginAttempt } from "@/lib/rate-limit";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // 8 hour sessions
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw, req) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        // Best-effort IP extraction (behind proxies, trust X-Forwarded-For)
        const ipAddress =
          (req?.headers?.["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? "unknown";

        if (await isLoginRateLimited(email, ipAddress)) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          await recordLoginAttempt({ email, ipAddress, success: false });
          return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);

        await recordLoginAttempt({
          email,
          ipAddress,
          success: valid,
          userId: user.id,
        });

        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
