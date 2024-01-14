import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FindNotificationsRepository } from '../../../../application/ports/find-notifications.repository';
import { MaterializedNotificationView } from '../schemas/materialized-notification-view.schema';
import { NotificationReadModel } from '../../../../domain/read-models/notification.read-model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrmFindNotificationsRepository
  implements FindNotificationsRepository
{
  constructor(
    @InjectModel(MaterializedNotificationView.name)
    private readonly notificationModel: Model<MaterializedNotificationView>,
  ) {}

  async findAll(): Promise<NotificationReadModel[]> {
    return await this.notificationModel.find();
  }
}
