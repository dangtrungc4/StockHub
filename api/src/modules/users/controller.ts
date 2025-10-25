import type { Request, Response } from 'express'
import * as svc from './service.js'

export async function getUsers(_req: Request, res: Response) {
  res.json(await svc.list())
}
export async function getUser(req: Request, res: Response) {
  res.json(await svc.find(Number(req.params.id)))
}
export async function postUser(req: Request, res: Response) {
  const { email, name, password, roles } = req.body
  res.status(201).json(await svc.create({ email, name, password, roleNames: roles }))
}
export async function deleteUser(req: Request, res: Response) {
  await svc.remove(Number(req.params.id))
  res.status(204).end()
}
