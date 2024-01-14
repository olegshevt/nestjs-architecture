import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateNotificationCommand } from './create-notification.command';
import { Logger } from '@nestjs/common';
import { NotificationFactory } from '../../domain/factories/notification.factory';

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationCommandHandler
  implements ICommandHandler<CreateNotificationCommand>
{
  private readonly logger = new Logger(CreateNotificationCommandHandler.name);

  constructor(
    private readonly notificationFactory: NotificationFactory,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateNotificationCommand) {
    this.logger.debug(
      `Processing "CreateNotificationCommand": ${JSON.stringify(command)}`,
    );
    const notification = this.notificationFactory.create(
      command.name,
      command.severity,
      command.triggeredAt,
      command.items,
    );

    this.eventPublisher.mergeObjectContext(notification);
    notification.commit();
    return notification;
  }
}
