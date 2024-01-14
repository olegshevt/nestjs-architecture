import { VersionedAggregateRoot } from 'src/shared/domain/aggregate-root';
import { NotificationItem } from './notification-item';
import { NotificationSeverity } from './value-objects/notification-severity';
import { NotificationAcknowledgedEvent } from './events/notification-acknowledged.event';
import { SerializedEventPayload } from 'src/shared/domain/interfaces/serializable-event';
import { NotificationCreatedEvent } from './events/notification-created.event';

export class Notification extends VersionedAggregateRoot {
  public name: string;
  public severity: NotificationSeverity;
  public triggeredAt: Date;
  public isAcknowledged = false;
  public items = new Array<NotificationItem>();

  constructor(public id: string) {
    super();
  }

  acknowledge() {
    this.apply(new NotificationAcknowledgedEvent(this.id));
  }

  addNotificationItem(item: NotificationItem) {
    this.items.push(item);
  }

  [`on${NotificationCreatedEvent.name}`](
    event: SerializedEventPayload<NotificationCreatedEvent>,
  ) {
    this.name = event.notification.name;
    this.severity = new NotificationSeverity(event.notification.severity);
    this.triggeredAt = new Date(event.notification.triggeredAt);
    this.isAcknowledged = event.notification.isAcknowledged;
    this.items = event.notification.items.map(
      (item) => new NotificationItem(item.id, item.name, item.type),
    );
  }

  [`on${NotificationAcknowledgedEvent.name}`](
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: SerializedEventPayload<NotificationAcknowledgedEvent>,
  ) {
    if (this.isAcknowledged) {
      throw new Error('Notification has already been acknowledged');
    }
    this.isAcknowledged = true;
  }
}
