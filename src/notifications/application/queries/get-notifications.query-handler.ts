import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetNotificationsQuery } from './get-notifications.query';
import { NotificationReadModel } from 'src/notifications/domain/read-models/notification.read-model';
import { FindNotificationsRepository } from '../ports/find-notifications.repository';

@QueryHandler(GetNotificationsQuery)
export class GetNotificationsQueryHandler
  implements IQueryHandler<GetNotificationsQuery, NotificationReadModel[]>
{
  constructor(
    private readonly notificationRepository: FindNotificationsRepository,
  ) {}

  async execute(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    query: GetNotificationsQuery,
  ): Promise<NotificationReadModel[]> {
    return this.notificationRepository.findAll();
  }
}
