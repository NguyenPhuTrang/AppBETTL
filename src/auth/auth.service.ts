import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../modules/user/user.repository';
import { LoginUserDto, RegisterUserDto } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../database/schemas/user.schema';
import { SuccessResponse } from '../common/helpers/response';
import { Request } from 'express';
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
        return this.generateToken(payload);
    }

    async refreshToken(request: Request): Promise<any> {
        try {
            const refresh_token = this.extractTokenFromHeader(request);
            const verify = await this.jwtService.verifyAsync(refresh_token, {
                secret: this.configService.get<string>('SECRET')
            })
            const checkExistToken = await this.userRepository.findOneBy({ email: verify.email });
            if (checkExistToken) {
                return this.generateToken({ id: verify.id, email: verify.email });
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

    private async generateToken(payload: { id: string; email: string }): Promise<any> {
        const accessToken = await this.jwtService.signAsync(payload);
        const expInRefreshToken = this.configService.get<string>('EXP_IN_REFRESH_TOKEN');
        const expInAccessToken = this.configService.get<string>('EXP_IN_ACCESS_TOKEN');

        const expiresInRefresh = this.convertTimeToSeconds(expInRefreshToken);
        const expiresIn = this.convertTimeToSeconds(expInAccessToken);

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: '1h',
        });
        await this.userRepository.updateRefreshToken(payload.email, refreshToken);
        return new SuccessResponse({ accessToken, expiresIn, refreshToken });
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

    async register(dto: RegisterUserDto) {
        try {
            const user: SchemaCreateDocument<User> = {
                ...(dto as any),
            };
            return await this.userRepository.createOne(user);
        } catch (error) {
            throw new HttpException('Error in UserService createUser: ', error);
        }
    }

    async getUser(request: Request): Promise<any> {
        try {
            const accessToken = this.extractTokenFromHeader(request);
            const verify = await this.jwtService.verifyAsync(accessToken, {
                secret: this.configService.get<string>('SECRET')
            })
            const user = await this.userRepository.findOneByCondition({
                email: verify.email,
            });
            
            if (user) {
                const selectedUserData = {
                    name: user.name,
                    email: user.email,
                    birthday: user.birthday,
                    numberPhone: user.numberPhone,
                    avatarUrl: user.avatarUrl,
                };
    
                return new SuccessResponse({ user: selectedUserData });
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
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization ? request.headers.authorization.split(' ') : [];
        return type === 'Bearer' ? token : undefined;
    }
}
