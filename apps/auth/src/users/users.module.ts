import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {DatabaseModule} from "@app/common";
import {UserDocument, UserSchema} from "@app/common/models/user.schema";
import {UsersRepository} from "./users.repository";
import {JwtStrategy} from "../strategies/jwt.strategy";

@Module({
  imports: [
      DatabaseModule,
      DatabaseModule.forFeature([
        { name: UserDocument.name, schema: UserSchema}
      ])
  ],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule {}
