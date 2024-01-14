import { AutowiredEvent } from 'src/shared/decorators/autowired-event.decorator';
import { Notification } from '../notification';

@AutowiredEvent
export class NotificationCreatedEvent {
  constructor(public readonly notification: Notification) {}
}
