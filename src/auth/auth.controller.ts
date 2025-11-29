// src/auth/auth.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication') // 在 Swagger 中為這個 Controller 分類
@Controller('auth') // 設定這個 Controller 的基礎路徑為 /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login') // 設定 API 端點為 POST /auth/login
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    const accessToken = await this.authService.login(user);

    // 將 JWT 設定在 HttpOnly Cookie 中
    res.cookie('access_token', accessToken, {
      httpOnly: true, // 只能透過 HTTP 協議存取，無法被 JavaScript 存取
      secure: process.env.NODE_ENV === 'production', // 僅在生產環境中使用 HTTPS 時傳送 Cookie
      sameSite: 'strict', // 防止 CSRF 攻擊
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie 有效期為 7 天
    });

    // 4. 回傳 Body 時，只回傳非敏感的使用者資訊 (不需要回傳 Token)
    const { password, ...userData } = user; // 確保 password 被移除
    return {
      status: true,
      message: '登入成功',
      data: userData,
    };
  }
}
