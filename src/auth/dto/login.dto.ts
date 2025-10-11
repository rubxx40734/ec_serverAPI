import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '使用者信箱', example: 'test@example.com' })
  @IsEmail({}, { message: '請提供有效的信箱格式' })
  email: string;

  @ApiProperty({ description: '使用者密碼', example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: '密碼不能為空' })
  password: string;
}
