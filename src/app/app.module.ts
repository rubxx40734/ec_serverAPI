import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// 設定專用
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')),
        username: configService.get<string>('MYSQL_USER'), // 注意：直接讀取 MYSQL_USER
        password: configService.get<string>('MYSQL_PASSWORD'), // 注意：直接讀取 MYSQL_PASSWORD
        database: configService.get<string>('MYSQL_DATABASE'), // 注意：直接讀取 MYSQL_DATABASE
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('MODE') !== 'prod',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
