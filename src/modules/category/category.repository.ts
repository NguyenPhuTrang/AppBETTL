import { BaseRepository } from '../../common/base/base.repository';
import {
    Category,
    CategoryDocument,
} from '../../database/schemas/category.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { GetCategoryListQuery } from './category.interface';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_LIMIT_FOR_PAGINATION,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIRECTION,
    OrderDirection,
    softDeleteCondition,
} from '../../common/constants';
import { parseMongoProjection } from '../../common/helpers/commonFunctions';
import { CategoryAttributesForList } from './category.constant';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
    constructor(
        @InjectModel(Category.name)
        private readonly categoryModel: Model<CategoryDocument>,
    ) {
        super(categoryModel);
    }

    async findOneByCondition(
        condition: Record<string, any>,
    ): Promise<Category | null> {
        try {
            const category = await this.categoryModel.findOne(condition);
            return category || null;
        } catch (error) {
            this.logger.error(
                'Error in CategoryRepository findOneByCondition: ' + error,
            );
            throw error;
        }
    }

    async findAllAndCountCategoryByQuery(query: GetCategoryListQuery) {
        try {
            const {
                keyword = '',
                page = +DEFAULT_FIRST_PAGE,
                limit = +DEFAULT_LIMIT_FOR_PAGINATION,
                orderBy = DEFAULT_ORDER_BY,
                orderDirection = DEFAULT_ORDER_DIRECTION,
                isActive,
            } = query;

            const matchQuery: FilterQuery<Category> = {};
            matchQuery.$and = [
                {
                    ...softDeleteCondition,
                },
            ];

            if (keyword) {
                const keywordRegex = new RegExp(`.*${keyword}.*`, 'i');
                matchQuery.$and.push({
                    $or: [{ title: { $regex: keywordRegex } }],
                });
            }

            if (isActive !== undefined) {
                matchQuery.$and.push({ isActive });
            }

            const [result] = await this.categoryModel.aggregate([
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
                    $project: parseMongoProjection(CategoryAttributesForList),
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
                'Error in CategoryRepository findAllAndCountCategoryByQuery: ' +
                    error,
            );
            throw error;
        }
    }
}
