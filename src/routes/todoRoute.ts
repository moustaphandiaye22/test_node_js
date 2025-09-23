
import { Router } from "express";
import { todoController } from "../controllers/todoController.js";
import { todoAccess } from "../middlewares/access.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const mnrouter = Router();

// GET: tout utilisateur connecté peut lister toutes les tâches

mnrouter.get("/", requireAuth, todoAccess, todoController.getAll);
mnrouter.get("/:id", requireAuth, todoAccess, todoController.findById);
mnrouter.post("/", requireAuth, todoController.create);
mnrouter.put("/:id", requireAuth, todoAccess, todoController.update);
mnrouter.delete("/:id", requireAuth, todoAccess, todoController.delete);
mnrouter.patch("/:id/complete", requireAuth, todoAccess, todoController.complete);
mnrouter.patch("/:id/archive", requireAuth, todoAccess, todoController.archive);
mnrouter.patch("/:id/unarchive", requireAuth, todoAccess, todoController.unarchive);
mnrouter.post("/:id/share", requireAuth, todoAccess, todoController.share);

export default mnrouter;
