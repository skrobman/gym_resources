import { Module } from '@nestjs/common';
import {ProfileService} from "./profile.service";
import {ProfileController} from "./profile.controller";
import {ProfileRepository} from "./profile.repository";
import {UploadFileService} from "@app/common/services/upload-file.service";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [UsersModule],
    providers: [
        ProfileService,
        ProfileRepository,
        UploadFileService
    ],
    controllers: [ProfileController],
    exports: [ProfileService]
})
export class ProfileModule {}
