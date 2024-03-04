import { INPUT_TEXT_MAX_LENGTH, MAX_PRICE, MIN_PRICE, TEXTAREA_MAX_LENGTH, URL_MAX_LENGTH } from '../../common/constants';
import { JoiValidate } from '../../common/decorators/validator.decorator';
import { CommonListQuery } from "../../common/interfaces";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Joi from '../../plugins/joi';
import { ProductOrderBy } from './product.constant';


export class CreateProductDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Product name',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    name: string;

    @ApiProperty({
        type: String,
        maxLength: MAX_PRICE,
        minLength: MIN_PRICE,
        default: 'Product price',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    price: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Product quantity',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    quantity: string;

    @ApiProperty({
        type: String,
        maxLength: TEXTAREA_MAX_LENGTH,
        default: 'Product description',
    })
    @JoiValidate(Joi.string().trim().max(TEXTAREA_MAX_LENGTH).required())
    description: string;

    @ApiProperty({
        type: String,
        maxLength: URL_MAX_LENGTH,
        default: 'Product image',
    })
    @JoiValidate(Joi.string().trim().max(URL_MAX_LENGTH).required())
    image: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Product rating',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    rating: number;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Product sale',
    })
    @JoiValidate(Joi.string().trim().max(URL_MAX_LENGTH).required())
    sale: string;
}

export class UpdateProductDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Product name',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    name: string;
    @ApiProperty({
        type: String,
        maxLength: MAX_PRICE,
        minLength: MIN_PRICE,
        default: 'Product price',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    price: string;
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Product quantity',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    quantity: string;
    @ApiProperty({
        type: String,
        maxLength: TEXTAREA_MAX_LENGTH,
        default: 'Product description',
    })
    @JoiValidate(Joi.string().trim().max(TEXTAREA_MAX_LENGTH).required())
    description: string;
    @ApiProperty({
        type: String,
        maxLength: URL_MAX_LENGTH,
        default: 'Product image',
    })
    @JoiValidate(Joi.string().trim().max(URL_MAX_LENGTH).required())
    image: string;
}

export class GetProductListQuery extends CommonListQuery {
    @ApiPropertyOptional({
        enum: ProductOrderBy,
        description: 'Which field used to sort',
        default: ProductOrderBy.UPDATED_AT,
    })
    @JoiValidate(
        Joi.string()
          .valid(...Object.values(ProductOrderBy))
          .optional(),
    )
    orderBy?: ProductOrderBy;
    
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: "Product'name for filter",
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional().allow(null, ''))
    name?: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: "Product'price for filter",
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    price?: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: "Product'rating for filter",
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    rating?: string;
}