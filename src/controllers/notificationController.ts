import { NotificationService } from '../services/notificationService.js';
import { UserRepository } from '../repositories/userRepository.js';
import type { Request, Response } from "express";


const notificationService = new NotificationService();
const userRepository = new UserRepository();

export class notificationController {
  static async getUserNotifications(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const notifications = await notificationService.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errMsg });
    }
  }

  static async markAsRead(req: Request, res: Response) {
    try {
  const notificationId = Number(req.params.id);
  await notificationService.markAsRead(notificationId);
      res.json({ success: true });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: errMsg });
    }
  }
}
