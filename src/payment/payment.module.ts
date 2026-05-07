import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { PaymentRepository } from './payment.repository';
import { Payment, PaymentSchema } from '../database/schemas/payment.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Payment.name, schema: PaymentSchema },
        ]),
        JwtModule,
    ],
    controllers: [PaymentController],
    providers: [PaymentService, PaymentRepository],
    exports: [PaymentService],
})
export class PaymentModule {}
