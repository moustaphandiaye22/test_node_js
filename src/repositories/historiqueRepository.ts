import { PrismaClient } from "@prisma/client";
import type { Historique } from "@prisma/client";
import type { InterfaceRepository } from "./InterfacRepository.js";

export class HistoriqueRepository implements InterfaceRepository<Historique>{
    private mnprisma : PrismaClient = new PrismaClient;

    async findAll(): Promise<Historique[]> {
        return this.mnprisma.historique.findMany();
    }

    async findById(id: number): Promise<Historique | null> {
        return this.mnprisma.historique.findUnique({
            where: { id },
        });
    }

    async create(data: Omit<Historique, "id">): Promise<Historique> {
        return this.mnprisma.historique.create({ data });
    }
    async update(id: number,data: Partial<Omit<Historique, "id" >> ): Promise<Historique> {
        return this.mnprisma.historique.update({ where: { id }, data });
    }

 async delete(id: number): Promise<void> {
        await this.mnprisma.historique.delete({ where: { id } });
    }

}
