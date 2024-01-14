import { Module } from '@nestjs/common';
import { CreateNotificationRepository } from '../../../application/ports/create-notification.repository';
import { InMemoryNotificationRepository } from './repositories/notification.repository';
import { FindNotificationsRepository } from '../../../application/ports/find-notifications.repository';
import { UpsertMaterializedNotificationRepository } from 'src/notifications/application/ports/upsert-materalized-notification.repository';

@Module({
  imports: [],
  providers: [
    InMemoryNotificationRepository,
    {
      provide: CreateNotificationRepository,
      useExisting: InMemoryNotificationRepository, // 💡 This is where we bind the port to an adapter
    },
    {
      provide: FindNotificationsRepository,
      useClass: InMemoryNotificationRepository,
    },
    {
      provide: UpsertMaterializedNotificationRepository,
      useClass: InMemoryNotificationRepository,
    },
  ],
  exports: [
    CreateNotificationRepository,
    FindNotificationsRepository,
    UpsertMaterializedNotificationRepository,
  ],
})
export class InMemoryNotificationPersistenceModule {}
