import type { Request, Response } from "express";
import { HistoriqueService } from "../services/historiqueService.js";
const historiqueService = new HistoriqueService();

export class HistoriqueController {
    static async getAll(req: Request, res: Response) {
        try {
            const historiques = await historiqueService.findAll();
            res.json(historiques);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { userId, action, todoId, timestamp } = req.body;
            if (!userId || !action || !todoId || !timestamp) {
                return res.status(400).json({ error: "Champs requis manquants" });
            }
            const newHistorique = await historiqueService.create({
                userId,
                action,
                todoId,
                timestamp: new Date(timestamp),
            });
            res.status(201).json(newHistorique);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
    static async delete(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const deleted = await historiqueService.delete(id);
            res.status(204).json(deleted);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
    static async update(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const { userId, action, todoId, timestamp } = req.body;
            const updated = await historiqueService.update(id, { userId, action, todoId, timestamp });
            res.status(200).json(updated);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
