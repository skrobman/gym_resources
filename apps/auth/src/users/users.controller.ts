import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {JwtAuthGuard} from "../guards/jwt.guard";
import {GetUserDto} from "./dto/get-user.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(getUserDto: GetUserDto){
        return this.usersService.getUserProfile(getUserDto)
    }
}