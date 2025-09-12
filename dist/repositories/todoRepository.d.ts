import type { todo } from "@prisma/client";
import type { InterfaceRepository } from "./InterfacRepository.js";
export declare class TodoRepository implements InterfaceRepository<todo> {
    private mnprisma;
    findAll(): Promise<todo[]>;
    findById(id: number): Promise<todo | null>;
    create(data: Omit<todo, "id">): Promise<todo>;
    update(id: number, data: Partial<Omit<todo, "id">>): Promise<todo>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=todoRepository.d.ts.map