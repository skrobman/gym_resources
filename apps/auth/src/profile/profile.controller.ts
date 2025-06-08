import {Body, Controller, Get, Patch, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {ProfileService} from "./profile.service";
import {JwtAuthGuard} from "../guards/jwt.guard";
import {CurrentUser} from "@app/common/decorators/current-user.decorator";
import {UserDocument} from "@app/common/models/user.schema";
import {ProfileDto} from "./dto/profile.dto";
import {ChangeProfileDto} from "../users/dto/change-profile.dto";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService){}

    @UseGuards(JwtAuthGuard)
    @Get()
    getProfile(@CurrentUser() user: UserDocument): ProfileDto{
        return user.profile;
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    changeUserProfile(
        @CurrentUser() user: UserDocument,
        @Body() changeProfileDto: ChangeProfileDto,
    ): Promise<ProfileDto>{
        return this.profileService.changeUserProfile(user._id.toString(), changeProfileDto);
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('profile-photo'))
    @Patch('update-photo')
    async updateProfilePhoto(
        @CurrentUser() user: UserDocument,
        @UploadedFile() file: Express.Multer.File
    ){
        return this.profileService.updateProfilePhoto(user._id.toString(), file)
    }
}
