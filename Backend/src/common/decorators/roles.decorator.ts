import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator để chỉ định roles được phép truy cập endpoint
 * @example @Roles('admin', 'student')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
