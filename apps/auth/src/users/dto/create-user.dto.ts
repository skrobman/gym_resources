import {
    IsEmail,
    IsNotEmpty,
    IsStrongPassword, ValidateNested,
} from "class-validator";
import {Transform, Type} from "class-transformer";
import {ProfileDto} from "./profile.dto";
import {BadRequestException} from "@nestjs/common";


export class CreateUserDto {
    @IsNotEmpty({ message: 'Email is required.' })
    @IsEmail({}, { message: 'Email must be a valid email address.' })
    email: string;

    @IsNotEmpty({ message: 'Password is required.' })
    @IsStrongPassword()
    password: string;

    @ValidateNested()
    @Type(() => ProfileDto)
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                // Ensure it's instantiated as ProfileDto class
                return Object.assign(new ProfileDto(), parsed);
            } catch (err) {
                throw new BadRequestException('Field "profile" is not a valid JSON object');
            }
        }
        return value;
    }, { toClassOnly: true })
    profile: ProfileDto;
}