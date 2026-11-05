import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

// Extend the built-in session/JWT types to include custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string | null;
  }
}

// Demo credentials mapping for simulating myITS SSO
const DEMO_CREDENTIALS: Record<string, string> = {
  "student1@its.ac.id": "student123",
  "student2@its.ac.id": "student123",
  "admin@its.ac.id": "admin123",
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "its-sso",
      name: "myITS SSO",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "username@its.ac.id" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi.");
        }

        const { email, password } = credentials;

        // Validate against demo credentials
        const expectedPassword = DEMO_CREDENTIALS[email];
        if (!expectedPassword || expectedPassword !== password) {
          throw new Error("Email atau password salah.");
        }

        // Look up the user in the database
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            image: true,
          },
        });

        if (!user) {
          throw new Error("Akun tidak ditemukan. Hubungi administrator.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, persist user fields into the JWT
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose JWT fields to the client session
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        image: token.image,
      };
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
};
