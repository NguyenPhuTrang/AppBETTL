import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: '123456',
        signOptions: { expiresIn: configService.get<string>('EXP_IN_ACCESS_TOKEN') }
      }),
      inject: [ConfigService]
    }),
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
