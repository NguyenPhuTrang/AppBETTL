import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../common/base/base.repository";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { ReleaseQuality, ReleaseQualityDocument } from "../../database/schemas/release-quality.schema";
import { GetReleaseListQuery } from "./interface";
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_LIMIT_FOR_PAGINATION,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIRECTION,
    OrderDirection,
    softDeleteCondition,
} from '../../common/constants';
import { parseMongoProjection } from "../../common/helpers/commonFunctions";
import { ReleaseQualityAttributesForList } from "./release-quality.constant";

@Injectable()
export class ReleaseQualityRepository extends BaseRepository<ReleaseQuality> {
    constructor(
        @InjectModel(ReleaseQuality.name)
        private readonly releaseModel: Model<ReleaseQualityDocument>
    ) {
        super(releaseModel);
    }

    async findAllAndCountReleaseByQuery(query: GetReleaseListQuery) {
        try {
            const {
                keyword = '',
                page = +DEFAULT_FIRST_PAGE,
                limit = +DEFAULT_LIMIT_FOR_PAGINATION,
                orderBy = DEFAULT_ORDER_BY,
                orderDirection = DEFAULT_ORDER_DIRECTION,
            } = query;
            const matchQuery: FilterQuery<ReleaseQuality> = {};
            matchQuery.$and = [
                {
                    ...softDeleteCondition,
                },
            ];

            const [result] = await this.releaseModel.aggregate([
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
                    $project: parseMongoProjection(ReleaseQualityAttributesForList),
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
                {
                    $limit: Number(limit),
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