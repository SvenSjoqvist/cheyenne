import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma/client";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// Track login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Check rate limiting
          const attempts = loginAttempts.get(credentials.email);
          const now = Date.now();

          if (attempts) {
            if (
              attempts.count >= MAX_ATTEMPTS &&
              now - attempts.lastAttempt < LOCKOUT_TIME
            ) {
              throw new Error(
                "Too many login attempts. Please try again later."
              );
            }

            // Reset attempts if lockout time has passed
            if (now - attempts.lastAttempt >= LOCKOUT_TIME) {
              loginAttempts.delete(credentials.email);
            }
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.password) {
            // Track failed attempt
            const currentAttempts = loginAttempts.get(credentials.email) || {
              count: 0,
              lastAttempt: now,
            };
            loginAttempts.set(credentials.email, {
              count: currentAttempts.count + 1,
              lastAttempt: now,
            });
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            // Track failed attempt
            const currentAttempts = loginAttempts.get(credentials.email) || {
              count: 0,
              lastAttempt: now,
            };
            loginAttempts.set(credentials.email, {
              count: currentAttempts.count + 1,
              lastAttempt: now,
            });
            return null;
          }

          // Successful login - reset attempts
          loginAttempts.delete(credentials.email);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
      }
      // Verify user still exists in database
      if (token.id) {
        const userExists = await prisma.user.findUnique({
          where: { id: token.id },
          select: { id: true },
        });
        if (!userExists) {
          return null;
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
