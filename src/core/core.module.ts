import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';

import { ApplicationBootstrapOptions } from '../common/interfaces/application-bootstrap-options.inteface';
import { MongooseModule } from '@nestjs/mongoose';
import { EVENT_STORE_CONNECTION } from './core.constants';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27018/event-mongo', {
      connectionName: EVENT_STORE_CONNECTION,
      directConnection: true,
    }),
  ],
})
export class CoreModule {
  static forRoot(options: ApplicationBootstrapOptions) {
    const imports =
      options.driver === 'orm'
        ? [
            ConfigModule.forRoot({
              isGlobal: true,
            }),
            TypeOrmModule.forRootAsync({
              inject: [ConfigService],
              useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('DATABASE_HOST'),
                port: config.get('DATABASE_PORT'),
                username: config.get('DATABASE_USER'),
                password: config.get('DATABASE_PASSWORD'),
                database: config.get('DATABASE_NAME'),
                autoLoadEntities: true,
                synchronize: true, // Be cautious with this in production
              }),
            }),
            MongooseModule.forRoot('mongodb://localhost:27017/read-mongo'),
          ]
        : [];

    return {
      module: CoreModule,
      imports,
    };
  }
}
