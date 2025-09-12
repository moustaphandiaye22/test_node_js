// Utilisation de l'inférence TypeScript pour le type Todo
import { TodoService } from "../services/todoService.js";
import { CreateTodoSchema } from "../validators/todoSchema.js";
const mnservice = new TodoService();
export class todoController {
    static async getAll(_req, res) {
        try {
            const users = await mnservice.getAllTodos();
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async findById(req, res) {
        try {
            const id = Number(req.params.id);
            const todo = await mnservice.findTodoById(id);
            if (!todo) {
                return res.status(404).json({ error: "Todo non trouvé" });
            }
            return res.json(todo);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async create(req, res) {
        try {
            const data = CreateTodoSchema.parse(req.body);
            const todo = await mnservice.createTodo(data);
            res.status(201).json(todo);
        }
        catch (error) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(400).json({ errors });
        }
    }
    static async update(req, res) {
        try {
            const id = Number(req.params.id);
            const data = CreateTodoSchema.parse(req.body);
            const todo = await mnservice.updateTodo(id, data);
            res.json(todo);
        }
        catch (error) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(400).json({ errors });
        }
    }
    static async delete(req, res) {
        try {
            const id = Number(req.params.id);
            await mnservice.deleteTodo(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=todoController.js.map