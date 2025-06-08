import {BadRequestException, Injectable, UnauthorizedException, UnprocessableEntityException} from '@nestjs/common';
import {UsersRepository} from "./users.repository";
import {CreateUserDto} from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import {GetUserDto} from "./dto/get-user.dto";
import {InjectMinio} from "@app/common/decorators/minio.decorator";
import * as Minio from "minio";
import {randomUUID} from "crypto";
import {ConfigService} from "@nestjs/config";
import {ProfileDto} from "./dto/profile.dto";
import {ChangeProfileDto} from "./dto/change-profile.dto";
import {ChangePasswordDto} from "./dto/change-password.dto";
import {UserDocument} from "@app/common/models/user.schema";
import {CurrentUser} from "@app/common/decorators/current-user.decorator";

@Injectable()
export class UsersService{
    protected _bucketName:string;

    constructor(
        private readonly usersRepository: UsersRepository,
        @InjectMinio() private readonly minioService: Minio.Client,
        private readonly configService: ConfigService,
    ) {
        this._bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET');
        if (!this._bucketName) {
            throw new Error('Error with bucket name');
        }
    }

    async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
        await this.validateCreateUserDto(createUserDto);

        const uploadedObjectName:string = await this.uploadFile(file);

        const preSignedUrl:string = await this.minioService.presignedGetObject(
            this._bucketName,
            uploadedObjectName,
            24 * 60 * 60,
        );

        return await this.usersRepository.create({
            email: createUserDto.email,
            password: await bcrypt.hash(createUserDto.password, 10),
            profile: {
                ...createUserDto.profile,
                profile_image: preSignedUrl,
            },
        });
    }

    private async validateCreateUserDto(createUserDto: CreateUserDto) {
        const existingUser = await this.usersRepository.findOne({
            email: createUserDto.email
        }).catch(() => undefined);

        if (existingUser) {
            throw new UnprocessableEntityException(
                `User with email ${createUserDto.email} already exists`
            );
        }
    }

    private async uploadFile(file: Express.Multer.File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const filename = `${randomUUID().toString()}-${file.originalname}`;
            this.minioService.putObject(
                this._bucketName,
                filename,
                file.buffer,
                file.size,
                (error, objInfo) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(filename);
                    }
                },
            );
        });
    }

    async verifyUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({email: email});
        const passwordIsValid = await bcrypt.compare(password, user.password);

        if(!passwordIsValid) {
            throw new UnauthorizedException(`Invalid password`);
        }
        return user;
    }

    async getUserProfile(getUserDto: GetUserDto) {
        return await this.usersRepository.findOne(getUserDto);
    }

    async changeUserProfile(
        userId: string,
        changeProfileDto: ChangeProfileDto,
    ): Promise<ProfileDto> {
        const setObj: Record<string, any> = {};
        for (const [key, value] of Object.entries(changeProfileDto)) {
            setObj[`profile.${key}`] = value;
        }

        const updatedUser = await this.usersRepository.findOneAndUpdate(
            { _id: userId },
            { $set: setObj }
        );

        return updatedUser.profile as ProfileDto;
    }

    async changeUserPassword(
        userId: string,
        changePasswordDto: ChangePasswordDto,
        @CurrentUser() user: UserDocument
        ){

            // Compare old password
            const isMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
            if (!isMatch) {
                throw new BadRequestException('Old password is incorrect');
            }

            // Check if new password is different
            const isSame = await bcrypt.compare(changePasswordDto.newPassword, user.password);
            if (isSame) {
                throw new BadRequestException('New password must be different from old password');
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

            await this.usersRepository.findOneAndUpdate(
                {_id: userId},
                { $set: { password: hashedPassword } },
            )

            return {'msg': 'Password set successfully'};
    }
}