import { Prop, Schema } from '@nestjs/mongoose';
import { MongoBaseSchema } from './base.schema';
import { MongoCollection } from '../utils/constants';
import { createSchemaForClass } from '../utils/helper';

export type ProductDocument = SchemaDocument<Product>;

class ProductColor {
    @Prop({ type: String })
    label: string;

    @Prop({ type: String })
    value: string;

    @Prop({ type: String, default: null })
    thumbnail: string;
}

class ProductShipping {
    @Prop({ type: Boolean, default: false })
    isFreeShip: boolean;

    @Prop({ type: String, default: null })
    estimatedDelivery: string;
}

@Schema({
    timestamps: true,
    collection: MongoCollection.PRODUCTS,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class Product extends MongoBaseSchema {
    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, type: String })
    description: string;

    @Prop({ required: true, type: [String] })
    images: string[];

    @Prop({ required: true, type: Number })
    price: number;

    @Prop({ type: Number, default: null })
    originalPrice: number;

    @Prop({ type: Number, default: 0 })
    sale: number;

    @Prop({ type: String, default: null })
    categoryId: string;

    @Prop({ type: [Object], default: [] })
    colors: ProductColor[];

    @Prop({ type: [String], default: [] })
    sizes: string[];

    @Prop({ required: true, type: Number })
    quantity: number;

    @Prop({ type: String, default: 'New' })
    condition: string;

    @Prop({ type: Number, default: 0 })
    rating: number;

    @Prop({ type: Number, default: 0 })
    totalRatings: number;

    @Prop({ type: Number, default: 0 })
    totalSold: number;

    @Prop({ type: Object, default: null })
    shipping: ProductShipping;
}

const ProductSchema = createSchemaForClass(Product);
export { ProductSchema };
