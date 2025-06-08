import {Body, Controller, Get, Patch, Post, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {JwtAuthGuard} from "../guards/jwt.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {CurrentUser} from "@app/common/decorators/current-user.decorator";
import {UserDocument} from "@app/common/models/user.schema";
import {ProfileDto} from "./dto/profile.dto";
import {ChangeProfileDto} from "./dto/change-profile.dto";
import {ChangePasswordDto} from "./dto/change-password.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    @UseInterceptors(FileInterceptor('profile-photo'))
    create(
        @Body() createUserDto: CreateUserDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.usersService.create(createUserDto, file);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@CurrentUser() user: UserDocument): ProfileDto{
        return user.profile;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    changeUserProfile(
        @CurrentUser() user: UserDocument,
        @Body() changeProfileDto: ChangeProfileDto,
    ): Promise<ProfileDto>{
        return this.usersService.changeUserProfile(user._id.toString(), changeProfileDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update-password')
    async changePassword(
        @CurrentUser() user: UserDocument,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        return this.usersService.changeUserPassword(user._id.toString(), changePasswordDto, user);
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('profile-photo'))
    @Patch('update-photo')
    async updateProfilePhoto(
        @CurrentUser() user: UserDocument,
        @UploadedFile() file: Express.Multer.File
    ){
        return this.usersService.updateProfilePhoto(user._id.toString(), file)
    }
}