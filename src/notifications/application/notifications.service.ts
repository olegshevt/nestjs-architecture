import { Injectable } from '@nestjs/common';
import { CreateNotificationCommand } from './commands/create-notification.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetNotificationsQuery } from './queries/get-notifications.query';
import { AcknowledgeNotificationCommand } from './commands/acknowledge-notification.command';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  create(CreateNotificationCommand: CreateNotificationCommand) {
    return this.commandBus.execute(CreateNotificationCommand);
  }

  findAll() {
    return this.queryBus.execute(new GetNotificationsQuery());
  }

  acknowledge(id: string) {
    // 👈
    return this.commandBus.execute(new AcknowledgeNotificationCommand(id));
  }
}
