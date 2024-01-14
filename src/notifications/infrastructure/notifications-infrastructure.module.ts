import { Module } from '@nestjs/common';
import { InMemoryNotificationPersistenceModule } from './persistence/in-memory/in-memory-persistance.module';
import { OrmNotificationPersistenceModule } from './persistence/orm/orm-persistence.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  exports: [SharedModule],
})
export class NotificationsInfrastructureModule {
  static use(driver: 'orm' | 'in-memory') {
    const persistenceModule =
      driver === 'orm'
        ? OrmNotificationPersistenceModule
        : InMemoryNotificationPersistenceModule;

    return {
      module: NotificationsInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
