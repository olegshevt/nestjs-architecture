import { DynamicModule, Module, Type } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from '../presenters/http/notifications.controller';
import { NotificationFactory } from '../domain/factories/notification.factory';
import { CreateNotificationCommandHandler } from './commands/create-notification.command-handler';
import { GetNotificationsQueryHandler } from './queries/get-notifications.query-handler';
import { NotificationCreatedEventHandler } from './event-handlers/notification-created.event-handler';
import { NotificationAcknowledgedEventHandler } from './event-handlers/acknowledge-notification.event-handler';
import { AcknowledgeNotificationCommandHandler } from './commands/acknowledge-notification.command-handler';
import { CascadingNotificationsSaga } from './sagas/cascading-notifications.saga';
import { NotifyFacilitySupervisorCommandHandler } from './commands/notify-facility-supervisor.command-handler';
import { UnacknowledgedNotificationsSaga } from './sagas/unacknowledged-notifications.saga';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationFactory,
    CreateNotificationCommandHandler,
    GetNotificationsQueryHandler,
    NotificationCreatedEventHandler,
    CascadingNotificationsSaga,
    NotifyFacilitySupervisorCommandHandler,
    UnacknowledgedNotificationsSaga,
  ],
})
export class NotificationsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: NotificationsModule,
      providers: [
        AcknowledgeNotificationCommandHandler,
        NotificationAcknowledgedEventHandler,
      ],
      imports: [infrastructureModule],
    };
  }
}
