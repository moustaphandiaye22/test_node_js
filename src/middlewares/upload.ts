import multer from "multer";
import path from "path";
import fs from "fs";


// Storage dynamique selon le champ (image ou audio)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = "assets";
    if (file.fieldname === "audio") dir = "audio";
    const fullDir = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullDir)) {
      fs.mkdirSync(fullDir, { recursive: true });
    }
    cb(null, fullDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

import type { Request } from "express";
import type { FileFilterCallback } from "multer";


// Accepte images ET audio
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.fieldname === "image" && file.mimetype.startsWith("image/")) return cb(null, true);
  if (file.fieldname === "audio" && file.mimetype.startsWith("audio/")) return cb(null, true);
  cb(null, false);
};

export const upload = multer({ storage, fileFilter });
