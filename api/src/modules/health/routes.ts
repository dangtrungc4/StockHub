import { Router } from "express";
const r = Router();
r.get("/", (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);
export default r;
