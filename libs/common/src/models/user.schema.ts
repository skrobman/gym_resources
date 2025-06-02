import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {AbstractDocument, Gender} from "@app/common";

@Schema({ versionKey: false, collection: 'users' })
export class UserDocument extends AbstractDocument {
    @Prop()
    email: string;

    @Prop()
    name: string;

    @Prop()
    surname: string;

    @Prop()
    password: string;

    @Prop({ type: String, enum: Gender })
    gender: Gender;

    @Prop()
    phone?: string;

    @Prop()
    city?: string;

    @Prop()
    address?: string;

}

export const UserSchema = SchemaFactory.createForClass(UserDocument);