import {Injectable, UnauthorizedException, UnprocessableEntityException} from '@nestjs/common';
import {UsersRepository} from "./users.repository";
import {CreateUserDto} from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import {GetUserDto} from "./dto/get-user.dto";
import {InjectMinio} from "@app/common/decorators/minio.decorator";
import * as Minio from "minio";
import {randomUUID} from "crypto";
import {ConfigService} from "@nestjs/config";

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
}