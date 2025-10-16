import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // 1. 設定從哪裡提取 Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. 是否忽略過期的 Token (設定為 false，表示過期的 Token 會被拒絕)
      ignoreExpiration: false,
      // 3. 用來驗證 Token 簽章的密鑰
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * 4. 驗證通過後，執行的函式
   * @param payload 從 Token 中解析出來的負載 (我們在 login 時放進去的物件)
   * @returns 回傳的物件會被 NestJS 附加到 Request 物件的 user 屬性上 (req.user)
   */
  async validate(payload: { sub: string; email: string; role: string }) {
    try {
      const user = await this.usersService.findOneById(payload.sub);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Token 無效或使用者已不存在');
    }
  }
}
