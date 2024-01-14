import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Notification } from '../notification';
import { NotificationSeverity } from '../value-objects/notification-severity';
import { NotificationItem } from '../notification-item';
import { NotificationCreatedEvent } from '../events/notification-created.event';

@Injectable()
export class NotificationFactory {
  create(
    name: string,
    severity: string,
    triggeredAt: Date,
    items: Array<{ name: string; type: string }>,
  ): Notification {
    const notificationId = randomUUID();
    const notificationSeverity = new NotificationSeverity(
      severity as NotificationSeverity['value'],
    );
    const notification = new Notification(notificationId);
    notification.name = name;
    notification.severity = notificationSeverity;
    notification.triggeredAt = triggeredAt;
    items
      .map((item) => new NotificationItem(randomUUID(), item.name, item.type))
      .forEach((item) => notification.addNotificationItem(item));
    notification.apply(new NotificationCreatedEvent(notification), {
      skipHandler: true,
    });
    return notification;
  }
}
