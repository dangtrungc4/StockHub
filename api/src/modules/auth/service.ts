import { env } from "@/config/env.js";
import { prisma } from "@/lib/prisma.js";
import { compare } from "@/utils/password.js";
import jwt from "jsonwebtoken";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { roles: true },
  });
  if (!user)
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  const ok = await compare(password, user.password);
  if (!ok)
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  const roles = user.roles.map((r) => r.name);
  const token = jwt.sign(
    { id: user.id, email: user.email, roles },
    env.JWT_SECRET,
    { expiresIn: "12h" }
  );
  return {
    token,
    user: { id: user.id, email: user.email, name: user.name, roles },
  };
}
