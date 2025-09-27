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
} from '@nestjs/common';
import { ProductBrandsService } from './product-brands.service';
import { CreateProductBrandDto } from './dto/create-product-brand.dto';
import { UpdateProductBrandDto } from './dto/update-product-brand.dto';
import { ApiresponseDto } from '../common/dto/api-response.dto';
import { Brand } from './entities/product-brand.entity';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('品牌管理')
@Controller('brands')
@UseInterceptors(ClassSerializerInterceptor) // 啟用我們之前設定的 id -> uid 轉換
export class ProductBrandsController {
  constructor(private readonly service: ProductBrandsService) {}

  @Post()
  @ApiOperation({ summary: '建立品牌' })
  @ApiOkResponse({
    description: '品牌建立成功',
    type: ApiresponseDto,
  })
  async create(
    @Body() createBrandDto: CreateProductBrandDto,
  ): Promise<ApiresponseDto<Brand>> {
    const newBrand = await this.service.create(createBrandDto);
    return {
      status: true,
      message: '品牌建立成功',
      data: newBrand,
    };
  }

  @Get()
  @ApiOperation({ summary: '取得所有品牌列表' })
  @ApiOkResponse({
    description: '品牌列表取得成功',
    type: ApiresponseDto,
  })
  async findAll(): Promise<ApiresponseDto<Brand[]>> {
    const brands = await this.service.findAll();
    return {
      status: true,
      message: '品牌列表取得成功',
      data: brands,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '取得單一品牌資料' })
  @ApiOkResponse({
    description: '品牌資料取得成功',
    type: ApiresponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiresponseDto<Brand>> {
    const brand = await this.service.findOneById(id);
    return {
      status: true,
      message: '品牌資料取得成功',
      data: brand,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新品牌資料' })
  @ApiOkResponse({
    description: '品牌資料更新成功',
    type: ApiresponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateProductBrandDto,
  ): Promise<ApiresponseDto<Brand>> {
    const updatedBrand = await this.service.update(id, updateBrandDto);
    return {
      status: true,
      message: '品牌資料更新成功',
      data: updatedBrand,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除品牌' })
  @ApiOkResponse({
    description: '品牌刪除成功',
    type: ApiresponseDto,
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiresponseDto<null>> {
    await this.service.remove(id); // 等待刪除完成
    return {
      status: true,
      message: '品牌刪除成功',
      data: null,
    };
  }
}
