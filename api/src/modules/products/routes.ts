import { auth } from "@/middlewares/auth.js";
import { permit } from "@/middlewares/rbac.js";
import { Router } from "express";
import {
  deleteProduct,
  getProducts,
  patchProduct,
  postProduct,
} from "./controller.js";
const r = Router();

r.use(auth());
r.get("/", permit("products.read"), getProducts);
r.post("/", permit("products.write"), postProduct);
r.patch("/:id", permit("products.write"), patchProduct);
r.delete("/:id", permit("products.write"), deleteProduct);

export default r;
