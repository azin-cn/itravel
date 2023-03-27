import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * 在当前的请求对象中附加数据
 * This metadata can be reflected using the Reflector class.
 * @param roles
 * @returns
 */
export const Roles = (...roles: number[]) => SetMetadata(ROLES_KEY, roles);
