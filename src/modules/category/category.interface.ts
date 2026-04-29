import { INPUT_TEXT_MAX_LENGTH, URL_MAX_LENGTH } from '../../common/constants';
import { JoiValidate } from '../../common/decorators/validator.decorator';
import { CategoryOrderBy } from './category.constant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Joi from '../../plugins/joi';
import { CommonListQuery } from '../../common/interfaces';

export class CreateCategoryDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Clothing & Shoes',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    title: string;

    @ApiProperty({
        type: String,
        maxLength: URL_MAX_LENGTH,
        default: './icons/ic-hanger.svg',
    })
    @JoiValidate(Joi.string().trim().max(URL_MAX_LENGTH).optional())
    icon?: string;

    @ApiProperty({
        type: Number,
        default: 0,
    })
    @JoiValidate(Joi.number().optional())
    sortOrder?: number;

    @ApiProperty({
        type: Boolean,
        default: true,
    })
    @JoiValidate(Joi.boolean().optional())
    isActive?: boolean;
}

export class UpdateCategoryDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Clothing & Shoes',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    title: string;

    @ApiProperty({
        type: String,
        maxLength: URL_MAX_LENGTH,
        default: './icons/ic-hanger.svg',
    })
    @JoiValidate(Joi.string().trim().max(URL_MAX_LENGTH).optional())
    icon?: string;

    @ApiProperty({
        type: Number,
        default: 0,
    })
    @JoiValidate(Joi.number().optional())
    sortOrder?: number;

    @ApiProperty({
        type: Boolean,
        default: true,
    })
    @JoiValidate(Joi.boolean().optional())
    isActive?: boolean;
}

export class GetCategoryListQuery extends CommonListQuery {
    @ApiPropertyOptional({
        enum: CategoryOrderBy,
        description: 'Which field used to sort',
        default: CategoryOrderBy.UPDATED_AT,
    })
    @JoiValidate(
        Joi.string()
            .valid(...Object.values(CategoryOrderBy))
            .optional(),
    )
    orderBy?: CategoryOrderBy;

    @ApiPropertyOptional({
        type: Boolean,
        description: 'Filter by active status',
    })
    @JoiValidate(Joi.boolean().optional())
    isActive?: boolean;
}
