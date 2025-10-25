import { env } from "@/config/env.js";
import { auth } from "@/middlewares/auth.js";
import { Router } from "express";
import multer from "multer";
import fs from "node:fs";

const router = Router();
fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.UPLOAD_DIR),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/", auth(), upload.single("file"), (req, res) => {
  res.json({
    filename: req.file?.filename,
    url: `/uploads/${req.file?.filename}`,
  });
});

export default router;
