import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NotificationCreatedEvent } from 'src/notifications/domain/events/notification-created.event';
import { Logger } from '@nestjs/common';
import { UpsertMaterializedNotificationRepository } from '../ports/upsert-materalized-notification.repository';
import { SerializedEventPayload } from 'src/shared/domain/interfaces/serializable-event';

@EventsHandler(NotificationCreatedEvent)
export class NotificationCreatedEventHandler
  implements IEventHandler<NotificationCreatedEvent>
{
  private readonly logger = new Logger(NotificationCreatedEventHandler.name);

  constructor(
    private readonly upsertMaterializedNotificationRepository: UpsertMaterializedNotificationRepository,
  ) {}

  // async handle(event: NotificationCreatedEvent) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  async handle(event: SerializedEventPayload<NotificationCreatedEvent>) {
    this.logger.log(`Notification created event: ${JSON.stringify(event)}`);

    //Transactional inbox/outbox pattern
    await this.upsertMaterializedNotificationRepository.upsert({
      id: event.notification.id,
      name: event.notification.name,
      severity: event.notification.severity,
      triggeredAt: new Date(event.notification.triggeredAt),
      isAcknowledged: event.notification.isAcknowledged,
      items: event.notification.items,
    });
  }
}
