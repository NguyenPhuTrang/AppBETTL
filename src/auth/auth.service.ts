import { HttpException, Injectable } from '@nestjs/common';
import { UserRepository } from '../modules/user/user.repository';
import { LoginAdminDto, LoginUserDto, RegisterUserDto } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../database/schemas/user.schema';
import { Request } from 'express';
import { HttpStatus } from '../common/constants';
import { BaseService } from '../common/base/base.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService extends BaseService<any, any> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private configService: ConfigService,
    ) {
        super();
    }

    async loginUser(loginUserDto: LoginUserDto): Promise<any> {
        try {
            const user = await this.userRepository.findOneBy({
                email: loginUserDto.email,
            });

            if (!user) {
                throw new HttpException(
                    'User not found',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            if (user && user.deletedAt !== null) {
                throw new HttpException(
                    'This user has been deleted',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            if (user.role !== 'user') {
                throw new HttpException(
                    'User is not a regular user',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const isPasswordValid = await this.userRepository.comparePassword(
                user,
                loginUserDto.password,
            );

            if (!isPasswordValid) {
                throw new HttpException(
                    'Incorrect password',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const payload = { id: user.id, email: user.email };
            return this.generateToken(payload);
        } catch (error) {
            throw error;
        }
    }

    async loginAdmin(loginAdminDto: LoginAdminDto): Promise<any> {
        try {
            const user = await this.userRepository.findOneBy({
                email: loginAdminDto.email,
            });

            if (!user) {
                throw new HttpException(
                    'User not found',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            if (user && user.deletedAt !== null) {
                throw new HttpException(
                    'This user has been deleted',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            if (user.role !== 'admin') {
                throw new HttpException(
                    'User is not an admin',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            if (
                !(await this.userRepository.comparePassword(
                    user,
                    loginAdminDto.password,
                ))
            ) {
                throw new HttpException(
                    'Incorrect password',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const payload = { id: user.id, email: user.email };
            return this.generateToken(payload);
        } catch (error) {
            throw error;
        }
    }

    async refreshToken(request: Request): Promise<any> {
        try {
            const refresh_token = this.extractTokenFromHeader(request);
            const verify = await this.jwtService.verifyAsync(refresh_token, {
                secret: this.configService.get<string>('SECRET'),
            });
            const checkExistToken = await this.userRepository.findOneBy({
                email: verify.email,
            });
            if (checkExistToken) {
                return this.generateToken({
                    id: verify.id,
                    email: verify.email,
                });
            } else {
                throw new HttpException(
                    'Refresh token is not valid',
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                throw new HttpException(
                    'Refresh token has expired',
                    HttpStatus.UNAUTHORIZED,
                );
            } else if (error.name === 'JsonWebTokenError') {
                throw new HttpException(
                    'Invalid refresh token',
                    HttpStatus.UNAUTHORIZED,
                );
            } else {
                throw new HttpException(
                    'Error verifying refresh token',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    async register(dto: RegisterUserDto): Promise<any> {
        try {
            const existingUser = await this.userRepository.findOneBy({
                email: dto.email,
                deletedAt: null,
            });

            if (existingUser) {
                throw new HttpException(
                    'User already exists',
                    HttpStatus.BAD_REQUEST,
                );
            }
            const hashedPassword = await bcrypt.hash(dto.password, 10);

            const user: SchemaCreateDocument<User> = {
                name: dto.name,
                email: dto.email,
                birthday: dto.birthday,
                numberPhone: dto.numberPhone,
                avatarUrl: dto.avatarUrl,
                role: dto.role,
                refresh_token: '',
                password: hashedPassword,
                googleId: null,
            };

            return await this.userRepository.createOne(user);
        } catch (error) {
            this.logger.error('Error in UserService createUser: ' + error);
            throw error;
        }
    }

    async registerUser(dto: RegisterUserDto): Promise<any> {
        try {
            const existingUser = await this.userRepository.findOneBy({
                email: dto.email,
                deletedAt: null,
            });

            if (existingUser && existingUser.deletedAt === null) {
                throw new HttpException(
                    'User already exists',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const hashedPassword = await bcrypt.hash(dto.password, 10);

            const user: SchemaCreateDocument<User> = {
                name: dto.name,
                email: dto.email,
                birthday: dto.birthday,
                numberPhone: dto.numberPhone,
                avatarUrl: dto.avatarUrl,
                role: dto.role,
                refresh_token: '',
                password: hashedPassword,
                googleId: null,
            };

            return await this.userRepository.createOne(user);
        } catch (error) {
            this.logger.error('Error in UserService createUser: ' + error);
            throw error;
        }
    }

    async getUser(request: Request): Promise<any> {
        try {
            const accessToken = this.extractTokenFromHeader(request);
            const verify = await this.jwtService.verifyAsync(accessToken, {
                secret: this.configService.get<string>('SECRET'),
            });

            const user = await this.userRepository.findOneBy({
                email: verify.email,
            });

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                birthday: user.birthday,
                numberPhone: user.numberPhone,
                avatarUrl: user.avatarUrl,
            };
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error;
            }

            if (error.name === 'TokenExpiredError') {
                throw new HttpException(
                    'Refresh token has expired',
                    HttpStatus.UNAUTHORIZED,
                );
            } else if (error.name === 'JsonWebTokenError') {
                throw new HttpException(
                    'Invalid refresh token',
                    HttpStatus.UNAUTHORIZED,
                );
            } else {
                throw new HttpException(
                    'Error verifying refresh token',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    async googleLogin(accessToken: string): Promise<any> {
        try {
            // 1. Dùng access_token gọi Google API lấy user info
            let payload: any;
            try {
                const response = await fetch(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error('Invalid token');
                }

                payload = await response.json();
            } catch {
                throw new HttpException(
                    'Google token không hợp lệ',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            if (!payload?.email) {
                throw new HttpException(
                    'Không lấy được email từ Google',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            // 2. Tìm theo email
            let user = await this.userRepository.findOneByCondition({
                email: payload.email,
                deletedAt: null,
            });

            if (user) {
                // Link googleId nếu chưa có
                if (!user.googleId) {
                    await this.userRepository.updateOneById(user._id, {
                        googleId: payload.sub,
                    } as any);
                }
            } else {
                // 3. Tạo user mới
                const newUser: SchemaCreateDocument<User> = {
                    email: payload.email,
                    name: payload.name ?? '',
                    avatarUrl: payload.picture ?? '',
                    googleId: payload.sub,
                    role: 'user',
                    refresh_token: '',
                    password: '',
                    birthday: '',
                    numberPhone: '',
                } as any;

                user = await this.userRepository.createOne(newUser);
            }

            // 4. Tạo token
            const tokenPayload = { id: user.id, email: user.email };
            return this.generateToken(tokenPayload);
        } catch (error) {
            this.logger.error('Error in AuthService googleLogin: ' + error);
            throw error;
        }
    }

    private async generateToken(payload: {
        id: string;
        email: string;
    }): Promise<any> {
        const accessToken = await this.jwtService.signAsync(payload);
        const expInRefreshToken = this.configService.get<string>(
            'EXP_IN_REFRESH_TOKEN',
        );
        const expInAccessToken = this.configService.get<string>(
            'EXP_IN_ACCESS_TOKEN',
        );

        const expiresInRefresh = this.convertTimeToSeconds(expInRefreshToken);
        const expiresIn = this.convertTimeToSeconds(expInAccessToken);

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: expiresInRefresh,
        });
        await this.userRepository.updateRefreshToken(
            payload.email,
            refreshToken,
        );
        return { accessToken, expiresIn, refreshToken };
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

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization
            ? request.headers.authorization.split(' ')
            : [];
        return type === 'Bearer' ? token : undefined;
    }
}
