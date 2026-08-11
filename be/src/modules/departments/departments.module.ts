import { Module } from '@nestjs/common';
import { DepartmentsService } from './application/services/departments.service';
import { DepartmentsController } from './presentation/http/departments.controller';
import { PrismaDepartmentRepository } from './infrastructure/database/prisma/department.prisma.repository';
import { I_DEPARTMENT_REPOSITORY } from './domain/repositories/department.repository.interface';

@Module({
  controllers: [DepartmentsController],
  providers: [
    DepartmentsService,
    {
      provide: I_DEPARTMENT_REPOSITORY,
      useClass: PrismaDepartmentRepository,
    },
  ],
})
export class DepartmentsModule {}