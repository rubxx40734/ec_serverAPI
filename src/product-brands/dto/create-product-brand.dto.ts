// src/brands/dto/create-brand.dto.ts
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProductBrandDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean; // status 是可選的，如果沒給，我們會依賴資料庫的預設值 (true)

  @IsOptional()
  @IsUrl()
  image?: string; // image 也是可選的
}
