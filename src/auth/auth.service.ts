// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // 注入 UsersService
    private jwtService: JwtService, // 注入 JwtService
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('帳號或密碼錯誤');
    }

    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (user && isPasswordMatching) {
      const { password, ...result } = user;
      console.log('驗證成功的使用者', password, result);
      return result;
    }

    throw new UnauthorizedException('帳號或密碼錯誤');
  }

  async login(
    user: Omit<User, 'password'>,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const ACCESS_TOKEN_EXPIRATION = '1h';
    const REFRESH_TOKEN_EXPIRATION = '7d';
    // 建立 JWT 的 payload (負載)，這是要放進 token 裡的資訊
    const payload = {
      sub: user.id, // 'sub' 是 JWT 的標準欄位，代表主題 (Subject)，通常是使用者 ID
      email: user.email,
      role: user.role,
    };

    // 簽發短壽命的 Access Token
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });

    // 簽發長壽命的 Refresh Token
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });

    return { accessToken, refreshToken };
  }

  async refresh(token: string): Promise<string> {
    const ACCESS_TOKEN_EXPIRATION = '1h';
    try {
      // 1. 驗證 Refresh Token 的有效性 (簽章、過期時間)
      const payload = this.jwtService.verify(token);

      // 2. 確保 Refresh Token 中包含我們需要的資訊
      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Refresh Token 無效');
      }

      // 3. 檢查使用者是否存在（可選：增加安全性，如果使用者被禁用或刪除，Token 應失效）
      const user = await this.usersService.findOneById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('使用者不存在');
      }

      // 4. 使用舊的 payload 簽發新的 Access Token
      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email, role: payload.role },
        { expiresIn: ACCESS_TOKEN_EXPIRATION },
      );

      return newAccessToken;
    } catch (e) {
      // 如果 Token 過期 (TokenExpiredError) 或簽章無效 (JsonWebTokenError)，則拋出未授權異常
      throw new UnauthorizedException('Refresh Token 過期或無效');
    }
  }
}
