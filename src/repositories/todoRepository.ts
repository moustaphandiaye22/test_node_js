import { PrismaClient } from "@prisma/client";
import type { todo } from "@prisma/client";
import type { InterfaceRepository } from "./InterfacRepository.js";

export class TodoRepository implements InterfaceRepository<todo>{
    private mnprisma : PrismaClient = new PrismaClient;

    async findAll(): Promise<todo[]> {
        return this.mnprisma.todo.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        });
    }

    async findById(id: number): Promise<todo | null> {
        return this.mnprisma.todo.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        });
    }

    async create(data: Omit<todo, "id">): Promise<todo> {
        return this.mnprisma.todo.create({ data });
    }

    async update(id: number,data: Partial<Omit<todo, "id" >> ): Promise<todo> {
        return this.mnprisma.todo.update({ where: { id }, data });
    }

 async delete(id: number): Promise<void> {
        await this.mnprisma.todo.delete({ where: { id } });
    }

    async shareTodo(todoId: number, userId: number, canEdit: boolean, canDelete: boolean) {
        return this.mnprisma.todoShare.create({
            data: {
                todoId,
                userId,
                canEdit,
                canDelete
            }
        });
    }

    async getTodoShare(todoId: number, userId: number) {
        return this.mnprisma.todoShare.findFirst({
            where: {
                todoId,
                userId
            }
        });
    }
}