import {
    INPUT_TEXT_MAX_LENGTH,
    MAX_PRICE,
    MIN_PRICE,
    TEXTAREA_MAX_LENGTH,
    URL_MAX_LENGTH,
} from '../../common/constants';
import { JoiValidate } from '../../common/decorators/validator.decorator';
import { CommonListQuery } from '../../common/interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Joi from '../../plugins/joi';
import { ProductOrderBy } from './product.constant';

// ── Sub-class cho Color ───────────────────────────────────────────────────────
export class ProductColorDto {
    @ApiProperty({ type: String, default: 'Đen' })
    @JoiValidate(Joi.string().trim().required())
    label: string;

    @ApiProperty({ type: String, default: '#000000' })
    @JoiValidate(Joi.string().trim().required())
    value: string;

    @ApiPropertyOptional({ type: String, default: null })
    @JoiValidate(Joi.string().trim().optional().allow(null, ''))
    thumbnail?: string;
}

export class ProductShippingDto {
    @ApiProperty({ type: Boolean, default: false })
    @JoiValidate(Joi.boolean().required())
    isFreeShip: boolean;

    @ApiPropertyOptional({ type: String, default: null })
    @JoiValidate(Joi.string().trim().optional().allow(null, ''))
    estimatedDelivery?: string;
}

export class CreateProductDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Áo thun nam',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    name: string;

    @ApiProperty({
        type: String,
        maxLength: TEXTAREA_MAX_LENGTH,
        default: 'Mô tả sản phẩm',
    })
    @JoiValidate(Joi.string().trim().max(TEXTAREA_MAX_LENGTH).required())
    description: string;

    @ApiProperty({ type: [String], default: ['https://example.com/image.jpg'] })
    @JoiValidate(
        Joi.array()
            .items(Joi.string().trim().max(URL_MAX_LENGTH))
            .min(1)
            .required(),
    )
    images: string[]; // ← đổi image → images (mảng)

    @ApiProperty({
        type: Number,
        minimum: MIN_PRICE,
        maximum: MAX_PRICE,
        default: 199000,
    })
    @JoiValidate(Joi.number().min(MIN_PRICE).max(MAX_PRICE).required())
    price: number; // ← đổi String → Number

    @ApiPropertyOptional({ type: Number, default: null })
    @JoiValidate(Joi.number().min(0).optional().allow(null))
    originalPrice?: number; // ← mới

    @ApiPropertyOptional({ type: Number, minimum: 0, maximum: 100, default: 0 })
    @JoiValidate(Joi.number().min(0).max(100).optional().allow(null))
    sale?: number; // ← đổi String → Number

    @ApiPropertyOptional({ type: String, default: null })
    @JoiValidate(
        Joi.string()
            .trim()
            .max(INPUT_TEXT_MAX_LENGTH)
            .optional()
            .allow(null, ''),
    )
    categoryId?: string;

    @ApiPropertyOptional({ type: [ProductColorDto], default: [] })
    @JoiValidate(
        Joi.array()
            .items(
                Joi.object({
                    label: Joi.string().required(),
                    value: Joi.string().required(),
                    thumbnail: Joi.string().optional().allow(null, ''),
                }),
            )
            .optional(),
    )
    colors?: ProductColorDto[];

    @ApiPropertyOptional({ type: [String], default: ['S', 'M', 'L'] })
    @JoiValidate(Joi.array().items(Joi.string().trim()).optional())
    sizes?: string[];

    // ── Kho hàng
    @ApiProperty({ type: Number, default: 0 })
    @JoiValidate(Joi.number().min(0).required())
    quantity: number;

    @ApiPropertyOptional({ type: String, default: 'New' })
    @JoiValidate(Joi.string().trim().optional().allow(null, ''))
    condition?: string;

    @ApiPropertyOptional({ type: Number, minimum: 0, maximum: 5, default: 0 })
    @JoiValidate(Joi.number().min(0).max(5).optional())
    rating?: number;

    @ApiPropertyOptional({ type: ProductShippingDto, default: null })
    @JoiValidate(
        Joi.object({
            isFreeShip: Joi.boolean().required(),
            estimatedDelivery: Joi.string().optional().allow(null, ''),
        })
            .optional()
            .allow(null),
    )
    shipping?: ProductShippingDto;
}

