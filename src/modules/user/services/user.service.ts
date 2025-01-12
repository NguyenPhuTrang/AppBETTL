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
                throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
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
}
