import { Notification } from '../../domain/notification';

export abstract class CreateNotificationRepository {
  abstract save(notification: Notification): Promise<Notification>;
}
