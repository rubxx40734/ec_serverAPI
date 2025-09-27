// src/brands/dto/create-brand.dto.ts
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductBrandDto {
  @ApiProperty({ example: 'Apple', description: '品牌名稱' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'apple', description: '友善連結 slug' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: true, description: '品牌狀態' })
  @IsOptional()
  @IsBoolean()
  status?: boolean; // status 是可選的，如果沒給，我們會依賴資料庫的預設值 (true)

  @ApiProperty({
    example: 'https://example.com/brand-logo.png',
    description: '品牌圖片 URL',
  })
  @IsOptional()
  @IsUrl()
  image?: string; // image 也是可選的
}
