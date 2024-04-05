import { Prop, Schema } from '@nestjs/mongoose';
import { MongoBaseSchema } from './base.schema';
import { MongoCollection } from '../utils/constants';
import { createSchemaForClass } from '../utils/helper';
export type ReleaseQualityDocument = SchemaDocument<ReleaseQuality>;

// export interface IShortStatDiff {
//     changedFiles: number;
//     insertions: number;
//     deletions: number;
// }

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
    @Prop({ required: true })
    sourceCommit: string;

    @Prop({ required: true })
    releaseCommit: string;

    // @Prop({ required: true })
    // diff: IShortStatDiff;

    @Prop({ required: true })
    bugCount: number;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    releaseTime: Date;

    @Prop({ required: true })
    compatibility: string[];

    @Prop({ required: true })
    changeLog: string[];

    @Prop()
    documentationUrl?: string;
}

const ReleaseQualitySchema = createSchemaForClass(ReleaseQuality);

export { ReleaseQualitySchema };
