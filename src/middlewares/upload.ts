import multer from "multer";
import path from "path";
import fs from "fs";

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), "assets");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

import type { Request } from "express";
import type { FileFilterCallback } from "multer";

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  // Accept images only
  if (!file.mimetype.startsWith("image/")) {
    return cb(null, false);
  }
  cb(null, true);
};

export const upload = multer({ storage, fileFilter });
