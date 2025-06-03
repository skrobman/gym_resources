import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import {TokenPayload} from "../interfaces/token-payload.interface";
import { Request} from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) =>
                    request?.cookies?.Authentication ||
                    request?.headers?.authentication
            ]),
            secretOrKey: configService.get('JWT_SECRET')!
        });
    }

    async validate({ userId }: TokenPayload) {
        return this.usersService.getUserProfile({ _id: userId });
    }
}