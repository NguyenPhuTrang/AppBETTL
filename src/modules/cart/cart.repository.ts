import { BaseRepository } from '../../common/base/base.repository';
import { Cart, CartDocument } from '../../database/schemas/cart.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartAttributesForList } from './cart.constant';
import { parseMongoProjection } from '../../common/helpers/commonFunctions';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_LIMIT_FOR_PAGINATION,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIRECTION,
    OrderDirection,
    softDeleteCondition,
} from '../../common/constants';
import { GetCartListQuery } from './cart.interface';

@Injectable()
export class CartRepository extends BaseRepository<Cart> {
    constructor(
        @InjectModel(Cart.name)
        private readonly cartModel: Model<CartDocument>,
    ) {
        super(cartModel);
    }

    async findOneByCondition(
        condition: Record<string, any>,
    ): Promise<Cart | null> {
        try {
            const cart = await this.cartModel.findOne(condition);
            return cart || null;
        } catch (error) {
            this.logger.error(
                'Error in CartRepository findOneByCondition: ' + error,
            );
            throw error;
        }
    }

    async findCartByUserId(userId: string): Promise<Cart | null> {
        try {
            const cart = await this.cartModel.findOne({
                userId,
                ...softDeleteCondition,
            });
            return cart || null;
        } catch (error) {
            this.logger.error(
                'Error in CartRepository findCartByUserId: ' + error,
            );
            throw error;
        }
    }

    async findAllAndCountCartByQuery(query: GetCartListQuery) {
        try {
            const {
                page = +DEFAULT_FIRST_PAGE,
                limit = +DEFAULT_LIMIT_FOR_PAGINATION,
                orderBy = DEFAULT_ORDER_BY,
                orderDirection = DEFAULT_ORDER_DIRECTION,
                userId = '',
            } = query;

            const matchQuery: any = {};
            matchQuery.$and = [{ ...softDeleteCondition }];

            if (userId) {
                matchQuery.$and.push({ userId });
            }

            const [result] = await this.cartModel.aggregate([
                {
                    $addFields: {
                        id: { $toString: '$_id' },
                    },
                },
                {
                    $match: { ...matchQuery },
                },
                {
                    $project: parseMongoProjection(CartAttributesForList),
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
                                },
                            },
                            { $skip: (page - 1) * limit },
                            { $limit: Number(limit) },
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
                'Error in CartRepository findAllAndCountCartByQuery: ' + error,
            );
            throw error;
        }
    }
}
