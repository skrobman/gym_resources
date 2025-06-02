import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UserDocument} from "@app/common/models/user.schema";
import { Response } from "express";
import {TokenPayload} from "./interfaces/token-payload.interface";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
      private readonly configService: ConfigService,
      private readonly jwtService: JwtService,
      ) {}

  async login(
      user: UserDocument,
      response: Response
  ){
      //Creates an object with the payload for the token
      const tokenPayload: TokenPayload = {
          userId: user._id.toString(),
      }

      //Calculating cookie expiration time
      const expires = new Date();
      expires.setSeconds(
          expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
      )

      //JWT Token generation
      const token = this.jwtService.sign(tokenPayload);

      response.cookie('Authentication', token, {
          httpOnly: true,
          expires,
      });

      return token;
  }
}
