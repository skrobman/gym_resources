import {IsNotEmpty, IsString, IsStrongPassword} from "class-validator";

export class ChangePasswordDto{
    @IsNotEmpty({ message: 'Old password is required.' })
    @IsString()
    oldPassword: string;

    @IsNotEmpty({ message: 'New password is required.' })
    @IsString()
    @IsStrongPassword()
    newPassword: string;
}