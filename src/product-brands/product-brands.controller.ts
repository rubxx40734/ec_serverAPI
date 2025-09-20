import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductBrandsService } from './product-brands.service';
import { CreateProductBrandDto } from './dto/create-product-brand.dto';
import { UpdateProductBrandDto } from './dto/update-product-brand.dto';

@Controller('brands')
@UseInterceptors(ClassSerializerInterceptor) // 啟用我們之前設定的 id -> uid 轉換
export class ProductBrandsController {
  constructor(private readonly service: ProductBrandsService) {}

  @Post()
  create(@Body() createBrandDto: CreateProductBrandDto) {
    console.log('新增', createBrandDto);
    return this.service.create(createBrandDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateProductBrandDto,
  ) {
    return this.service.update(id, updateBrandDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 刪除成功回傳 204 No Content
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
