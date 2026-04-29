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
    Request,
} from '@nestjs/common';
import {
    AddToCartDto,
    UpdateCartItemDto,
    GetCartListQuery,
} from '../cart.interface';
import {
    ApiResponseError,
    SwaggerApiType,
    ApiResponseSuccess,
} from '../../../common/services/swagger.service';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import {
    addToCartSuccessResponseExample,
    updateCartItemSuccessResponseExample,
    removeCartItemSuccessResponseExample,
    clearCartSuccessResponseExample,
    getCartDetailSuccessResponseExample,
    getCartListSuccessResponseExample,
} from '../cart.swagger';
import { TrimBodyPipe } from '../../../common/pipe/trim.body.pipe';
import { BaseController } from '../../../common/base/base.controller';
import { JoiValidationPipe } from '../../../common/pipe/joi.validation.pipe';
import { CartService } from '../services/cart.service';
import { AuthGuard } from '../../../auth/auth.guard';
import { SuccessResponse } from '@/common/helpers/swaggerResponse';

@ApiTags('Cart APIs')
@Controller('cart')
export class CartController extends BaseController {
    constructor(private readonly cartService: CartService) {
        super();
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Add product to cart' })
    @ApiResponseError([SwaggerApiType.CREATE])
    @ApiResponseSuccess(addToCartSuccessResponseExample)
    @ApiBody({ type: AddToCartDto })
    @Post('add')
    async addToCart(
        @Request() req: any,
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: AddToCartDto,
    ) {
        try {
            const userId =
                req.user_data?.id || req.user_data?._id || req.user_data?.sub;
            const result = await this.cartService.addToCart(userId, dto);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Update cart item quantity' })
    @ApiResponseError([SwaggerApiType.UPDATE])
    @ApiResponseSuccess(updateCartItemSuccessResponseExample)
    @ApiBody({ type: UpdateCartItemDto })
    @Patch('update')
    async updateCartItem(
        @Request() req: any,
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: UpdateCartItemDto,
    ) {
        try {
            const userId =
                req.user_data?.id || req.user_data?._id || req.user_data?.sub;
            const result = await this.cartService.updateCartItem(userId, dto);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Remove product from cart' })
    @ApiResponseError([SwaggerApiType.DELETE])
    @ApiResponseSuccess(removeCartItemSuccessResponseExample)
    @Delete('remove/:productId')
    async removeCartItem(
        @Request() req: any,
        @Param('productId') productId: string,
    ) {
        try {
            const userId =
                req.user_data?.id || req.user_data?._id || req.user_data?.sub;
            const result = await this.cartService.removeCartItem(
                userId,
                productId,
            );
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Clear cart' })
    @ApiResponseError([SwaggerApiType.DELETE])
    @ApiResponseSuccess(clearCartSuccessResponseExample)
    @Delete('clear')
    async clearCart(@Request() req: any) {
        try {
            const userId =
                req.user_data?.id || req.user_data?._id || req.user_data?.sub;
            const result = await this.cartService.clearCart(userId);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get my cart' })
    @ApiResponseError([SwaggerApiType.GET_DETAIL])
    @ApiResponseSuccess(getCartDetailSuccessResponseExample)
    @Get('my-cart')
    async getMyCart(@Request() req: any) {
        try {
            const userId =
                req.user_data?.id || req.user_data?._id || req.user_data?.sub;
            const result = await this.cartService.getCartByUserId(userId);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get cart list' })
    @ApiResponseError([SwaggerApiType.GET_LIST])
    @ApiResponseSuccess(getCartListSuccessResponseExample)
    @Get()
    async getCartList(
        @Query(new JoiValidationPipe())
        query: GetCartListQuery,
    ) {
        try {
            const result =
                await this.cartService.findAllAndCountCartByQuery(query);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }
}
