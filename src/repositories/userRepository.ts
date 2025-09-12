import { PrismaClient } from "@prisma/client";
import type { user } from "@prisma/client";
import type { InterfaceRepository } from "./InterfacRepository.js";

export class UserRepository implements InterfaceRepository<user>{
    private mnprisma : PrismaClient = new PrismaClient;

    async findAll(): Promise<user[]> {
        return this.mnprisma.user.findMany({
            include: {
                todos: true,
            }
        });
    }

    async findById(id: number): Promise<user | null> {
        return this.mnprisma.user.findUnique({
            where: { id },
            include: {
                todos: true,
            }
        });
    }

    async create(data: Omit<user, "id">): Promise<user> {
        return this.mnprisma.user.create({ data });
        
    }

    async update(id: number,data: Partial<Omit<user, "id" >> ): Promise<user> {
        return this.mnprisma.user.update({ where: { id }, data });
    }

 async delete(id: number): Promise<void> {
        await this.mnprisma.user.delete({ where: { id } });
    }
}