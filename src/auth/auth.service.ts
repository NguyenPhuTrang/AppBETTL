import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../modules/user/user.repository';
import { LoginUserDto, RefreshToken, RegisterUserDto } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../database/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private configService: ConfigService,
    ) { }

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
        return this.generateTokenLogin(payload);
    }

    private async generateTokenLogin(payload: { id: string; email: string }): Promise<any> {
        const accessToken = await this.jwtService.signAsync(payload);
        const expInRefreshToken = this.configService.get<string>('EXP_IN_REFRESH_TOKEN');
        const expInAccessToken = this.configService.get<string>('EXP_IN_ACCESS_TOKEN');

        const expiresInRefresh = this.convertTimeToSeconds(expInRefreshToken);
        const expiresIn = this.convertTimeToSeconds(expInAccessToken);

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: expiresInRefresh,
        });
        await this.userRepository.updateRefreshToken(payload.email, refreshToken);

        return {
            code: HttpStatus.OK,
            message: 'Login successful',
            data: { accessToken, expiresIn, refreshToken },
            version: '1.0.0'
        };
    }

    private convertTimeToSeconds(expTime: string): number {
        const numericValue = parseInt(expTime);
        const unit = expTime.slice(-1);

        let seconds = 0;
        switch (unit) {
            case 's':
                seconds = numericValue;
                break;
            case 'm':
                seconds = numericValue * 60;
                break;
            case 'h':
                seconds = numericValue * 60 * 60;
                break;
            case 'd':
                seconds = numericValue * 24 * 60 * 60;
                break;
            default:
                throw new Error('Invalid time unit');
        }

        return seconds;
    }

    private async generateTokenRefresh(payload: { id: string; email: string }): Promise<any> {
        const accessToken = await this.jwtService.signAsync(payload);
        const expInAccessToken = this.configService.get<string>('EXP_IN_ACCESS_TOKEN');
        const expiresIn = this.convertTimeToSeconds(expInAccessToken);
        return {
            code: HttpStatus.OK,
            message: 'Login successful',
            data: { accessToken, expiresIn },
            version: '1.0.0'
        };
    }

    async refreshToken(refresh_token: RefreshToken): Promise<any> {
        try {
            const verify = await this.jwtService.verifyAsync(refresh_token.refreshToken, {
                secret: this.configService.get<string>('SECRET')
            })
            const checkExistToken = await this.userRepository.findOneBy({ email: verify.email });
            if (checkExistToken) {
                return this.generateTokenRefresh({ id: verify.id, email: verify.email });
            } else {
                throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new HttpException('Refresh token has expired', HttpStatus.UNAUTHORIZED);
            } else if (error.name === 'JsonWebTokenError') {
                throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
            } else {
                throw new HttpException('Error verifying refresh token', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async register(dto: RegisterUserDto) {
        try {
            const user: SchemaCreateDocument<User> = {
                ...(dto as any),
            };
            return await this.userRepository.createOne(user);
        } catch (error) {
            throw new HttpException('Error in UserService createUser: ', error);
            throw error;
        }
    }
}
