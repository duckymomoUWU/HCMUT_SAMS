import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy roles required từ decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu không có @Roles decorator → Cho phép truy cập
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Lấy user từ request (đã được gắn bởi JWT Guard)
    const { user } = context.switchToHttp().getRequest();

    // Nếu không có user → Từ chối
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Kiểm tra user có role phù hợp không
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}. Your role: ${user.role}`,
      );
    }

    return true;
  }
}
