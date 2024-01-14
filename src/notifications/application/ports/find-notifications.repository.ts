import { NotificationReadModel } from '../../domain/read-models/notification.read-model';

export abstract class FindNotificationsRepository {
  abstract findAll(): Promise<NotificationReadModel[]>;
}
