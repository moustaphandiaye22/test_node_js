import { AuthService } from '../services/authService.js';
import type { Request, Response } from 'express';

export class AuthController {
		static async login(req: Request, res: Response) {
		try {
			const credentials = req.body;
			const tokens = await AuthService.login(credentials);
			res.status(200).json(tokens);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				res.status(401).json({ error: message });
			}
	}

		static async refreshToken(req: Request, res: Response) {
		try {
			const { refreshToken } = req.body;
			const token = await AuthService.refreshToken(refreshToken);
			res.status(200).json(token);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				res.status(401).json({ error: message });
			}
	}
        static async logout(_req: Request, res: Response) {
                res.status(200).json({ message: "Logged out successfully" });
        }
        

}
