import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MaterializedNotificationView } from '../schemas/materialized-notification-view.schema';
import { UpsertMaterializedNotificationRepository } from '../../../../application/ports/upsert-materalized-notification.repository';
import { NotificationReadModel } from 'src/notifications/domain/read-models/notification.read-model';

@Injectable()
export class OrmUpsertMaterializedNotificationRepository
  implements UpsertMaterializedNotificationRepository
{
  constructor(
    @InjectModel(MaterializedNotificationView.name)
    private readonly notificationModel: Model<MaterializedNotificationView>,
  ) {}

  async upsert(
    notification: Pick<NotificationReadModel, 'id'> &
      Partial<NotificationReadModel>,
  ): Promise<void> {
    await this.notificationModel.findOneAndUpdate(
      { id: notification.id },
      notification,
      {
        upsert: true,
      },
    );
  }
}
