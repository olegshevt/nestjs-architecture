import { Injectable } from '@nestjs/common';
import { CreateNotificationRepository } from '../../../../application/ports/create-notification.repository';
import { Notification } from '../../../../domain/notification';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationMapper } from '../mappers/notification.mapper';
import { UpsertMaterializedNotificationRepository } from 'src/notifications/application/ports/upsert-materalized-notification.repository';
import { NotificationReadModel } from 'src/notifications/domain/read-models/notification.read-model';

@Injectable()
export class InMemoryNotificationRepository
  implements
    CreateNotificationRepository,
    InMemoryNotificationRepository,
    UpsertMaterializedNotificationRepository
{
  private readonly notifications = new Map<string, NotificationEntity>();
  private readonly materializedNotificationViews = new Map<
    string,
    NotificationReadModel
  >();

  constructor() {}

  async findAll(): Promise<NotificationReadModel[]> {
    return Array.from(this.materializedNotificationViews.values());
  }

  async save(notification: Notification): Promise<Notification> {
    const persistenceModel = NotificationMapper.toPersistence(notification);
    this.notifications.set(persistenceModel.id, persistenceModel);

    const newEntity = this.notifications.get(persistenceModel.id);
    return NotificationMapper.toDomain(newEntity);
  }

  async upsert(
    notification: Pick<NotificationReadModel, 'id'> &
      Partial<NotificationReadModel>,
  ): Promise<void> {
    if (this.materializedNotificationViews.has(notification.id)) {
      this.materializedNotificationViews.set(notification.id, {
        ...this.materializedNotificationViews.get(notification.id),
        ...notification,
      });
      return;
    }
    this.materializedNotificationViews.set(
      notification.id,
      notification as NotificationReadModel,
    );
  }
}
