import type { Request, Response } from 'express'
import * as svc from './service.js'

export async function postLogin(req: Request, res: Response) {
  const { email, password } = req.body
  const result = await svc.login(email, password)
  res.json(result)
}
