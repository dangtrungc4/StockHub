import { auth } from "@/middlewares/auth.js";
import { permit } from "@/middlewares/rbac.js";
import { Router } from "express";
import { deleteUser, getUser, getUsers, postUser } from "./controller.js";
const r = Router();

r.use(auth());
r.get("/", permit("users.read"), getUsers);
r.get("/:id", permit("users.read"), getUser);
r.post("/", permit("users.write"), postUser);
r.delete("/:id", permit("users.write"), deleteUser);

export default r;
