// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication') // 在 Swagger 中為這個 Controller 分類
@Controller('auth') // 設定這個 Controller 的基礎路徑為 /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login') // 設定 API 端點為 POST /auth/login
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    // 2. 如果驗證成功，呼叫 AuthService 的 login 方法，簽發 JWT
    return this.authService.login(user);
  }
}
