import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { USER_ROLES } from '../constants/user.constant';
import { Request } from 'express';
import { JwtPayload } from 'src/modules/auth/dto/auth.dto';
import { plainToClass } from 'class-transformer';
import { Assert } from 'src/utils/Assert';
import { ROLES_KEY } from '../constants/role.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    /**
     * reflector 用于从路由中获取元数据
     * 元数据通常是由 Controller 中注入，如使用装饰器注入，在请求中拦截请求对象并注入某些数据
     */
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<[]>(ROLES_KEY, context.getHandler());

    if (!roles) return true;

    /**
     * 在JwtStrategy中默认会将解析后的payload附加到request对象上，属性名可以指定，默认是user
     * 在使用角色管理的地方，必须要有token认证，否则抛出异常
     */
    const { user: payload } = context.switchToHttp().getRequest<Request>();
    Assert.assertNotNil(payload, 'token不存在或已过期');
    const user = plainToClass(JwtPayload, payload);

    /**
     * 判断方式要求传入所必须的角色
     * 可以增加判断条件，如ROOT可以管理任何一个
     */
    return roles.some(
      (role) => role === USER_ROLES.ROOT || role === user.getRole(),
    );
  }
}
