import { Prop, Schema } from '@nestjs/mongoose';
import { MongoBaseSchema } from './base.schema';
import { MongoCollection } from '../utils/constants';
import { createSchemaForClass } from '../utils/helper';
import { Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';

export type ReleaseQualityDocument = SchemaDocument<ReleaseQuality>;

export interface IShortStatDiff {
    changedFiles: number;
    insertions: number;
    deletions: number;
    totalCodeReviewId: number;
}

export interface IShortStatBug {
    blocked: number;
    critical: number;
    major: number;
    minor: number;
    suggestion: number
}
@Schema({
    timestamps: true,
    collection: MongoCollection.RELEASEQUALITY,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})

export class ReleaseQuality extends MongoBaseSchema {
    @Prop({
        required: true,
        type: Types.ObjectId,
    })
    repositoryId: ObjectId;

    @Prop({required: false, type: String})
    name: string;

    @Prop({required: false, default: []})
    labels: string[];

    @Prop({ type: Object, required: true })
    diff: IShortStatDiff;

    @Prop({ type: Object, required: true })
    bugs: IShortStatBug;
}

const ReleaseQualitySchema = createSchemaForClass(ReleaseQuality);

export { ReleaseQualitySchema };
