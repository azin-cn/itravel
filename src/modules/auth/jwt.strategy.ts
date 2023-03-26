import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { getJWTConf } from 'src/config/auth.config';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './dto/auth.dto';
import { plainToClass } from 'class-transformer';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(AuthService)
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJWTConf().secret,
    } as StrategyOptions);
  }

  /**
   * 如果 super 中调用了 passReqToCallback: true，那么此时的参数就变为 req:Req, payload
   * 参数是PassportStrategy从Headers/Query/Body中获取的
   * 注意此时的 args 是未经转化的对象，不是 class
   * @param user
   */
  async validate(payload: JwtPayload) {
    payload = plainToClass(JwtPayload, payload);
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException('token不存在或已过期');
    }
    return user;
  }
}
