import {
    Controller,
    Post,
    Put,
    Get,
    Body,
    Param,
    Query,
    UseGuards,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    CreatePaymentDto,
    CancelPaymentDto,
    GetPaymentListQuery,
} from '../payment.interface';
import {
    ApiResponseError,
    SwaggerApiType,
    ApiResponseSuccess,
} from '../../common/services/swagger.service';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import {
    createPaymentSuccessResponseExample,
    cancelPaymentSuccessResponseExample,
    getPaymentDetailSuccessResponseExample,
    getPaymentListSuccessResponseExample,
    webhookPaymentSuccessResponseExample,
} from '../payment.swagger';
import { TrimBodyPipe } from '../../common/pipe/trim.body.pipe';
import { BaseController } from '../../common/base/base.controller';
import { JoiValidationPipe } from '../../common/pipe/joi.validation.pipe';
import { PaymentService } from '../services/payment.service';
import { AuthGuard } from '../../auth/auth.guard';
import { SuccessResponse } from '@/common/helpers/swaggerResponse';

@ApiTags('Payment APIs')
@Controller('payment')
export class PaymentController extends BaseController {
    constructor(private readonly paymentService: PaymentService) {
        super();
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Create payment link' })
    @ApiResponseError([SwaggerApiType.CREATE])
    @ApiResponseSuccess(createPaymentSuccessResponseExample)
    @ApiBody({ type: CreatePaymentDto })
    @Post('create')
    async createPaymentLink(
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: CreatePaymentDto,
    ) {
        try {
            const result = await this.paymentService.createPaymentLink(dto);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Handle PayOS webhook callback' })
    @ApiResponseSuccess(webhookPaymentSuccessResponseExample)
    async handleWebhook(@Body() body: any) {
        try {
            const result = await this.paymentService.handleWebhook(body);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Cancel payment link' })
    @ApiResponseError([SwaggerApiType.UPDATE])
    @ApiResponseSuccess(cancelPaymentSuccessResponseExample)
    @ApiBody({ type: CancelPaymentDto })
    @Put('cancel/:orderCode')
    async cancelPaymentLink(
        @Param('orderCode', ParseIntPipe) orderCode: number,
        @Body(new TrimBodyPipe(), new JoiValidationPipe())
        dto: CancelPaymentDto,
    ) {
        try {
            const result = await this.paymentService.cancelPaymentLink(
                orderCode,
                dto,
            );
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get payment detail by orderCode' })
    @ApiResponseError([SwaggerApiType.GET_DETAIL])
    @ApiResponseSuccess(getPaymentDetailSuccessResponseExample)
    @Get(':orderCode')
    async getPaymentDetail(
        @Param('orderCode', ParseIntPipe) orderCode: number,
    ) {
        try {
            const result =
                await this.paymentService.getPaymentByOrderCode(orderCode);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get payment list' })
    @ApiResponseError([SwaggerApiType.GET_LIST])
    @ApiResponseSuccess(getPaymentListSuccessResponseExample)
    @Get()
    async getPaymentList(
        @Query(new JoiValidationPipe())
        query: GetPaymentListQuery,
    ) {
        try {
            const result =
                await this.paymentService.findAllAndCountPaymentByQuery(query);
            return new SuccessResponse(result);
        } catch (error) {
            this.handleError(error);
        }
    }
}
