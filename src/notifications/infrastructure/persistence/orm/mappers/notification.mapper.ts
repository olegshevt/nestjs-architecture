import { NotificationItem } from 'src/notifications/domain/notification-item';
import { Notification } from '../../../../domain/notification';
import { NotificationSeverity } from '../../../../domain/value-objects/notification-severity';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationItemEntity } from '../entities/notification-item.entity';

export class NotificationMapper {
  static toDomain(notificationEntity: NotificationEntity): Notification {
    const notificationSeverity = new NotificationSeverity(
      notificationEntity.severity as 'critical' | 'low' | 'medium' | 'high',
    );
    const notificationModel = new Notification(notificationEntity.id);
    notificationModel.name = notificationEntity.name;
    notificationModel.severity = notificationSeverity;
    notificationModel.isAcknowledged = notificationEntity.isAcknowledged;
    notificationModel.triggeredAt = notificationEntity.triggeredAt;
    notificationModel.items = notificationEntity.items.map(
      (item) => new NotificationItem(item.id, item.name, item.type),
    );
    return notificationModel;
  }

  static toPersistence(notification: Notification) {
    const entity = new NotificationEntity();
    entity.id = notification.id;
    entity.name = notification.name;
    entity.severity = notification.severity.value;
    entity.severity = notification.severity.value;
    entity.triggeredAt = notification.triggeredAt;
    entity.isAcknowledged = notification.isAcknowledged;
    entity.items = notification.items.map((item) => {
      const itemEntity = new NotificationItemEntity();
      itemEntity.id = item.id;
      itemEntity.name = item.name;
      itemEntity.type = item.type;
      return itemEntity;
    });

    return entity;
  }
}
