import type { Request, Response } from "express";
import { HistoriqueService } from "../services/historiqueService.js";
interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
    };
}
// Utilisation de l'inférence TypeScript pour le type Todo
import { TodoService } from "../services/todoService.js";
import { CreateTodoSchema } from "../validators/todoSchema.js"; 
const mnservice = new TodoService();
const historiqueService = new HistoriqueService();

export class todoController {
    static async share(req: AuthenticatedRequest, res: Response) {
        try {
            const todoId: number = Number(req.params.id);
            const { userId, canEdit, canDelete } = req.body;
            if (!userId) {
                return res.status(400).json({ error: "userId requis" });
            }
            const todo = await mnservice.findTodoById(todoId);
            if (!todo) {
                return res.status(404).json({ error: "Todo non trouvé" });
            }
            // Seul le propriétaire peut partager
            if (todo.userId !== req.user?.id) {
                return res.status(403).json({ error: "Seul le propriétaire peut partager" });
            }
            const share = await mnservice.shareTodo(todoId, userId, !!canEdit, !!canDelete);
            await historiqueService.create({
                userId: req.user?.id,
                action: "SHARE",
                todoId: todoId,
                timestamp: new Date()
            });
            res.status(201).json(share);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
    static async complete(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const existing = await mnservice.findTodoById(id);
            if (!existing) {
                return res.status(404).json({ error: "Todo non trouvé" });
            }
            const todo = await mnservice.updateTodo(id, { completed: true });
            await historiqueService.create({
                userId: todo.userId,
                action: "UPDATE",
                todoId: id,
                timestamp: new Date()
            });
            res.json(todo);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getAll(_req: Request, res: Response) {
        try {
            const mnusers = await mnservice.getAllTodos();
            res.json(mnusers);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async findById(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const mntodo = await mnservice.findTodoById(id);
            if (!mntodo) {
                return res.status(404).json({ error: "Todo non trouvé" });
            }
            return res.json(mntodo);
        } catch (error: any) {
           return res.status(400).json({ error: error.message });
        }
    }
    
    static async create(req: Request, res: Response) {
        try {
            const mndata = CreateTodoSchema.parse(req.body);
            const mntodo = await mnservice.createTodo(mndata);
            await historiqueService.create({
                userId: mntodo.userId,
                action: "CREATE",
                todoId: mntodo.id,
                timestamp: new Date()
            });
            res.status(201).json(mntodo);
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(400).json({ errors });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const mndata = CreateTodoSchema.parse(req.body);
            const mntodo = await mnservice.updateTodo(id, mndata);
            await historiqueService.create({
                userId: mntodo.userId,
                action: "UPDATE",
                todoId: mntodo.id,
                timestamp: new Date()
            });
            res.json(mntodo);
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(400).json({ errors });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            await mnservice.deleteTodo(id);
            await historiqueService.create({
                userId: id,
                action: "DELETE",
                todoId: id,
                timestamp: new Date()
            });
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}