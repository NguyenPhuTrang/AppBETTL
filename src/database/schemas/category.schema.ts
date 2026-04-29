import { Prop, Schema } from '@nestjs/mongoose';
import { MongoBaseSchema } from './base.schema';
import { MongoCollection } from '../utils/constants';
import { createSchemaForClass } from '../utils/helper';

export type CategoryDocument = SchemaDocument<Category>;

@Schema({
    timestamps: true,
    collection: MongoCollection.CATEGORIES,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Category extends MongoBaseSchema {
    @Prop({ required: true, type: String })
    title: string;

    @Prop({ required: false, type: String })
    icon: string;

    @Prop({ required: false, type: Number, default: 0 })
    sortOrder: number;

    @Prop({ required: false, type: Boolean, default: true })
    isActive: boolean;
}

const CategorySchema = createSchemaForClass(Category);

export { CategorySchema };
