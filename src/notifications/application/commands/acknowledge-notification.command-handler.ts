import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AggregateRehydrator } from '../../../shared/application/aggregate-rehydrator';
import { AcknowledgeNotificationCommand } from './acknowledge-notification.command';
import { Notification } from '../../domain/notification';

@CommandHandler(AcknowledgeNotificationCommand)
export class AcknowledgeNotificationCommandHandler
  implements ICommandHandler<AcknowledgeNotificationCommand>
{
  private readonly logger = new Logger(
    AcknowledgeNotificationCommandHandler.name,
  );

  constructor(private readonly aggregareRehydrator: AggregateRehydrator) {}

  async execute(command: AcknowledgeNotificationCommand) {
    this.logger.debug(
      `Processing "AcknowledgeNotificationCommand": ${JSON.stringify(command)}`,
    );

    const notification = await this.aggregareRehydrator.rehydrate(
      command.notificationId,
      Notification,
    );
    notification.acknowledge();
    notification.commit();
    return notification;
  }
}
