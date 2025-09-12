import { PrismaClient } from "@prisma/client";
export class TodoRepository {
    mnprisma = new PrismaClient;
    async findAll() {
        return this.mnprisma.todo.findMany();
    }
    async findById(id) {
        return this.mnprisma.todo.findUnique({
            where: { id }
        });
    }
    async create(data) {
        return this.mnprisma.todo.create({ data });
    }
    async update(id, data) {
        return this.mnprisma.todo.update({ where: { id }, data });
    }
    async delete(id) {
        this.mnprisma.todo.delete({ where: { id } });
    }
}
//# sourceMappingURL=todoRepository.js.map