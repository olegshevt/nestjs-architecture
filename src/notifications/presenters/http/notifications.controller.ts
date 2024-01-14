import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { NotificationsService } from '../../application/notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CreateNotificationCommand } from 'src/notifications/application/commands/create-notification.command';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(
      new CreateNotificationCommand(
        createNotificationDto.name,
        createNotificationDto.severity,
        createNotificationDto.triggeredAt,
        createNotificationDto.items,
      ),
    );
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Patch(':id/acknowledge') // 👈
  acknowledge(@Param('id') id: string) {
    return this.notificationsService.acknowledge(id);
  }
}
