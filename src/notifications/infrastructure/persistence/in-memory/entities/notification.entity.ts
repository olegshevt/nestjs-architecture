import { NotificationItemEntity } from './notification-item.entity';

export class NotificationEntity {
  id: string;
  name: string;
  severity: string;
  triggeredAt: Date;
  isAcknowledged: boolean;
  items: Array<NotificationItemEntity>;
}
