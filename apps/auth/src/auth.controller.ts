import {Body, Controller, Get, Post, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {Response} from "express";
import {CurrentUser} from "@app/common/decorators/current-user.decorator";
import {UserDocument} from "@app/common/models/user.schema";
import {LoginDto} from "./dto/login.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
      @Body() loginDto: LoginDto,
      @CurrentUser() user: UserDocument,
      @Res({ passthrough: true }) response:Response
  ){
    const jwt = await this.authService.login(user, response);

    response.send(user);
  }

}
