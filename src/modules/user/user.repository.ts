import { BaseRepository } from '../../common/base/base.repository';
import { User, UserDocument } from '../../database/schemas/user.schema';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { GetUserListQuery } from './user.interface';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_LIMIT_FOR_PAGINATION,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIRECTION,
    OrderDirection,
    softDeleteCondition,
} from '../../common/constants';
import { parseMongoProjection } from '../../common/helpers/commonFunctions';
import { UserAttributesForList } from './user.constant';

@Injectable()
export class UserRepository extends BaseRepository<User> {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {
        super(userModel);
    }

    async findOneByCondition(
        condition: Record<string, any>,
    ): Promise<User | null> {
        try {
            const user = await this.userModel.findOne(condition);
            return user || null;
        } catch (error) {
            this.logger.error(
                'Error in UserRepository findOneByCondition: ' + error,
            );
            throw error;
        }
    }

    async findOneBy(condition: Partial<User>): Promise<User | null> {
        try {
            const user = await this.userModel.findOne(condition);
            return user || null;
        } catch (error) {
            this.logger.error('Error in UserRepository findOneBy: ' + error);
            throw error;
        }
    }

    async updateRefreshToken(
        email: string,
        refresh_token: string,
    ): Promise<void> {
        try {
            await this.userModel.updateOne({ email }, { refresh_token });
        } catch (error) {
            this.logger.error(
                'Error in UserRepository updateRefreshToken: ' + error,
            );
            throw error;
        }
    }

    async comparePassword(user, password): Promise<boolean> {
        return password === user.password;
    }

    async findAllAndCountUserByQuery(query: GetUserListQuery) {
        try {
            const {
                keyword = '',
                page = +DEFAULT_FIRST_PAGE,
                limit = +DEFAULT_LIMIT_FOR_PAGINATION,
                orderBy = DEFAULT_ORDER_BY,
                orderDirection = DEFAULT_ORDER_DIRECTION,
                name = '',
                role = 'user'
            } = query;

            const matchQuery: FilterQuery<User> = {};
            matchQuery.$and = [
                {
                    ...softDeleteCondition,
                },
            ];

            if (keyword) {
                matchQuery.$and.push({
                    name: { $regex: `.*${keyword}.*`, $options: 'i' },
                });
            }

            if (name) {
                matchQuery.$and.push({
                    name,
                });
            }

            if(role) {
                matchQuery.$and.push({
                    role,
                });
            }

            const [result] = await this.userModel.aggregate([
                {
                    $addFields: {
                        id: { $toString: '$_id' },
                    },
                },
                {
                    $match: {
                        ...matchQuery,
                    },
                },
                {
                    $project: parseMongoProjection(UserAttributesForList),
                },
                {
                    $facet: {
                        count: [{ $count: 'total' }],
                        data: [
                            {
                                $sort: {
                                    [orderBy]:
                                        orderDirection === OrderDirection.ASC
                                            ? 1
                                            : -1,
                                    ['_id']:
                                        orderDirection === OrderDirection.ASC
                                            ? 1
                                            : -1,
                                },
                            },
                            {
                                $skip: (page - 1) * limit,
                            },
                            {
                                $limit: Number(limit),
                            },
                        ],
                    },
                },
            ]);
            return {
                totalItems: result?.count?.[0]?.total || 0,
                items: result?.data || [],
            };
        } catch (error) {
            this.logger.error(
                'Error in UserRepository findAllAndCountUserByQuery: ' + error,
            );
            throw error;
        }
    }
}
