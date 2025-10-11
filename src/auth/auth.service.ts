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

  /**
   * 驗證使用者密碼是否正確
   * @param email 使用者信箱
   * @param pass 使用者傳來的明文密碼
   * @returns 成功時回傳移除了密碼的使用者物件，失敗時回傳 null
   */
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

  /**
   * 根據驗證成功的使用者資訊，簽發 JWT
   * @param user 已經過驗證的使用者物件
   * @returns 包含 access_token 的物件
   */
  async login(user: Omit<User, 'password'>) {
    // 建立 JWT 的 payload (負載)，這是要放進 token 裡的資訊
    const payload = {
      sub: user.id, // 'sub' 是 JWT 的標準欄位，代表主題 (Subject)，通常是使用者 ID
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
