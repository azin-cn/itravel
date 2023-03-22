import { JwtModuleOptions } from '@nestjs/jwt';
import { getOrdefault } from './utils';
import strran from 'string-random';
const secret = strran(32);

export const getJWTConf = (): JwtModuleOptions => ({
  secret: getOrdefault('SECRET', secret),
  secretOrKeyProvider: () => getOrdefault('SECRET', secret),
  signOptions: {
    expiresIn: getOrdefault('JWT_EXPIRED_TIME', '1d'),
  },
});

export default getJWTConf();
