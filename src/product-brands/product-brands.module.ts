import { Module } from '@nestjs/common';
import { ProductBrandsService } from './product-brands.service';
import { ProductBrandsController } from './product-brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. 引入 TypeOrmModule
import { Brand } from './entities/product-brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])], // 2. 註冊 Brand 實體
  controllers: [ProductBrandsController],
  providers: [ProductBrandsService],
})
export class ProductBrandsModule {}
