import {
    IsEmail, IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
    Length,
    Matches
} from "class-validator";
import {Gender} from "@app/common";


export class CreateUserDto {
    @IsNotEmpty({ message: 'Email is required.' })
    @IsEmail({}, { message: 'Email must be a valid email address.' })
    email: string;

    @IsNotEmpty({ message: 'Name is required.' })
    @IsString()
    @Matches(/^[A-Za-z]+(?:-[A-Za-z]+)*$/, {
        message: 'Name must contain only letters, single hyphens between words (no leading/trailing hyphen)',
    })
    name: string;

    @IsNotEmpty({ message: 'Surname is required.' })
    @IsString()
    @Matches(/^[A-Za-z]+(?:-[A-Za-z]+)*$/, {
        message: 'Name must contain only letters, single hyphens between words (no leading/trailing hyphen)',
    })
    surname: string;

    @IsNotEmpty({ message: 'Password is required.' })
    @IsStrongPassword()
    password: string;

    @IsNotEmpty({ message: 'Gender is required.' })
    @IsEnum(Gender, { message: 'Gender must be either male or female.' })
    gender: Gender;

    @IsOptional()
    @Matches(/^\+(?:48|375|380)\d{7,10}$/, {
        message:
            'Phone must be a valid PL (+48), BY (+375) or UA (+380) number in E.164 format.',
    })
    phone?: string | null = null;

    @IsOptional()
    @IsString()
    @Length(2, 50, {
        message: 'City must be at least 2 characters and at most 50 characters long.',
    })
    city?: string | null = null;

    @IsOptional()
    @IsString()
    @Length(2, 100, {
        message: 'City must be at least 2 characters and at most 100 characters long.',
    })
    address?: string | null = null;
}