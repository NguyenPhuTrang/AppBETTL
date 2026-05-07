import { JoiValidate } from '../common/decorators/validator.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Joi from '../plugins/joi';
import { CommonListQuery } from '../common/interfaces';
import { PaymentOrderBy, PaymentStatus } from './payment.constant';

export class PaymentItemDto {
    @ApiProperty({
        type: String,
        default: 'Product Name',
    })
    @JoiValidate(Joi.string().trim().required())
    name: string;

    @ApiProperty({
        type: Number,
        default: 1,
    })
    @JoiValidate(Joi.number().min(1).required())
    quantity: number;

    @ApiProperty({
        type: Number,
        default: 0,
    })
    @JoiValidate(Joi.number().min(0).required())
    price: number;
}

export class CreatePaymentDto {
    @ApiProperty({
        type: Number,
        default: 0,
    })
    @JoiValidate(Joi.number().min(1000).required())
    amount: number;

    @ApiProperty({
        type: String,
        default: 'Thanh toan don hang',
    })
    @JoiValidate(Joi.string().trim().max(25).required())
    description: string;

    @ApiPropertyOptional({
        type: String,
        default: 'Nguyen Van A',
    })
    @JoiValidate(Joi.string().trim().optional())
    buyerName?: string;

    @ApiPropertyOptional({
        type: String,
        default: 'buyer@email.com',
    })
    @JoiValidate(Joi.string().email().optional())
    buyerEmail?: string;

    @ApiPropertyOptional({
        type: String,
        default: '0901234567',
    })
    @JoiValidate(Joi.string().trim().optional())
    buyerPhone?: string;

    @ApiPropertyOptional({
        type: [PaymentItemDto],
    })
    @JoiValidate(Joi.array().items(Joi.object()).optional())
    items?: PaymentItemDto[];
}

export class CancelPaymentDto {
    @ApiPropertyOptional({
        type: String,
        default: 'Cancelled by user',
    })
    @JoiValidate(Joi.string().trim().optional())
    reason?: string;
}

export class GetPaymentListQuery extends CommonListQuery {
    @ApiPropertyOptional({
        enum: PaymentOrderBy,
        description: 'Which field used to sort',
        default: PaymentOrderBy.UPDATED_AT,
    })
    @JoiValidate(
        Joi.string()
            .valid(...Object.values(PaymentOrderBy))
            .optional(),
    )
    orderBy?: PaymentOrderBy;

    @ApiPropertyOptional({
        enum: PaymentStatus,
        description: 'Filter by payment status',
    })
    @JoiValidate(
        Joi.string()
            .valid(...Object.values(PaymentStatus))
            .optional(),
    )
    status?: PaymentStatus;

    @ApiPropertyOptional({
        type: String,
        description: 'Filter by buyerEmail',
    })
    @JoiValidate(Joi.string().trim().optional())
    buyerEmail?: string;
}

export class PayOSWebhookDto {
    code: string;
    desc: string;
    success: boolean;
    data: any;
    signature: string;
}
