import type { Request, Response } from "express";
import * as svc from "./service.js";

export async function getProducts(req: Request, res: Response) {
  const { q, page = "1", pageSize = "25" } = req.query;
  const data = await svc.list(
    q as string | undefined,
    Number(page),
    Number(pageSize)
  );
  res.json(data);
}
export async function postProduct(req: Request, res: Response) {
  res.status(201).json(await svc.create(req.body));
}
export async function patchProduct(req: Request, res: Response) {
  res.json(await svc.update(Number(req.params.id), req.body));
}
export async function deleteProduct(req: Request, res: Response) {
  await svc.remove(Number(req.params.id));
  res.status(204).end();
}
