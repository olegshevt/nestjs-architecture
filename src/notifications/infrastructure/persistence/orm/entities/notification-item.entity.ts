import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { NotificationEntity } from './notification.entity';

@Entity('notification_items')
export class NotificationItemEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @ManyToOne(() => NotificationEntity, (notification) => notification.items)
  notification: NotificationEntity;
}
