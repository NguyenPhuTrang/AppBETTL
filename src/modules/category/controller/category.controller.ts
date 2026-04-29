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
import {
    ErrorResponse,
    SuccessResponse,
} from '../../../common/helpers/response';
import { HttpStatus, mongoIdSchema } from '../../../common/constants';
import {
    CreateCategoryDto,
    GetCategoryListQuery,
    UpdateCategoryDto,
} from '../category.interface';
import {
    ApiResponseError,
    SwaggerApiType,
    ApiResponseSuccess,
} from '../../../common/services/swagger.service';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import {
    createCategorySuccessResponseExample,
    deleteCategorySuccessResponseExample,
    getCategoryDetailSuccessResponseExample,
    getCategoryListSuccessResponseExample,
    updateCategorySuccessResponseExample,
} from '../category.swagger';
import { TrimBodyPipe } from '../../../common/pipe/trim.body.pipe';
import { toObjectId } from '../../../common/helpers/commonFunctions';
import { BaseController } from '../../../common/base/base.controller';
import { JoiValidationPipe } from '../../../common/pipe/joi.validation.pipe';
import { CategoryService } from '../services/category.service';
import { AuthGuard } from '../../../auth/auth.guard';

@ApiTags('Category APIs')
@Controller('category')
export class CategoryController extends BaseController {
    constructor(private readonly categoryService: CategoryService) {
        super();
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Create Category' })
    @ApiResponseError([SwaggerApiType.CREATE])
    @ApiResponseSuccess(createCategorySuccessResponseExample)
    @ApiBody({ type: CreateCategoryDto })
    @Post()
    async createCategory(
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: CreateCategoryDto,
    ) {
        try {
            const result = await this.categoryService.createCategory(dto);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Update Category by id' })
    @ApiResponseError([SwaggerApiType.UPDATE])
    @ApiResponseSuccess(updateCategorySuccessResponseExample)
    @ApiBody({ type: UpdateCategoryDto })
    @Patch(':id')
    async updateCategory(
        @Param('id', new JoiValidationPipe(mongoIdSchema))
        id: string,
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: UpdateCategoryDto,
    ) {
        try {
            const category = await this.categoryService.findCategoryById(
                toObjectId(id),
            );
            if (!category) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('category.error.notFound', {
                        args: { id },
                    }),
                );
            }

            const result = await this.categoryService.updateCategory(
                toObjectId(id),
                dto,
            );
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Delete Category by id' })
    @ApiResponseError([SwaggerApiType.DELETE])
    @ApiResponseSuccess(deleteCategorySuccessResponseExample)
    @Delete(':id')
    async deleteCategory(
        @Param('id', new JoiValidationPipe(mongoIdSchema))
        id: string,
    ) {
        try {
            const category = await this.categoryService.findCategoryById(
                toObjectId(id),
            );
            if (!category) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('category.error.notFound', {
                        args: { id },
                    }),
                );
            }

            const result = await this.categoryService.deleteCategory(
                toObjectId(id),
            );
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Get Category detail by id' })
    @ApiResponseError([SwaggerApiType.GET_DETAIL])
    @ApiResponseSuccess(getCategoryDetailSuccessResponseExample)
    @Get(':id')
    async getCategoryDetail(
        @Param('id', new JoiValidationPipe(mongoIdSchema)) id: string,
    ) {
        try {
            const result = await this.categoryService.findCategoryById(
                toObjectId(id),
            );
            if (!result) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    this.translate('category.error.notFound', {
                        args: { id },
                    }),
                );
            }
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @ApiOperation({ summary: 'Get Category list' })
    @ApiResponseError([SwaggerApiType.GET_LIST])
    @ApiResponseSuccess(getCategoryListSuccessResponseExample)
    @Get()
    async getCategoryList(
        @Query(new JoiValidationPipe())
        query: GetCategoryListQuery,
    ) {
        try {
            const result =
                await this.categoryService.findAllAndCountCategoryByQuery(
                    query,
                );
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }
}
