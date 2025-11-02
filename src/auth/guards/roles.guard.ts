import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException, // 1. 引入 ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 步驟 1 & 2: 取得 API 需要的角色 (這部分不變)
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    // 步驟 3: 取得使用者資訊 (這部分不變)
    const { user } = context.switchToHttp().getRequest();

    // 步驟 4: 安全檢查 (如果 user 不存在，也拋出錯誤)
    if (!user || !user.role) {
      throw new ForbiddenException('無法驗證使用者角色');
    }

    // 步驟 5: 核心邏輯修改
    const hasRequiredRole = requiredRoles.some((role) => user.role === role);

    if (hasRequiredRole) {
      return true; // <-- 驗證通過，放行
    }

    // 6. 驗證失敗！拋出我們自訂的錯誤，而不是 return false
    throw new ForbiddenException(
      `您的權限不足 (此操作需要 ${requiredRoles.join(' 或 ')} 角色)`,
    );
  }
}
