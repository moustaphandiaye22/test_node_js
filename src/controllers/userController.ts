import type { Request, Response } from "express";
// Utilisation de l'inférence TypeScript pour le type Todo
import { UserService } from "../services/userService.js";
import { CreateTodoSchema } from "../validators/todoSchema.js"; 
import { CreateUserSchema } from "../validators/userSchema.js";
const mnservice = new UserService();

export class UserController {
    static async uploadImage(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const file = (req as any).file as Express.Multer.File | undefined;
            if (!file) {
                return res.status(400).json({ error: "Aucune image envoyée" });
            }
            const imageUrl = `/assets/${file.filename}`;
            const mnuser = await mnservice.updateUser(id, { imageUrl });
            res.json({ message: "Image uploadée", imageUrl, user: mnuser });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
   
    static async getAll(_req: Request, res: Response) {
        try {
            const mnusers = await mnservice.getAllUsers();
            // Ajout de l'URL complète de l'image pour chaque utilisateur
            const usersWithImageUrl = mnusers.map((user: any) => ({
                ...user,
                imageUrl: user.imageUrl ? `${_req.protocol}://${_req.get('host')}${user.imageUrl}` : null
            }));
            res.json(usersWithImageUrl);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async findById(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const mnuser = await mnservice.findUserById(id);
            if (!mnuser) {
                return res.status(404).json({ error: "User non trouvé" });
            }
            // Ajout de l'URL complète de l'image si elle existe
            let imageUrl = mnuser.imageUrl ? `${req.protocol}://${req.get('host')}${mnuser.imageUrl}` : null;
            return res.json({ ...mnuser, imageUrl });
        } catch (error: any) {
           return res.status(400).json({ error: error.message });
        }
    }
    
    static async create(req: Request, res: Response) {
        try {
            const mndata = CreateUserSchema.parse(req.body);
            const mnuser = await mnservice.createUser(mndata);
            res.status(201).json(mnuser);
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(400).json({ errors });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            const mndata = CreateUserSchema.parse(req.body);
            const mnuser = await mnservice.updateUser(id, mndata);
            res.json(mnuser);
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(400).json({ errors });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id: number = Number(req.params.id);
            await mnservice.deleteUser(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}