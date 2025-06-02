import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { UsersModule } from './users/users.module';
import * as Joi from "joi";
import {JwtModule} from "@nestjs/jwt";
import {LocalStrategy} from "./strategies/local.strategy";

@Module({
  imports: [
      UsersModule,
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: `${process.cwd()}/apps/auth/.env`,
        validationSchema: Joi.object({
          MONGODB_URI: Joi.string().required(),
          // PORT: Joi.number(),
          JWT_SECRET: Joi.string().required(),
          JWT_EXPIRATION: Joi.number().required(),
        })
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService)=> ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`
        }
      }),
      inject: [ConfigService],
    }),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
