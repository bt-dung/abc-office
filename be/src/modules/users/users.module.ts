import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './application/services/users.service';
import { UsersController } from './presentation/http/users.controller';
import { PrismaUserRepository } from './infrastructure/database/prisma/user.prisma.repository';
import { I_USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { StorageModule } from './infrastructure/storage/storage.module';
import { DepartmentsModule } from "../departments/departments.module";
import { PositionsModule } from "../positons/positions.module";

@Module({
  imports: [StorageModule, forwardRef(() => DepartmentsModule), forwardRef(() => PositionsModule)],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: I_USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UsersService, I_USER_REPOSITORY],
})
export class UsersModule { }
