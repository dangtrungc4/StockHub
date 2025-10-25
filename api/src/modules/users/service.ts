import { prisma } from "@/lib/prisma.js";
import { hash } from "@/utils/password.js";

export const list = () =>
  prisma.user.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
  });
export const find = (id: number) =>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true },
  });
export async function create(data: {
  email: string;
  name: string;
  password: string;
  roleNames?: string[];
}) {
  const password = await hash(data.password);
  const roles = data.roleNames?.length
    ? { connect: await mapRoles(data.roleNames) }
    : undefined;
  return prisma.user.create({
    data: { email: data.email, name: data.name, password, roles },
  });
}
export const remove = (id: number) => prisma.user.delete({ where: { id } });

async function mapRoles(names: string[]) {
  const roles = await prisma.role.findMany({ where: { name: { in: names } } });
  return roles.map((r) => ({ id: r.id }));
}
