import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { NotificationItemEntity } from './notification-item.entity';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  severity: string;

  @Column()
  triggeredAt: Date;

  @Column()
  isAcknowledged: boolean;

  @OneToMany(() => NotificationItemEntity, (item) => item.notification, {
    cascade: true,
  })
  items: NotificationItemEntity[];
}
