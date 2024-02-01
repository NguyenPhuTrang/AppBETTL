import { HttpException, Injectable, HttpStatus, Logger } from '@nestjs/common';
import { UserRepository } from '../modules/user/user.repository';
import { LoginUserDto, RegisterUserDto } from './auth.interface';
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
        return this.generateToken(payload);
    }

    private async generateToken(payload: { id: string; email: string }): Promise<any> {
        const accessToken = await this.jwtService.signAsync(payload);
        const expInRefreshToken = this.configService.get<string>('EXP_IN_REFRESH_TOKEN');
        const expiresIn = this.convertTimeToSeconds(expInRefreshToken);
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: expiresIn,
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
