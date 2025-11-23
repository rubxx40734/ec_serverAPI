import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// 設定專用
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
// 各類模組
import { ProductBrandsModule } from '../product-brands/product-brands.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? undefined : '.env.development',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    // ... (imports)

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // 👇 關鍵修改：在這裡加上 : TypeOrmModuleOptions
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        const baseConfig = {
          // 👇 關鍵修改：加上 'as const' 讓 TypeScript 更確定型別
          type: 'mysql' as const,
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: !isProduction,
        };

        if (isProduction) {
          // --- 生產環境 (Cloud Run) ---
          return {
            ...baseConfig,
            socketPath: `/cloudsql/${configService.get<string>('DB_CONNECTION_NAME')}`,
            extra: {
              ssl: false,
            },
          };
        } else {
          // --- 開發環境 (本地 Docker) ---
          return {
            ...baseConfig,
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            ssl: false,
          };
        }
      },
    }),

    // ... (您其他的 Module)
    ProductBrandsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
