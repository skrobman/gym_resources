import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {DatabaseModule} from "@app/common";
import {UserDocument, UserSchema} from "@app/common/models/user.schema";
import {UsersRepository} from "./users.repository";
import {UploadFileService} from "@app/common/services/upload-file.service";

const UserFeature = DatabaseModule.forFeature([
    { name: UserDocument.name, schema: UserSchema }
]);

@Module({
  imports: [
      DatabaseModule,
      UserFeature
  ],
  providers: [UsersService, UsersRepository, UploadFileService],
  controllers: [UsersController],
  exports: [UsersService, UserFeature]
})
export class UsersModule {}
