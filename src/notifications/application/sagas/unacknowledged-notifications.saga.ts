import { Injectable, Logger } from '@nestjs/common';
import { Saga, ICommand, ofType } from '@nestjs/cqrs';
import {
  EMPTY,
  Observable,
  filter,
  first,
  map,
  mergeMap,
  race,
  timer,
} from 'rxjs';
import { NotificationAcknowledgedEvent } from '../../domain/events/notification-acknowledged.event';
import { NotificationCreatedEvent } from '../../domain/events/notification-created.event';
import { NotifyFacilitySupervisorCommand } from '../commands/notify-facility-supervisor.command';

@Injectable()
export class UnacknowledgedNotificationsSaga {
  private readonly logger = new Logger(UnacknowledgedNotificationsSaga.name);

  @Saga()
  start = (events$: Observable<any>): Observable<ICommand> => {
    // A stream of notification acknowledged events
    const notificationAcknowledgedEvents$ = events$.pipe(
      ofType(NotificationAcknowledgedEvent),
    );

    // A stream of notification created events
    const notificationCreatedEvents$ = events$.pipe(
      ofType(NotificationCreatedEvent),
    );

    return notificationCreatedEvents$.pipe(
      // Wait for an notification to be acknowledged or 10 seconds to pass
      mergeMap((notificationCreatedEvent) =>
        race(
          notificationAcknowledgedEvents$.pipe(
            filter(
              (notificationAcknowledgedEvent) =>
                notificationAcknowledgedEvent.notificationId ===
                notificationCreatedEvent.notification.id,
            ),
            first(),
            // If the notification is acknowledged, we don't need to do anything
            // Just return an empty observable that never emits
            mergeMap(() => EMPTY),
          ),
          timer(15000).pipe(map(() => notificationCreatedEvent)),
        ),
      ),
      map((notificationCreatedEvent) => {
        this.logger.debug(
          `⚠️⚠️⚠️ Notification "${notificationCreatedEvent.notification.name}" not acknowledged in 15 seconds!`,
        );

        const facilityId = '12345';
        return new NotifyFacilitySupervisorCommand(facilityId, [
          notificationCreatedEvent.notification.id,
        ]);
      }),
    );
  };
}
