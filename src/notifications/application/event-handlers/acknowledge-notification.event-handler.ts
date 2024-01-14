import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SerializedEventPayload } from '../../../shared/domain/interfaces/serializable-event';
import { NotificationAcknowledgedEvent } from '../../domain/events/notification-acknowledged.event';
import { UpsertMaterializedNotificationRepository } from '../ports/upsert-materalized-notification.repository';

@EventsHandler(NotificationAcknowledgedEvent)
export class NotificationAcknowledgedEventHandler
  implements
    IEventHandler<SerializedEventPayload<NotificationAcknowledgedEvent>>
{
  private readonly logger = new Logger(
    NotificationAcknowledgedEventHandler.name,
  );

  constructor(
    private readonly upsertMaterializedNotificationRepository: UpsertMaterializedNotificationRepository,
  ) {}

  async handle(event: SerializedEventPayload<NotificationAcknowledgedEvent>) {
    this.logger.log(
      `Notification acknowledged event: ${JSON.stringify(event)}`,
    );
    // In a real-world application, we would have to ensure that this event is
    // redelivered in case of a failure. Otherwise, we would end up with an inconsistent state.
    await this.upsertMaterializedNotificationRepository.upsert({
      id: event.notificationId,
      isAcknowledged: true,
    });
  }
}
