import { Module } from '@nestjs/common';
import { UsersService } from './application/services/users.service';
import { UsersController } from './presentation/http/users.controller';
import { PrismaUserRepository } from './infrastructure/database/prisma/user.prisma.repository';
import { I_USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { StorageModule } from './infrastructure/storage/storage.module';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [StorageModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    {
      provide: I_USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule { }