import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateNotificationRepository } from '../../../application/ports/create-notification.repository';
import { NotificationEntity } from './entities/notification.entity';
import { OrmCreateNotificationRepository } from './repositories/create-notification.repository';
import { NotificationItemEntity } from './entities/notification-item.entity';
import { FindNotificationsRepository } from 'src/notifications/application/ports/find-notifications.repository';
import { UpsertMaterializedNotificationRepository } from 'src/notifications/application/ports/upsert-materalized-notification.repository';
import { OrmUpsertMaterializedNotificationRepository } from './repositories/upsert-materialized-notification.repository';
import { OrmFindNotificationsRepository } from './repositories/find-notifications.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MaterializedNotificationView,
  MaterializedNotificationViewSchema,
} from './schemas/materialized-notification-view.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity, NotificationItemEntity]),
    MongooseModule.forFeature([
      {
        name: MaterializedNotificationView.name,
        schema: MaterializedNotificationViewSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: CreateNotificationRepository,
      useClass: OrmCreateNotificationRepository, // 💡 This is where we bind the port to an adapter
    },
    {
      provide: FindNotificationsRepository,
      useClass: OrmFindNotificationsRepository,
    },
    {
      provide: UpsertMaterializedNotificationRepository,
      useClass: OrmUpsertMaterializedNotificationRepository,
    },
  ],
  exports: [
    CreateNotificationRepository,
    FindNotificationsRepository,
    UpsertMaterializedNotificationRepository,
  ],
})
export class OrmNotificationPersistenceModule {}
