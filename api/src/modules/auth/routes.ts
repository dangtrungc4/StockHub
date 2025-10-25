import { Router } from "express";
import { postLogin } from "./controller.js";
const r = Router();
r.post("/login", postLogin);
export default r;
