import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { multiSession } from "better-auth/plugins/multi-session";
import { username } from "better-auth/plugins";
import { admin } from "better-auth/plugins/admin";
import { createAccessControl } from "better-auth/plugins/access";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

const statement = {
  user: ["read", "update"],
  admin: ["read", "update", "delete", "ban"],
} as const;

const ac = createAccessControl(statement);

const adminRole = ac.newRole({
  user: ["read", "update"],
  admin: ["read", "update", "delete", "ban"],
});

const principalRole = ac.newRole({
  user: ["read", "update"],
  admin: ["read", "update"],
});

const teacherRole = ac.newRole({
  user: ["read", "update"],
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins:
    process.env.NODE_ENV === "development"
      ? (request?: Request) => [request?.headers.get("origin") ?? "*"]
      : [process.env.BETTER_AUTH_URL!, process.env.NEXT_PUBLIC_APP_URL!],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        unique: true,
      },
      role: {
        type: ["ADMIN", "PRINCIPAL", "TEACHER"],
        required: false,
        defaultValue: "TEACHER",
        input: false,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => {
        return await bcrypt.hash(password, 10);
      },
      verify: async ({ hash, password }) => {
        return await bcrypt.compare(password, hash);
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [
    nextCookies(),
    multiSession(),
    username(),
    admin({
      ac,
      roles: {
        ADMIN: adminRole,
        PRINCIPAL: principalRole,
        TEACHER: teacherRole,
      },
      defaultRole: "TEACHER",
      adminRoles: ["ADMIN", "PRINCIPAL"],
    }),
  ],
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});

export type Session = typeof auth.$Infer.Session;
