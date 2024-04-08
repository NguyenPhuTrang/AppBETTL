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
import { CreateReleaseQualityDto, GetReleaseListQuery } from './interface';
import { ErrorResponse, SuccessResponse } from '../../common/helpers/response';
import { toObjectId } from '../../common/helpers/commonFunctions';
import { Types } from 'mongoose';
import { HttpStatus } from '../../common/constants';


@ApiTags('Release Quality APIs')
@Controller('release-quality')
export class ReleaseQualityController extends BaseController {
    constructor(private readonly releaseQualityService: ReleaseQualityService) {
        super();
    }

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

    @Get(':id')
    async getReleaseQualityById(
        @Param('id') id: Types.ObjectId,
    ) {
        try {
            console.log(id);
            
            const result =
                await this.releaseQualityService.findReleaseById(toObjectId(id));
            if (!result) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    'Không tìm thấy release'
                );
            }
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Post()
    async createReleaseQuality(
        @Body() dto: CreateReleaseQualityDto,
    ) {
        try {
            const result = await this.releaseQualityService.createRelease(dto);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Patch(':id')
    async updateReleaseQuality(
        @Param('id') id: string,
        @Body() dto: CreateReleaseQualityDto,
    ) {
        try {
            const result = await this.releaseQualityService.updateRelease(
                toObjectId(id),
                dto
            );
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Delete(':id')
    async deleteReleaseQuality(
        @Param('id') id: string,
    ) {
        try {
            const result = await this.releaseQualityService.deleteRelease(
                toObjectId(id),
            );
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }
}
