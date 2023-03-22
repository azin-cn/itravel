import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getJWTConf } from 'src/config/auth.config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, JwtModule.register(getJWTConf())],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
