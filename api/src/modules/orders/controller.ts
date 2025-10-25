import { prisma } from "@/lib/prisma.js";
import type { Request, Response } from "express";
import * as svc from "./service.js";

export async function postOrder(req: Request & { user?: any }, res: Response) {
  const { items } = req.body;
  const order = await svc.createOrder({ userId: req.user?.id, items });
  res.status(201).json(order);
}

export async function getOrders(_req: Request, res: Response) {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { id: "desc" },
  });
  res.json(orders);
}
