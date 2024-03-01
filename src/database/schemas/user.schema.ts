import { Prop, Schema } from '@nestjs/mongoose';
import { MongoBaseSchema } from './base.schema';
import { MongoCollection } from '../utils/constants';
import { createSchemaForClass } from '../utils/helper';
export type UserDocument = SchemaDocument<User>;
@Schema({
    timestamps: true,
    collection: MongoCollection.USERS,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class User extends MongoBaseSchema {
    @Prop({ required: false, type: String })
    name: string;
    @Prop({ required: false, type: String })
    email: string;
    @Prop({ required: false, type: String })
    birthday: string;
    @Prop({ required: false, type: String })
    numberPhone: string;
    @Prop({ required: true, type: String })
    avatarUrl: string;
    @Prop({ required: false, type: String })
    password: string;
    @Prop({ required: true, type: String })
    role: string;
    @Prop({ nullable: true, default: null })
    refresh_token: string;
}

const UserSchema = createSchemaForClass(User);

export { UserSchema };
