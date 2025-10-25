import { env } from "@/config/env.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  id: number;
  email: string;
  roles: string[];
}

export function auth(required = true) {
  return (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const header = req.headers.authorization;
    if (!header) {
      if (required) return res.status(401).json({ message: "Unauthorized" });
      return next();
    }
    const token = header.replace("Bearer ", "");
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;
      req.user = decoded;
      next();
    } catch (e) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}
