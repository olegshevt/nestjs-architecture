import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationRepository } from '../../../../application/ports/create-notification.repository';
import { Notification } from '../../../../domain/notification';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationMapper } from '../mappers/notification.mapper';

@Injectable()
export class OrmCreateNotificationRepository
  implements CreateNotificationRepository
{
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async save(notification: Notification): Promise<Notification> {
    const persistenceModel = NotificationMapper.toPersistence(notification);
    const newEntity = await this.notificationRepository.save(persistenceModel);
    return NotificationMapper.toDomain(newEntity);
  }
}
