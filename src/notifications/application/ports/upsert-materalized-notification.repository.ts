import { NotificationReadModel } from '../../domain/read-models/notification.read-model';

export abstract class UpsertMaterializedNotificationRepository {
  abstract upsert(
    notification: Pick<NotificationReadModel, 'id'> &
      Partial<NotificationReadModel>,
  ): Promise<void>;
}
