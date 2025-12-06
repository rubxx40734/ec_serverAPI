// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express'; // 確保 Request 是從 'express' 引入
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 登入端點：簽發 Access Token (Body) 和 Refresh Token (HttpOnly Cookie)
   * POST /auth/login
   */
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    const { accessToken, refreshToken } = await this.authService.login(user);

    // 1. 設定長效期 Refresh Token 在 HttpOnly Cookie 中 (記住我)
    res.cookie('refresh_token', refreshToken, {
      // <-- 關鍵：HttpOnly
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
    });

    // 2. 回傳短效期 Access Token 和使用者資訊
    const { ...userData } = user;
    return {
      status: true,
      message: '登入成功',
      accessToken: accessToken, // <-- 讓前端儲存到 localStorage
      data: userData,
    };
  }

  /**
   * 續期端點：使用 HttpOnly Cookie 中的 Refresh Token 換取新的 Access Token
   * POST /auth/refresh-token
   */
  @Post('refresh-token')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 1. 從 Request 中讀取 Cookie
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('缺少 Refresh Token');
    }

    try {
      // 2. 使用 AuthService 換取新的 Access Token
      const newAccessToken = await this.authService.refresh(refreshToken);

      // 3. 成功換取，回傳新的 Access Token 給前端
      return {
        status: true,
        message: 'Token 續期成功',
        accessToken: newAccessToken,
      };
    } catch (e) {
      // 4. 如果 Refresh Token 過期/無效，刪除 Cookie 並拋出錯誤
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      throw new UnauthorizedException('無法續期，請重新登入');
    }
  }
}