export class UpdateProductDto {
    @ApiPropertyOptional({ type: String, maxLength: INPUT_TEXT_MAX_LENGTH })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    name?: string;

    @ApiPropertyOptional({ type: String, maxLength: TEXTAREA_MAX_LENGTH })
    @JoiValidate(Joi.string().trim().max(TEXTAREA_MAX_LENGTH).optional())
    description?: string;

    @ApiPropertyOptional({ type: [String] })
    @JoiValidate(
        Joi.array().items(Joi.string().trim().max(URL_MAX_LENGTH)).optional(),
    )
    images?: string[];

    @ApiPropertyOptional({
        type: Number,
        minimum: MIN_PRICE,
        maximum: MAX_PRICE,
    })
    @JoiValidate(Joi.number().min(MIN_PRICE).max(MAX_PRICE).optional())
    price?: number;

    @ApiPropertyOptional({ type: Number })
    @JoiValidate(Joi.number().min(0).optional().allow(null))
    originalPrice?: number;

    @ApiPropertyOptional({ type: Number, minimum: 0, maximum: 100 })
    @JoiValidate(Joi.number().min(0).max(100).optional().allow(null))
    sale?: number;

    @ApiPropertyOptional({ type: String })
    @JoiValidate(
        Joi.string()
            .trim()
            .max(INPUT_TEXT_MAX_LENGTH)
            .optional()
            .allow(null, ''),
    )
    categoryId?: string;

    @ApiPropertyOptional({ type: [ProductColorDto] })
    @JoiValidate(Joi.array().items(Joi.object()).optional())
    colors?: ProductColorDto[];

    @ApiPropertyOptional({ type: [String] })
    @JoiValidate(Joi.array().items(Joi.string().trim()).optional())
    sizes?: string[];

    @ApiPropertyOptional({ type: Number })
    @JoiValidate(Joi.number().min(0).optional())
    quantity?: number;

    @ApiPropertyOptional({ type: String })
    @JoiValidate(Joi.string().trim().optional().allow(null, ''))
    condition?: string;

    @ApiPropertyOptional({ type: Number, minimum: 0, maximum: 5 })
    @JoiValidate(Joi.number().min(0).max(5).optional())
    rating?: number;

    @ApiPropertyOptional({ type: ProductShippingDto })
    @JoiValidate(
        Joi.object({
            isFreeShip: Joi.boolean(),
            estimatedDelivery: Joi.string().optional().allow(null, ''),
        })
            .optional()
            .allow(null),
    )
    shipping?: ProductShippingDto;
}

export class GetProductListQuery extends CommonListQuery {
    @ApiPropertyOptional({
        enum: ProductOrderBy,
        default: ProductOrderBy.UPDATED_AT,
    })
    @JoiValidate(
        Joi.string()
            .valid(...Object.values(ProductOrderBy))
            .optional(),
    )
    orderBy?: ProductOrderBy;

    @ApiPropertyOptional({ type: String, description: 'Lọc theo tên' })
    @JoiValidate(
        Joi.string()
            .trim()
            .max(INPUT_TEXT_MAX_LENGTH)
            .optional()
            .allow(null, ''),
    )
    name?: string;

    @ApiPropertyOptional({ type: String, description: 'asc | desc' })
    @JoiValidate(Joi.string().valid('asc', 'desc').optional())
    price?: string;

    @ApiPropertyOptional({
        type: Number,
        description: 'Rating tối thiểu (0-5)',
    })
    @JoiValidate(Joi.number().min(0).max(5).optional())
    rating?: number;

    @ApiPropertyOptional({
        type: Number,
        description: 'Sale tối thiểu % (0-100)',
    })
    @JoiValidate(Joi.number().min(0).max(100).optional())
    sale?: number;

    @ApiPropertyOptional({ type: String, description: 'Lọc theo category' })
    @JoiValidate(
        Joi.string()
            .trim()
            .max(INPUT_TEXT_MAX_LENGTH)
            .optional()
            .allow(null, ''),
    )
    categoryId?: string;
}
