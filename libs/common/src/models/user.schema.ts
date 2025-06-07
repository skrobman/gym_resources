import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {AbstractDocument, Gender} from "@app/common";
import {Status} from "@app/common/enums/status.enum";
import {Profile} from "@app/common/models/user-profile.schema";

@Schema({
    versionKey: false,
    collection: 'users',
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
})
export class UserDocument extends AbstractDocument {
    @Prop({ required: true })
    email: string;

    @Prop({
        type: String,
        enum: Status,
        default: Status.Active
    })
    status?: Status;

    @Prop({ required: true })
    password: string;

    @Prop({ type: Profile, required: true })
    profile: Profile;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);