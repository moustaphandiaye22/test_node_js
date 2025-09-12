export declare class TodoService {
    private mnrepo;
    constructor();
    getAllTodos(): Promise<{
        id: number;
        title: string;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findTodoById(id: number): Promise<{
        id: number;
        title: string;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    createTodo(data: any): Promise<{
        id: number;
        title: string;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTodo(id: number, data: any): Promise<{
        id: number;
        title: string;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteTodo(id: number): Promise<void>;
}
//# sourceMappingURL=todoService.d.ts.map