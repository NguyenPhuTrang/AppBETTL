import { Prop, Schema } from '@nestjs/mongoose';
import { MongoBaseSchema } from './base.schema';
import { MongoCollection } from '../utils/constants';
import { createSchemaForClass } from '../utils/helper';
import { PaymentStatus } from '@/payment/payment.constant';

export type PaymentDocument = SchemaDocument<Payment>;

@Schema({
    timestamps: true,
    collection: MongoCollection.PAYMENTS,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Payment extends MongoBaseSchema {
    @Prop({ required: true, type: Number, unique: true })
    orderCode: number;

    @Prop({ required: true, type: Number })
    amount: number;

    @Prop({ required: true, type: String })
    description: string;

    @Prop({ required: false, type: String, default: null })
    buyerName: string;

    @Prop({ required: false, type: String, default: null })
    buyerEmail: string;

    @Prop({ required: false, type: String, default: null })
    buyerPhone: string;

    @Prop({
        required: true,
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    @Prop({ required: false, type: String, default: null })
    checkoutUrl: string;

    @Prop({ required: false, type: String, default: null })
    paymentLinkId: string;
}

const PaymentSchema = createSchemaForClass(Payment);

export { PaymentSchema };
