import { BaseRepository } from '../common/base/base.repository';
import { Payment, PaymentDocument } from '../database/schemas/payment.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentAttributesForList } from './payment.constant';
import { parseMongoProjection } from '../common/helpers/commonFunctions';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_LIMIT_FOR_PAGINATION,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIRECTION,
    OrderDirection,
    softDeleteCondition,
} from '../common/constants';
import { GetPaymentListQuery } from './payment.interface';

@Injectable()
export class PaymentRepository extends BaseRepository<Payment> {
    constructor(
        @InjectModel(Payment.name)
        private readonly paymentModel: Model<PaymentDocument>,
    ) {
        super(paymentModel);
    }

    async findOneByCondition(
        condition: Record<string, any>,
    ): Promise<Payment | null> {
        try {
            const payment = await this.paymentModel.findOne(condition);
            return payment || null;
        } catch (error) {
            this.logger.error(
                'Error in PaymentRepository findOneByCondition: ' + error,
            );
            throw error;
        }
    }

    async findPaymentByOrderCode(orderCode: number): Promise<Payment | null> {
        try {
            const payment = await this.paymentModel.findOne({
                orderCode,
                ...softDeleteCondition,
            });
            return payment || null;
        } catch (error) {
            this.logger.error(
                'Error in PaymentRepository findPaymentByOrderCode: ' + error,
            );
            throw error;
        }
    }

    async findAllAndCountPaymentByQuery(query: GetPaymentListQuery) {
        try {
            const {
                page = +DEFAULT_FIRST_PAGE,
                limit = +DEFAULT_LIMIT_FOR_PAGINATION,
                orderBy = DEFAULT_ORDER_BY,
                orderDirection = DEFAULT_ORDER_DIRECTION,
                status = '',
                buyerEmail = '',
            } = query;

            const matchQuery: any = {};
            matchQuery.$and = [{ ...softDeleteCondition }];

            if (status) {
                matchQuery.$and.push({ status });
            }

            if (buyerEmail) {
                matchQuery.$and.push({ buyerEmail });
            }

            const [result] = await this.paymentModel.aggregate([
                {
                    $addFields: {
                        id: { $toString: '$_id' },
                    },
                },
                {
                    $match: { ...matchQuery },
                },
                {
                    $project: parseMongoProjection(PaymentAttributesForList),
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
                'Error in PaymentRepository findAllAndCountPaymentByQuery: ' +
                    error,
            );
            throw error;
        }
    }
}
