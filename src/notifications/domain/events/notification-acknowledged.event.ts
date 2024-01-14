import { AutowiredEvent } from '../../../shared/decorators/autowired-event.decorator';

@AutowiredEvent
export class NotificationAcknowledgedEvent {
  constructor(public readonly notificationId: string) {}
}
