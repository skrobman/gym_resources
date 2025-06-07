import {Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {JwtAuthGuard} from "../guards/jwt.guard";
import {GetUserDto} from "./dto/get-user.dto";
import {FileInterceptor} from "@nestjs/platform-express";

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
    getProfile(getUserDto: GetUserDto){
        return this.usersService.getUserProfile(getUserDto)
    }
}