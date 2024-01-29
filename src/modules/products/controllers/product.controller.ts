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
import { ErrorResponse, SuccessResponse } from '../../../common/helpers/response';
import { HttpStatus, mongoIdSchema } from '../../../common/constants';
import {
    ApiResponseError,
    SwaggerApiType,
    ApiResponseSuccess,
} from '../../../common/services/swagger.service';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';

import { TrimBodyPipe } from '../../../common/pipe/trim.body.pipe';
import { toObjectId } from '../../../common/helpers/commonFunctions';
import { BaseController } from '../../../common/base/base.controller';
import { JoiValidationPipe } from '../../../common/pipe/joi.validation.pipe';
import { ProductService } from '../services/product.service';
import { AuthGuard } from '../../../auth/auth.guard';
import { getProductListSuccessResponseExample } from '../product.swagger';
import { GetProductListQuery } from '../product.interface';

@ApiTags('Product APIs')
@Controller('product')
export class ProductController extends BaseController {
    constructor(private readonly productService: ProductService) {
        super();
    }

    // @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get Product list' })
    @ApiResponseError([SwaggerApiType.GET_LIST])
    @ApiResponseSuccess(getProductListSuccessResponseExample)
    @Get()
    async getUserList(
        @Query(new JoiValidationPipe())
        query: GetProductListQuery,
    ) {
        try {
            const result =
                await this.productService.findAllAndCountProductByQuery(query);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }
}