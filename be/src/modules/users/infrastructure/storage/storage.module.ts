import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioStorageService } from './storage.service';
import { I_STORAGE_SERVICE } from './storage.interface';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: I_STORAGE_SERVICE,
            useClass: MinioStorageService,
        },
    ],
    exports: [I_STORAGE_SERVICE],
})
export class StorageModule { }