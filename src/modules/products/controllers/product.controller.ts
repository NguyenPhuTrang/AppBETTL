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
import { createProductSuccessResponseExample, deleteProductSuccessResponseExample, getProductDetailSuccessResponseExample, getProductListSuccessResponseExample, updateProductSuccessResponseExample } from '../product.swagger';
import { CreateProductDto, GetProductListQuery, UpdateProductDto } from '../product.interface';

@ApiTags('Product APIs')
@Controller('product')
export class ProductController extends BaseController {
    constructor(private readonly productService: ProductService) {
        super();
    }

    @ApiOperation({ summary: 'Create Product' })
    @ApiResponseError([SwaggerApiType.CREATE])
    @ApiResponseSuccess(createProductSuccessResponseExample)
    @ApiBody({ type: CreateProductDto })
    @Post()
    async createProduct(
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: CreateProductDto,
    ) {
        try {
            const result = await this.productService.createProduct(dto);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Update Product by id' })
    @ApiResponseError([SwaggerApiType.UPDATE])
    @ApiResponseSuccess(updateProductSuccessResponseExample)
    @ApiBody({ type: UpdateProductDto })
    @Patch(':id')
    async updateProduct(
        @Param('id', new JoiValidationPipe(mongoIdSchema))
        id: string,
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: UpdateProductDto,
    ) {
        try {
            const product = await this.productService.findProductById(toObjectId(id));
            if (!product) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('user.error.notFound', {
                        args: {
                            id,
                        },
                    }),
                );
            }
            const result = await this.productService.updateProduct(
                toObjectId(id),
                dto,
            );
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Delete Product by id' })
    @ApiResponseError([SwaggerApiType.DELETE])
    @ApiResponseSuccess(deleteProductSuccessResponseExample)
    @Delete(':id')
    async deleteProduct(
        @Param('id', new JoiValidationPipe(mongoIdSchema))
        id: string,
    ) {
        try {
            const product = await this.productService.findProductById(toObjectId(id));

            if (!product) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('user.error.notFound', {
                        args: {
                            id,
                        },
                    }),
                );
            }
            const result = await this.productService.deleteProduct(toObjectId(id));
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Get Product details by id' })
    @ApiResponseError([SwaggerApiType.GET_DETAIL])
    @ApiResponseSuccess(getProductDetailSuccessResponseExample)
    @Get(':id')
    async getProductDetail(
        @Param('id', new JoiValidationPipe(mongoIdSchema)) id: string,
    ) {
        try {
            const result = await this.productService.findProductById(toObjectId(id));

            if(!result) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('user.error.notFound', {
                        args: {
                            id,
                        },
                    }),
                );
            }
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
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