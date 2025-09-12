import { TodoRepository } from "../repositories/todoRepository.js";
// Utilisation de l'inférence TypeScript pour le type Todo
export class TodoService {
    mnrepo;
    constructor() {
        this.mnrepo = new TodoRepository();
    }
    getAllTodos() {
        return this.mnrepo.findAll();
    }
    findTodoById(id) {
        return this.mnrepo.findById(id);
    }
    createTodo(data) {
        return this.mnrepo.create(data);
    }
    updateTodo(id, data) {
        return this.mnrepo.update(id, data);
    }
    async deleteTodo(id) {
        await this.mnrepo.delete(id);
    }
}
//# sourceMappingURL=todoService.js.map