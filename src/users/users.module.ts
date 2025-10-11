import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. 引入 TypeOrmModule
import { User } from './entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User])], // 2. 註冊 User 實體
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
