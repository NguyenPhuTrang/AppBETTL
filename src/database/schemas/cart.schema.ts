import { Prop, Schema } from '@nestjs/mongoose';
import { MongoBaseSchema } from './base.schema';
import { MongoCollection } from '../utils/constants';
import { createSchemaForClass } from '../utils/helper';

export type CartDocument = SchemaDocument<Cart>;

export class CartItem {
    @Prop({ required: true, type: String })
    productId: string;

    @Prop({ required: true, type: String })
    productName: string;

    @Prop({ required: true, type: String })
    productImage: string;

    @Prop({ required: true, type: Number })
    price: number;

    @Prop({ required: true, type: Number, default: 1 })
    quantity: number;
}

@Schema({
    timestamps: true,
    collection: MongoCollection.CARTS,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Cart extends MongoBaseSchema {
    @Prop({ required: true, type: String })
    userId: string;

    @Prop({ required: false, type: [Object], default: [] })
    items: CartItem[];

    @Prop({ required: false, type: Number, default: 0 })
    totalPrice: number;
}

const CartSchema = createSchemaForClass(Cart);

export { CartSchema };
