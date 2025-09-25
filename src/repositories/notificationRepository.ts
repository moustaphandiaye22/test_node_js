import { mnprisma } from '../config/db.js';

export class NotificationRepository {
  async createNotification(userId: number, todoId: number | null, message: string) {
    return mnprisma.notification.create({
      data: {
        userId,
        todoId,
        message,
      }
    });
  }

  async getUserNotifications(userId: number) {
    return mnprisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async markAsRead(notificationId: number) {
    return mnprisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });
  }
}
