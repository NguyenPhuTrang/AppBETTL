import { BaseService } from '../../../common/base/base.service';
import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
    CreateUserDto,
    GetUserListQuery,
    UpdateUserDto,
} from '../user.interface';

import { User } from '../../../database/schemas/user.schema';
import { UserRepository } from '../user.repository';
import { UserAttributesForDetail } from '../user.constant';
import { HttpStatus } from '../../../common/constants';

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
    constructor(private readonly userRepository: UserRepository) {
        super(userRepository);
    }

    async createUser(dto: CreateUserDto) {
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
            const user: SchemaCreateDocument<User> = {
                ...(dto as any),
            };
            return await this.userRepository.createOne(user);
        } catch (error) {
            this.logger.error('Error in UserService createUser: ' + error);
            throw error;
        }
    }

    async updateUser(id: Types.ObjectId, dto: UpdateUserDto) {
        try {
            await this.userRepository.updateOneById(id, dto);
            return await this.findUserById(id);
        } catch (error) {
            this.logger.error('Error in UserService updateUser: ' + error);
            throw error;
        }
    }

    async deleteUser(id: Types.ObjectId) {
        try {
            await this.userRepository.softDeleteOne({ _id: id });
            return { id };
        } catch (error) {
            this.logger.error('Error in UserService deleteUser: ' + error);
            throw error;
        }
    }

    async findUserById(
        id: Types.ObjectId,
        attributes: (keyof User)[] = UserAttributesForDetail,
    ) {
        try {
            return await this.userRepository.getOneById(id, attributes);
        } catch (error) {
            this.logger.error('Error in UserService findUserById: ' + error);
            throw error;
        }
    }

    async findAllAndCountUserByQuery(query: GetUserListQuery) {
        try {
            const result =
                await this.userRepository.findAllAndCountUserByQuery(query);
            return result;
        } catch (error) {
            this.logger.error(
                'Error in UserService findAllAndCountUserByQuery: ' + error,
            );
            throw error;
        }
    }

    async findOrCreateGoogleUser(profile: {
        email: string;
        name: string;
        avatarUrl: string;
        googleId: string;
    }) {
        try {
            // Tìm theo googleId trước
            let existing = await this.userRepository.findOneBy({
                googleId: profile.googleId,
                deletedAt: null,
            });

            // Nếu không có thì tìm theo email
            if (!existing) {
                existing = await this.userRepository.findOneBy({
                    email: profile.email,
                    deletedAt: null,
                });
            }

            if (existing) {
                // Nếu user đã có email/password nhưng chưa có googleId → link lại
                if (!existing.googleId) {
                    await this.userRepository.updateOneById(existing._id, {
                        googleId: profile.googleId,
                    });
                }
                return existing;
            }

            // Tạo mới nếu chưa có
            const newUser: SchemaCreateDocument<User> = {
                email: profile.email,
                name: profile.name,
                avatarUrl:
                    profile.avatarUrl ||
                    'https://default-avatar.com/default.png',
                googleId: profile.googleId,
                role: 'user', // ⚠️ đổi thành role mặc định của project bạn
            } as any;

            return await this.userRepository.createOne(newUser);
        } catch (error) {
            this.logger.error(
                'Error in UserService findOrCreateGoogleUser: ' + error,
            );
            throw error;
        }
    }
}
