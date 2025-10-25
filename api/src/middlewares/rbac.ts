import { prisma } from "@/lib/prisma.js";
import type { NextFunction, Request, Response } from "express";

export function permit(permission: string) {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });
    const perms = new Set<string>();
    user?.roles.forEach((r) =>
      (r as any).permissions?.forEach?.((p: string) => perms.add(p))
    );
    if (!perms.has(permission))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
