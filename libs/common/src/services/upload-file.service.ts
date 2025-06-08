import {Injectable} from "@nestjs/common";
import {InjectMinio} from "@app/common/decorators/minio.decorator";
import * as Minio from "minio";
import {ConfigService} from "@nestjs/config";
import {randomUUID} from "crypto";

@Injectable()
export class UploadFileService {
    protected _bucketName:string;

    constructor(
        @InjectMinio() private readonly minioService: Minio.Client,
        private readonly configService: ConfigService,
    ) {
        this._bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET');
        if (!this._bucketName) {
            throw new Error('Error with bucket name');
        }
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
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

    async getPresignedUrl(objectName: string, expiresSeconds = 24 * 60 * 60): Promise<string> {
        return this.minioService.presignedGetObject(
            this._bucketName,
            objectName,
            expiresSeconds,
        );
    }
}