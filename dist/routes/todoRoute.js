import { Router } from "express";
import { todoController } from "../controllers/todoController.js";
const mnrouter = Router();
mnrouter.get("/", todoController.getAll);
mnrouter.get("/:id", todoController.findById);
mnrouter.post("/", todoController.create);
mnrouter.put("/:id", todoController.update);
mnrouter.delete("/:id", todoController.delete);
export default mnrouter;
//# sourceMappingURL=todoRoute.js.map