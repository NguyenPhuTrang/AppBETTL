import { BaseService } from '../../common/base/base.service';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import { PaymentRepository } from '../payment.repository';
import { HttpStatus } from '../../common/constants';
import {
    CreatePaymentDto,
    CancelPaymentDto,
    GetPaymentListQuery,
} from '../payment.interface';
import { PaymentStatus, PAYOS_API_URL } from '../payment.constant';
import { Payment } from '@/database/schemas/payment.schema';

@Injectable()
export class PaymentService extends BaseService<Payment, PaymentRepository> {
    constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly configService: ConfigService,
    ) {
        super(paymentRepository);
    }

    async createPaymentLink(dto: CreatePaymentDto) {
        try {
            const orderCode = Date.now();

            const payment = await this.paymentRepository.createOne({
                orderCode,
                amount: dto.amount,
                description: dto.description,
                buyerName: dto.buyerName,
                buyerEmail: dto.buyerEmail,
                buyerPhone: dto.buyerPhone,
                status: PaymentStatus.PENDING,
            } as any);

            const payload = {
                orderCode,
                amount: dto.amount,
                description: dto.description,
                items: dto.items ?? [
                    { name: dto.description, quantity: 1, price: dto.amount },
                ],
                cancelUrl: this.configService.get<string>('PAYOS_CANCEL_URL'),
                returnUrl: this.configService.get<string>('PAYOS_RETURN_URL'),
                ...(dto.buyerName && { buyerName: dto.buyerName }),
                ...(dto.buyerEmail && { buyerEmail: dto.buyerEmail }),
                ...(dto.buyerPhone && { buyerPhone: dto.buyerPhone }),
            };

            const signature = this.createRequestSignature(payload);

            const { data } = await axios.post(
                `${PAYOS_API_URL}/v2/payment-requests`,
                { ...payload, signature },
                {
                    headers: {
                        'x-client-id':
                            this.configService.get('PAYOS_CLIENT_ID'),
                        'x-api-key': this.configService.get('PAYOS_API_KEY'),
                        'Content-Type': 'application/json',
                    },
                },
            );

            const { checkoutUrl, paymentLinkId } = data.data;

            await this.paymentRepository.updateOneById((payment as any)._id, {
                checkoutUrl,
                paymentLinkId,
            } as any);

            return await this.paymentRepository.findPaymentByOrderCode(
                orderCode,
            );
        } catch (error) {
            this.logger.error(
                'Error in PaymentService createPaymentLink: ' + error,
            );
            throw error;
        }
    }

    async handleWebhook(body: any) {
        try {
            if (!this.verifyWebhookSignature(body)) {
                throw new HttpException(
                    'Invalid signature',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const { orderCode, code } = body.data;

            const payment =
                await this.paymentRepository.findPaymentByOrderCode(orderCode);
            if (!payment) {
                return { success: true };
            }

            if (payment.status !== PaymentStatus.PENDING) {
                return { success: true };
            }

            const newStatus =
                code === '00' ? PaymentStatus.PAID : PaymentStatus.CANCELLED;

            await this.paymentRepository.updateOneById((payment as any)._id, {
                status: newStatus,
            } as any);

            return { success: true };
        } catch (error) {
            this.logger.error(
                'Error in PaymentService handleWebhook: ' + error,
            );
            throw error;
        }
    }

    async cancelPaymentLink(orderCode: number, dto: CancelPaymentDto) {
        try {
            const payment =
                await this.paymentRepository.findPaymentByOrderCode(orderCode);
            if (!payment) {
                throw new HttpException(
                    'Payment not found',
                    HttpStatus.ITEM_NOT_FOUND,
                );
            }

            await axios.put(
                `${PAYOS_API_URL}/v2/payment-requests/${payment.paymentLinkId}/cancel`,
                { cancellationReason: dto.reason ?? 'Cancelled by user' },
                {
                    headers: {
                        'x-client-id':
                            this.configService.get('PAYOS_CLIENT_ID'),
                        'x-api-key': this.configService.get('PAYOS_API_KEY'),
                    },
                },
            );

            await this.paymentRepository.updateOneById((payment as any)._id, {
                status: PaymentStatus.CANCELLED,
            } as any);

            return await this.paymentRepository.findPaymentByOrderCode(
                orderCode,
            );
        } catch (error) {
            this.logger.error(
                'Error in PaymentService cancelPaymentLink: ' + error,
            );
            throw error;
        }
    }

    async getPaymentByOrderCode(orderCode: number) {
        try {
            const payment =
                await this.paymentRepository.findPaymentByOrderCode(orderCode);
            if (!payment) {
                throw new HttpException(
                    'Payment not found',
                    HttpStatus.ITEM_NOT_FOUND,
                );
            }
            return payment;
        } catch (error) {
            this.logger.error(
                'Error in PaymentService getPaymentByOrderCode: ' + error,
            );
            throw error;
        }
    }

    async findAllAndCountPaymentByQuery(query: GetPaymentListQuery) {
        try {
            return await this.paymentRepository.findAllAndCountPaymentByQuery(
                query,
            );
        } catch (error) {
            this.logger.error(
                'Error in PaymentService findAllAndCountPaymentByQuery: ' +
                    error,
            );
            throw error;
        }
    }

    private createRequestSignature(payload: any): string {
        const checksumKey =
            this.configService.get<string>('PAYOS_CHECKSUM_KEY');
        const data = [
            `amount=${payload.amount}`,
            `cancelUrl=${payload.cancelUrl}`,
            `description=${payload.description}`,
            `orderCode=${payload.orderCode}`,
            `returnUrl=${payload.returnUrl}`,
        ]
            .sort()
            .join('&');

        return crypto
            .createHmac('sha256', checksumKey)
            .update(data)
            .digest('hex');
    }

    private verifyWebhookSignature(body: any): boolean {
        const checksumKey =
            this.configService.get<string>('PAYOS_CHECKSUM_KEY');
        const { data, signature } = body;

        const rawData = [
            `amount=${data.amount}`,
            `code=${data.code}`,
            `desc=${data.desc}`,
            `orderCode=${data.orderCode}`,
            `reference=${data.reference}`,
            `transactionDateTime=${data.transactionDateTime}`,
            `accountNumber=${data.accountNumber}`,
            `currency=${data.currency}`,
            `paymentLinkId=${data.paymentLinkId}`,
            `virtualAccountNumber=${data.virtualAccountNumber ?? ''}`,
            `virtualAccountName=${data.virtualAccountName ?? ''}`,
            `counterAccountBankId=${data.counterAccountBankId ?? ''}`,
            `counterAccountBankName=${data.counterAccountBankName ?? ''}`,
            `counterAccountName=${data.counterAccountName ?? ''}`,
            `counterAccountNumber=${data.counterAccountNumber ?? ''}`,
        ]
            .sort()
            .join('&');

        const expected = crypto
            .createHmac('sha256', checksumKey)
            .update(rawData)
            .digest('hex');

        return expected === signature;
    }
}
