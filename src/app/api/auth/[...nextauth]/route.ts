import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        await connectDB();

        // Try DB-backed admin first
        const user = await Admin.findOne({ email }).lean();
        if (user) {
          const match = await bcrypt.compare(password, (user as any).passwordHash);
          if (match) {
            return { id: user._id.toString(), name: "Admin", email: user.email, role: user.role };
          }
          return null;
        }

        // Fallback to env bootstrap admin (one-time use)
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
          return {
            id: "bootstrap-admin",
            name: "Admin",
            email,
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // copy role into token when available
        (token as any).role = (user as any).role || "admin";
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user.role = (token as any).role || "admin";
      return session;
    },
  },
});

export { handler as GET, handler as POST };
