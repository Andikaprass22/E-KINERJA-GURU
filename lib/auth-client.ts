import { createAuthClient } from "better-auth/react";
import { multiSessionClient } from "better-auth/client/plugins";
import { usernameClient } from "better-auth/client/plugins";

type UserRole = "ADMIN" | "PRINCIPAL" | "TEACHER";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const authClient = createAuthClient({
  plugins: [multiSessionClient(), usernameClient()],
});

export type { User };
