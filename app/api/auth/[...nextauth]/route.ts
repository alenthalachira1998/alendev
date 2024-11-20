import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import db from "@/db/drizzle"
import { users } from "@/db/schema"
import { sql } from "drizzle-orm"

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        try {
          const user = await db.select()
            .from(users)
            .where(sql`${users.email} = ${credentials.email}`)
            .limit(1)
          
          if (user.length === 0) {
            return null
          }
          const dbUser = user[0]
          
          if (typeof dbUser.password !== 'string' || !dbUser.password) {
            console.error('Password field is missing or invalid for user:', dbUser.email)
            return null
          }

          if (credentials.password !== dbUser.password) {
            return null
          }
          
          return { 
            id: dbUser.id, 
            email: dbUser.email, 
            name: dbUser.name 
          }
        } catch (error) {
          console.error('Error in authorize function:', error)
          return null
        }
      }
    }),
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

export const GET = handlers.GET
export const POST = handlers.POST