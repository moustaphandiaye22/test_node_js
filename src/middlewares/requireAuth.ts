import { verifyAccessToken } from '../auth/jwt.js';
import type { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    profil?: string;
  };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou invalide' });
  }
  const token = authHeader.split(' ')[1] as string;
  try {
    const payload = verifyAccessToken(token);
    const prisma = new PrismaClient();
    const userFound = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!userFound) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }
    req.user = {
      id: userFound.id,
      email: userFound.email,
      profil: userFound.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};
