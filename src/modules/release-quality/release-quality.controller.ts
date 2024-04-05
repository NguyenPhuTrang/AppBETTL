import { BaseController } from '../../common/base/base.controller';
import {
    Controller,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Get,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ReleaseQualityService } from './release-quality.service';
import {
    ApiResponseError,
    SwaggerApiType,
    ApiResponseSuccess,
} from '../../common/services/swagger.service';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import { JoiValidationPipe } from '../../common/pipe/joi.validation.pipe';
import { GetReleaseListQuery } from './interface';
import { SuccessResponse } from '../../common/helpers/response';


@ApiTags('Release Quality APIs')
@Controller('release-quality')
export class ReleaseQualityController extends BaseController {
    constructor(private readonly releaseQualityService: ReleaseQualityService) {
        super();
    }

    @ApiOperation({ summary: 'Get Release Quality list' })
    @ApiResponseError([SwaggerApiType.GET_LIST])
    @Get()
    async getReleaseQualityList(
        @Query(new JoiValidationPipe())
        query: GetReleaseListQuery,
    ) {
        try {
            const result =
                await this.releaseQualityService.findAllAndCountReleaseQualityByQuery(query);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }
}
