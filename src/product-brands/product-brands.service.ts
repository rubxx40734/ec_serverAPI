import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductBrandDto } from './dto/create-product-brand.dto';
import { UpdateProductBrandDto } from './dto/update-product-brand.dto';
import { Brand } from './entities/product-brand.entity';

@Injectable()
export class ProductBrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  // 新增品牌
  async create(createProductBrandDto: CreateProductBrandDto): Promise<Brand> {
    console.log('Brand,', Brand);
    const newBrand = this.brandRepository.create(createProductBrandDto);
    return this.brandRepository.save(newBrand);
  }
  // 查詢所有品牌
  findAll(): Promise<Brand[]> {
    return this.brandRepository.find();
  }
  // 查詢單一品牌 by id
  async findOneById(id: string): Promise<Brand> {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand) {
      throw new NotFoundException(`${id} 查無資料`, {
        description: '找不到該品牌，請確認 id 是否正確',
      });
    }
    return brand;
  }
  // 更新品牌
  async update(
    id: string,
    updateProductBrandDto: UpdateProductBrandDto,
  ): Promise<Brand> {
    const brand = await this.findOneById(id);
    Object.assign(brand, updateProductBrandDto);
    return this.brandRepository.save(brand);
  }
  // 刪除品牌
  async remove(id: string): Promise<void> {
    const brand = await this.findOneById(id);
    await this.brandRepository.remove(brand);
  }
}
