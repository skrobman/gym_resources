import { Injectable } from '@nestjs/common';
import {ChangeProfileDto} from "../users/dto/change-profile.dto";
import {ProfileDto} from "./dto/profile.dto";
import {ProfileRepository} from "./profile.repository";
import {UploadFileService} from "@app/common/services/upload-file.service";
import {InjectMinio} from "@app/common/decorators/minio.decorator";
import * as Minio from "minio";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class ProfileService {
    protected _bucketName:string;

    constructor(
        private profileRepository: ProfileRepository,
        private uploadFileService: UploadFileService,
        @InjectMinio() private readonly minioService: Minio.Client,
        private readonly configService: ConfigService,
    ) {
        this._bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET');
    }

    async changeUserProfile(
        userId: string,
        changeProfileDto: ChangeProfileDto,
    ): Promise<ProfileDto> {
        const setObj: Record<string, any> = {};
        for (const [key, value] of Object.entries(changeProfileDto)) {
            setObj[`profile.${key}`] = value;
        }

        const updatedUser = await this.profileRepository.findOneAndUpdate(
            { _id: userId },
            { $set: setObj }
        );

        return updatedUser.profile as ProfileDto;
    }

    async updateProfilePhoto(
        userId: string,
        file: Express.Multer.File,

    ){
        const uploadedObjectName:string = await this.uploadFileService.uploadFile(file);

        const preSignedUrl = await this.uploadFileService.getPresignedUrl(uploadedObjectName);

        await this.profileRepository.findOneAndUpdate(
            { _id: userId },
            { $set: { 'profile.profile_image': preSignedUrl } },
        )

        return {"msg": "Profile photo updated successfully"};
    }
}
