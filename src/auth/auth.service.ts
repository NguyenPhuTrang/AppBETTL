import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../modules/user/user.repository';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async login(loginUserDto: LoginUserDto): Promise<any> {
        const user = await this.userRepository.findOneByCondition({
            email: loginUserDto.email,
        });
        if (!user) {
            throw new HttpException('user not find', HttpStatus.UNAUTHORIZED);
        }
        if (
            !(await this.userRepository.comparePassword(
                user,
                loginUserDto.password,
            ))
        ) {
            throw new HttpException('pass wrong', HttpStatus.UNAUTHORIZED);
        }
        const payload = { id: user.id, email: user.email };
        return this.generateToken(payload);
    }

    private async generateToken(payload: { id: string; email: string }) {
        const access_token = await this.jwtService.signAsync(payload);
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
        });
        await this.userRepository.updateRefreshToken(
            payload.email,
            refresh_token,
        );

        return { access_token, refresh_token };
    }
    async refreshToken(refresh_token: string): Promise<any> {
        try {
            const verify = await this.jwtService.verifyAsync(refresh_token, {
                secret: this.configService.get<string>('SECRET')
            })
            const checkExistToken = await this.userRepository.findOneBy({ email: verify.email, refresh_token })
            if (checkExistToken) {
                return this.generateToken({ id: verify.id, email: verify.email })
            } else {
                throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST)
        }
    }
}
