import { BaseRepository } from '../../common/base/base.repository';
import { Product, ProductDocument } from '../../database/schemas/product.schema';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_LIMIT_FOR_PAGINATION,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIRECTION,
    OrderDirection,
    softDeleteCondition,
} from '../../common/constants';
import { GetProductListQuery } from './product.interface';
import { ProductAttributesForList } from './product.constant';
import { parseMongoProjection } from '../../common/helpers/commonFunctions';
@Injectable()
export class ProductRepository extends BaseRepository<Product> {
    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>,
    ) {
        super(productModel);
    }

    async findOneByCondition(
        condition: Record<string, any>,
    ): Promise<Product | null> {
        try {
            const result = await this.productModel.findOne(condition);
            return result || null;
        } catch (error) {
            this.logger.error(
                'Error in ProductRepository findOneByCondition:' + error,
            )
            throw error;
        }
    }

    async findAllAndCountProductByQuery(query: GetProductListQuery) {
        try {
            const {
                keyword = '',
                page = +DEFAULT_FIRST_PAGE,
                limit = +DEFAULT_LIMIT_FOR_PAGINATION,
                orderBy = DEFAULT_ORDER_BY,
                orderDirection = DEFAULT_ORDER_DIRECTION,
                name = '',
                rating = '',
                price = ''
            } = query;

            const matchQuery: FilterQuery<Product> = {};
            matchQuery.$and = [
                {
                    ...softDeleteCondition,
                },
            ];

            if (rating) {
                matchQuery.$and.push({
                    rating,
                });
            }

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

            const sortStage: any = {};
            if (!price) {
                sortStage.$sort = {
                    [orderBy]: orderDirection === OrderDirection.ASC ? 1 : -1,
                };
            } else {
                if (price === 'asc') {
                    sortStage.$sort = {
                        price: 1
                    };
                }
                if (price === 'desc') {
                    sortStage.$sort = {
                        price: -1
                    };
                }

            }

            const [result] = await this.productModel.aggregate([
                {
                    $addFields: {
                        id: { $toString: '$_id' },
                        price: { $toDouble: "$price" }
                    },
                },
                {
                    $match: {
                        ...matchQuery,
                    },
                },
                {
                    $project: parseMongoProjection(ProductAttributesForList),
                },
                {
                    $facet: {
                        count: [{ $count: 'total' }],
                        data: [
                            sortStage,
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
