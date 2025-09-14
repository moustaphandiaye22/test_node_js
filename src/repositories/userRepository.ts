import { PrismaClient } from "@prisma/client";
import type { user } from "@prisma/client";
import type { InterfaceRepository } from "./InterfacRepository.js";
import { mnprisma } from '../config/db.js';

export class UserRepository implements InterfaceRepository<user>{

    async findAll(): Promise<user[]> {
        return mnprisma.user.findMany({
            include: {
                todos: true,
            }
        });
    }

    async findById(id: number): Promise<user | null> {
        return mnprisma.user.findUnique({
            where: { id },
            include: {
                todos: true,
            }
        });
    }

    async create(data: Omit<user, "id">): Promise<user> {
        return mnprisma.user.create({ data });
        
    }

    async update(id: number,data: Partial<Omit<user, "id" >> ): Promise<user> {
        return mnprisma.user.update({ where: { id }, data });
    }

 async delete(id: number): Promise<void> {
        await mnprisma.user.delete({ where: { id } });
    }
}