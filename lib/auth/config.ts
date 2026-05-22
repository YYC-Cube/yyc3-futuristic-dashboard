import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"

const loginSchema = z.object({
  username: z.string().min(1, "用户名不能为空"),
  password: z.string().min(6, "密码至少6位"),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        try {
          const validated = loginSchema.parse(credentials)

          // TODO: 替换为真实的 API 调用
          if (validated.username === "admin" && validated.password === "123456") {
            return {
              id: "emp-001",
              name: "管理员",
              email: "admin@yyc3.com",
              role: "admin",
              employeeNumber: "EMP001",
              position: "系统管理员",
              department: "技术部",
              permissions: ["all"],
            }
          }

          return null
        } catch (error) {
          console.error("[Auth] Authorization error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 30,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login?error=AuthenticationError",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.employeeNumber = (user as any).employeeNumber
        token.position = (user as any).position
        token.department = (user as any).department
        token.permissions = (user as any).permissions
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
        ;(session.user as any).employeeNumber = token.employeeNumber
        ;(session.user as any).position = token.position
        ;(session.user as any).department = token.department
        ;(session.user as any).permissions = token.permissions
      }
      return session
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/rooms") ||
                            nextUrl.pathname.startsWith("/employees") ||
                            nextUrl.pathname.startsWith("/orders")
      const isOnApi = nextUrl.pathname.startsWith("/api/")

      if (isOnApi) {
        return true
      }

      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      }

      return true
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(`[Auth] User signed in: ${user.name} (${account?.provider})`)
    },
    async signOut(message: any) {
      const token = message.token
      if (token) {
        console.log(`[Auth] User signed out: ${token.name}`)
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
})
