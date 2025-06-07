import {Prop} from "@nestjs/mongoose";
import {Gender} from "@app/common";

export class Profile {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    surname: string;

    @Prop({ type: String, enum: Gender })
    gender: Gender;

    @Prop({ type: String, default: null })
    phone?: string | null;

    @Prop({ type: String, default: null })
    city?: string | null;

    @Prop({ type: String, default: null })
    address?: string | null;

    @Prop({ type: String, default: null })
    profile_image?: string | null;
}