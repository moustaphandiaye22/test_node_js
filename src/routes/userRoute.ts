import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import multer from "multer";
import path from "path";
import { todoController } from "../controllers/todoController.js";
const mnrouter = Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(process.cwd(), "assets"));
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});
const upload = multer({ storage });
mnrouter.post('/:id/upload-image', upload.single('image'), UserController.uploadImage);

mnrouter.get("/", UserController.getAll);
mnrouter.get("/:id", UserController.findById);
mnrouter.post("/", UserController.create);
mnrouter.put("/:id", UserController.update);
mnrouter.delete("/:id", UserController.delete);
export default mnrouter;
