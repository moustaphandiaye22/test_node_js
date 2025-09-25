import { NotificationRepository } from '../repositories/notificationRepository.js';
export class NotificationService {
  private notificationRepo: NotificationRepository;

  constructor() {
    this.notificationRepo = new NotificationRepository();
  }

  async notifyTaskCompleted(todo: any, users: any[]) {
    const message = `La tâche "${todo.title}" est terminée.`;
    for (const user of users) {
      await this.notificationRepo.createNotification(user.id, todo.id, message);
    }
  }

  async notifyTaskResumed(todo: any, users: any[]) {
    const message = `La tâche "${todo.title}" est de nouveau en cours.`;
    for (const user of users) {
      await this.notificationRepo.createNotification(user.id, todo.id, message);
    }
  }

  async getUserNotifications(userId: number) {
    return this.notificationRepo.getUserNotifications(userId);
  }

  async markAsRead(notificationId: number) {
    return this.notificationRepo.markAsRead(notificationId);
  }
}
