// src/auth/guards/jwt-auth.guard.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info: Error) {
    if (err || !user) {
      if (info instanceof TokenExpiredError) {
        //  捕獲 Token 過期錯誤
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Access Token has expired.',
          code: 'TOKEN_EXPIRED', // <-- 關鍵：告訴前端要續期
        });
      }

      if (info instanceof JsonWebTokenError) {
        // 捕獲 Token 格式錯誤或簽章無效
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Invalid Token.',
          code: 'TOKEN_INVALID', // <-- 關鍵：告訴前端這是無效 Token，無需續期
        });
      }

      // 處理其他未授權錯誤 (例如：使用者不存在)
      throw err || new UnauthorizedException('Authentication Failed');
    }
    return user;
  }
}
