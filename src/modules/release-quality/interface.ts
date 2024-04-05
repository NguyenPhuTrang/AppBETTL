import { INPUT_PHONE_MAX_LENGTH, INPUT_TEXT_MAX_LENGTH, URL_MAX_LENGTH } from '../../common/constants';
import { JoiValidate } from '../../common/decorators/validator.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Joi from '../../plugins/joi';
import { CommonListQuery } from '../../common/interfaces';

export class GetReleaseListQuery extends CommonListQuery {
    name?: string;

    role?: string;
}