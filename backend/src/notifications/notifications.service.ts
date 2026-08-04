import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../reviewer/notification.entity';
import { PusherService } from '../pusher/pusher.service';

/**
 * Centralised in-app + push notification helper.
 * Writes a row to the `notifications` table (read by the in-app bell) AND
 * fires a Pusher Beams push for real-time delivery.
 */
@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly pusherService: PusherService,
  ) {}

  /** Create an in-app notification row for a user. */
  async create(userId: string, title: string, message: string) {
    const notification = this.notificationRepository.create({
      user: { userId } as any,
      title,
      message,
    });
    return this.notificationRepository.save(notification);
  }

  /** Notify a company user (in-app + push). */
  async notifyCompany(userId: string, title: string, message: string) {
    await this.create(userId, title, message);
    await this.pusherService.notifyCompany(title, message);
  }

  /** Notify an employee user (in-app + push). */
  async notifyEmployee(userId: string, title: string, message: string) {
    await this.create(userId, title, message);
    await this.pusherService.notifyEmployee(title, message);
  }

  /** Notify reviewers (push only — reviewers have no single userId). */
  async notifyReviewers(title: string, message: string) {
    await this.pusherService.notifyReviewers(title, message);
  }

  /** List all notifications for a user, newest first. */
  async listForUser(userId: string) {
    return this.notificationRepository.find({
      where: { user: { userId } as any },
      order: { createdAt: 'DESC' },
    });
  }

  /** Mark a single notification as read (only if it belongs to the user). */
  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { notificationId },
    });
    if (!notification) return null;
    // Lazy ownership check via relation lookup
    const owned = await this.notificationRepository.findOne({
      where: { notificationId, user: { userId } as any },
    });
    if (!owned) return null;
    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  /** Mark every unread notification for a user as read. */
  async markAllRead(userId: string) {
    await this.notificationRepository
      .createQueryBuilder()
      .update(NotificationEntity)
      .set({ isRead: true })
      .where('userId = :userId', { userId })
      .execute();
    return { message: 'All notifications marked as read' };
  }

  /** Unread count for badge display. */
  async unreadCount(userId: string) {
    return this.notificationRepository.count({
      where: { user: { userId } as any, isRead: false },
    });
  }
}
