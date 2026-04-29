import { JoiValidate } from '../../common/decorators/validator.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Joi from '../../plugins/joi';
import { CommonListQuery } from '../../common/interfaces';
import { CartOrderBy } from './cart.constant';

export class CartItemDto {
    @ApiProperty({
        type: String,
        default: 'Product ID',
    })
    @JoiValidate(Joi.string().trim().required())
    productId: string;

    @ApiProperty({
        type: String,
        default: 'Product Name',
    })
    @JoiValidate(Joi.string().trim().required())
    productName: string;

    @ApiProperty({
        type: String,
        default: 'Product Image URL',
    })
    @JoiValidate(Joi.string().trim().required())
    productImage: string;

    @ApiProperty({
        type: Number,
        default: 0,
    })
    @JoiValidate(Joi.number().required())
    price: number;

    @ApiProperty({
        type: Number,
        default: 1,
    })
    @JoiValidate(Joi.number().min(1).required())
    quantity: number;
}

export class AddToCartDto {
    @ApiProperty({
        type: String,
        default: 'Product ID',
    })
    @JoiValidate(Joi.string().trim().required())
    productId: string;

    @ApiProperty({
        type: Number,
        default: 1,
    })
    @JoiValidate(Joi.number().min(1).required())
    quantity: number;
}

export class UpdateCartItemDto {
    @ApiProperty({
        type: String,
        default: 'Product ID',
    })
    @JoiValidate(Joi.string().trim().required())
    productId: string;

    @ApiProperty({
        type: Number,
        default: 1,
    })
    @JoiValidate(Joi.number().min(1).required())
    quantity: number;
}

export class GetCartListQuery extends CommonListQuery {
    @ApiPropertyOptional({
        enum: CartOrderBy,
        description: 'Which field used to sort',
        default: CartOrderBy.UPDATED_AT,
    })
    @JoiValidate(
        Joi.string()
            .valid(...Object.values(CartOrderBy))
            .optional(),
    )
    orderBy?: CartOrderBy;

    @ApiPropertyOptional({
        type: String,
        description: 'Filter by userId',
    })
    @JoiValidate(Joi.string().trim().optional())
    userId?: string;
}
