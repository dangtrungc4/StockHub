import { auth } from "@/middlewares/auth.js";
import { permit } from "@/middlewares/rbac.js";
import { Router } from "express";
import { getOrders, postOrder } from "./controller.js";
const r = Router();

r.use(auth());
r.get("/", permit("orders.read"), getOrders);
r.post("/", permit("orders.write"), postOrder);

export default r;
