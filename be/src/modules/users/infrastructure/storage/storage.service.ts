import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { IStorageService } from './storage.interface';

@Injectable()
export class MinioStorageService implements IStorageService {
    private readonly minioClient: Minio.Client;
    private readonly bucketName: string;

    constructor(private configService: ConfigService) {
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get<string>('MINIO_ENDPOINT')!,
            port: parseInt(this.configService.get<string>('MINIO_PORT')!, 10),
            useSSL: this.configService.get<string>('MINIO_USE_SSL') === 'true',
            accessKey: this.configService.get<string>('MINIO_ACCESS_KEY')!,
            secretKey: this.configService.get<string>('MINIO_SECRET_KEY')!,
        });
        this.bucketName = this.configService.get<string>('MINIO_BUCKET')!;
    }

    async uploadFile(
        file: Express.Multer.File,
        subfolder: string,
    ): Promise<string> {
        try {
            const extension = path.extname(file.originalname);
            const objectName = `${subfolder}/${uuidv4()}${extension}`;

            console.log('Uploading:', {
                bucket: this.bucketName,
                objectName,
                originalName: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                bufferSize: file.buffer?.length,
            });

            await this.minioClient.putObject(
                this.bucketName,
                objectName,
                file.buffer,
            );

            return objectName;
        } catch (error) {
            console.error('MinIO upload error:', error);

            throw new InternalServerErrorException('Lỗi khi tải file lên.');
        }
    }

    async deleteFile(path: string): Promise<void> {
        try {
            await this.minioClient.removeObject(this.bucketName, path);
        } catch (error) {
            throw new InternalServerErrorException('Lỗi khi xóa file.');
        }
    }
}