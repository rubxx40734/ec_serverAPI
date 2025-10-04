import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '使用者名稱', example: 'Bill' })
  @IsString({ message: '名稱必須是字串' })
  @IsNotEmpty({ message: '名稱不能為空' })
  name: string;

  @ApiProperty({ description: '使用者信箱', example: 'bill@example.com' })
  @IsEmail({}, { message: '請提供有效的信箱格式' })
  email: string;

  @ApiProperty({
    description: '使用者密碼 (至少8個字元)',
    example: 'password123',
  })
  @IsString()
  @MinLength(8, { message: '密碼長度不能少於8個字元' })
  password: string;
}
