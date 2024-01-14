import { Injectable, Logger } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable, bufferTime, filter, groupBy, map, mergeMap } from 'rxjs';
import { NotificationCreatedEvent } from '../../domain/events/notification-created.event';
import { NotifyFacilitySupervisorCommand } from '../commands/notify-facility-supervisor.command';

@Injectable()
export class CascadingNotificationsSaga {
  private readonly logger = new Logger(CascadingNotificationsSaga.name);

  @Saga()
  start = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(NotificationCreatedEvent),
      // Instead of grouping events by notification name, we could group them by facility ID
      groupBy((event) => event.notification.name),
      mergeMap((groupedEvents$) =>
        // Buffer events for 5 seconds or until 3 events are received
        groupedEvents$.pipe(bufferTime(5000, undefined, 3)),
      ),
      filter((events) => events.length >= 3),
      map((events) => {
        this.logger.debug('⚠️⚠️⚠️ 3 notifications in 5 seconds!');
        const facilityId = '12345'; // Replace with facility ID

        return new NotifyFacilitySupervisorCommand(
          facilityId,
          events.map((event) => event.notification.id),
        );
      }),
    );
  };
}
